from typing import List, Optional
from click import Path, command, option
from pathlib import Path
from gzip import open
from ndjson import load
import avro.schema
from avro.datafile import DataFileWriter
from avro.io import DatumWriter
from csv import DictReader
from time import strftime
import logging
from boto3 import client
from botocore.exceptions import ClientError
from enum import Enum

global logger


class DataType(Enum):
    NONE = 0
    RECORD = 1
    SENSOR = 2


datatype_metadata = {
    DataType.RECORD:
        {
            'scheme': './avro_schemes/records.avro',
            'folder': 'records'
        },
    DataType.SENSOR:
        {
            'scheme': './avro_schemes/sensors.avro',
            'folder': 'sensors'
        }
}


def init_logger():
    """ Init logger for loggin to console"""
    global logger
    logger = logging.getLogger('Avro-converter')
    logger.setLevel(logging.INFO)
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    formatter = logging.Formatter('%(name)s - %(levelname)s - %(message)s')
    ch.setFormatter(formatter)
    logger.addHandler(ch)


def create_s3_folder(bucket: str, folder: str):
    s3_client = client('s3')
    try:
        s3_client.put_object(Bucket=bucket, Key=(folder + '/'))
    except ClientError as e:
        logger.error(e)
    logger.info(f"Folder /{folder} created in Bucket {bucket}")


def creating_s3_folders_structure(bucket: str):
    for value in datatype_metadata.values():
        create_s3_folder(bucket, value['folder'])


def upload_file(file_name: Path, folder: str, bucket: str, object_name: Optional[str] = None):
    """Upload a file to an S3 bucket

    :param file_name: File to upload
    :param folder: Folder to place the file in.
    :param bucket: Bucket to upload to
    :param object_name: S3 object name. If not specified then file_name is used
    :return: True if file was uploaded, else False
    """

    # If S3 object_name was not specified, use file_name
    if object_name is None:
        object_name = f'{folder}/{file_name.name}'

    # Upload the file
    s3_client = client('s3')
    try:
        s3_client.upload_file(str(file_name), bucket, object_name)
    except ClientError as e:
        logger.error(e)

    logger.info(f"{object_name} uploaded succesfully to bucket {bucket}")


def extract_nd_json_gz(file: Path) -> List[dict]:
    """Extract <file>.json.gz file
    File contains nd-json converted to list of dicts, In addition replacing the type of sensor
    to integer.

    :param file: file object to extract from
    :return: list of records as dict
    """
    with open(filename=str(file)) as f:
        data = load(f)
    # Fixing types
    for record in data:
        logger.debug(record)
        record["Sensor"] = int(record["Sensor"])

    return data


def extract_csv(file: Path) -> List[dict]:
    """ Extract csv file.
    File contains csv records converted to list of dicts, In addition fixing Pricing key to correct one and changing
    tpyes: Sensor-integer, Pricing: float.

    :param file: CSV file
    :return: list of records as dict
    """
    data = list(DictReader(file.open()))
    # Fixing types and keys
    for record in data:
        logger.debug(record)
        record["Sensor"] = int(record["Sensor"])
        temp = float(record[" Pricing"])
        record.pop(" Pricing")
        record["Pricing"] = temp

    return data


def convert_to_avro(content: List[dict], scheme: str, file: Path, dest: Path):
    """ Convertign records to avro by supplied scheme.

    :param content: list of records as dict
    :param scheme: scheme avro file name.
    :param file: file name the file converted from (using it for naming the new file.
    :param dest: destination folder to place the new converted file.
    """
    schema = avro.schema.parse(open(scheme, "rb").read())
    new_file = file.stem
    if '.json.gz' in file.name:
        new_file = ".".join(new_file.split('.')[:-1])

    converted_file = dest / (new_file + '.avro')
    writer = DataFileWriter(converted_file.open(mode='wb'), DatumWriter(), schema)
    for record in content:
        writer.append(record)
    writer.close()

    return converted_file


def converter_handler(dest: Path, file: Path) -> str:
    """ Converting source file to new converted file in format of Avro

    :param dest: destionation deirectory to locate the new converted files
    :param file: source converted file
    :return new converted file name
    """
    logger.info(f"Analyzing file {file.name}")
    data_type = DataType.NONE
    folder = ''
    content = []
    converted_file = ''
    # Extract file content
    if 'json.gz' in file.name:
        content = extract_nd_json_gz(file)
        data_type = DataType.RECORD
    if '.csv' in file.suffix:
        content = extract_csv(file)
        data_type = DataType.SENSOR
    # Convert file to avro
    if data_type != DataType.NONE:
        folder = datatype_metadata[data_type]['folder']
        converted_file = convert_to_avro(content,
                                         datatype_metadata[data_type]['scheme'],
                                         file,
                                         dest)
        logger.info(f"File converted from {file.name} to {converted_file.name}")

    return converted_file, folder


def creating_folder_structure(dest: str) -> Path:
    dest = Path(dest) / f'avro_converted_files_{strftime("%Y%m%d-%H%M%S")}'
    dest.mkdir()
    for value in datatype_metadata.values():
        sub_folder = dest / value['folder']
        sub_folder.mkdir()

    return dest


@command()
@option('--src', help='Source folder', type=Path(exists=True, resolve_path=True))
@option('--dest', help='Conver nd-json gzip files to Avro ', type=Path(exists=True, resolve_path=True))
@option('--bucket', help='Bucket name to upload converted avro files to')
def converter(src: str, dest: str, bucket: str):
    """Simple CLI for converting files in folder to avro files and upload to S3 bucket"""
    dest = creating_folder_structure(dest)
    logger.info(f"Creating converted files in directory - {dest}")
    # Creating S3 bucket strucure
    if bucket:
        creating_s3_folders_structure(bucket)
    # Converting files
    for file in Path(src).iterdir():
        converted_file, folder = converter_handler(dest, file)
        if bucket and converted_file:
            upload_file(file_name=converted_file,
                        bucket=bucket,
                        folder=folder)


if __name__ == '__main__':
    init_logger()
    converter()
