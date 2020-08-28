from typing import List, Optional
import click
from pathlib import Path
import pandas
from time import strftime
import logging
from boto3 import client
from botocore.exceptions import ClientError

global logger


def init_logger():
    """ Init logger for loggin to console"""
    global logger
    logger = logging.getLogger('Parquet-converter')
    logger.setLevel(logging.INFO)
    ch = logging.StreamHandler()
    ch.setLevel(logging.INFO)
    formatter = logging.Formatter('%(name)s - %(message)s')
    ch.setFormatter(formatter)
    logger.addHandler(ch)


def upload_file(file_name: Path, bucket: str, object_name: Optional[str] = None):
    """Upload a file to an S3 bucket

    :param file_name: File to upload
    :param bucket: Bucket to upload to
    :param object_name: S3 object name. If not specified then file_name is used
    :return: True if file was uploaded, else False
    """

    # Upload the file
    s3_client = client('s3')
    try:
        s3_client.upload_file(str(file_name), bucket, object_name)
    except ClientError as e:
        logger.error(e)

    logger.info(f"{object_name} uploaded succesfully to bucket {bucket}")


def converter_handler(dest: Path, orig_file: Path) -> str:
    """ Converting source file to new converted file in format of Parquet

    :param dest: destionation deirectory to locate the new converted files
    :param orig_file: source converted file
    :return new converted file name
    """
    logger.info(f"Analyzing file {orig_file.name}")
    # Extract file content
    content = None
    converted_file_path = None
    if 'json.gz' in orig_file.name:
        content = pandas.read_json(orig_file, lines=True)
        converted_file_path = dest / 'records' / ".".join(str(orig_file.name).split('.')[:-2])
    if '.csv' in orig_file.suffix:
        content = pandas.read_csv(orig_file)
        content.columns = ['Sensor', 'Pricing']
        converted_file_path = dest / 'sensors' / orig_file.stem
    # Convert file to avro
    if content is not None and converted_file_path:
        converted_file_path = str(converted_file_path) + '.parquet'
        content.to_parquet(converted_file_path, compression='gzip')
        logger.info(f"File converted from {orig_file.name} to {Path(converted_file_path).name}")

    return converted_file_path


def creating_folder_structure(dest: str) -> Path:
    dest = Path(dest) / f'parquet_converted_files_{strftime("%Y%m%d-%H%M%S")}'
    dest.mkdir()
    for folder in ['records', 'sensors']:
        sub_folder = dest / folder
        sub_folder.mkdir()

    return dest


@click.command()
@click.option('--src', help='Source folder', type=click.Path(exists=True, resolve_path=True))
@click.option('--dest', help='Results destination', type=click.Path(resolve_path=True))
@click.option('--bucket', help='Bucket name to upload converted avro files to')
def converter(src: str, dest: str, bucket: str):
    """Simple CLI for converting files in folder to parquet files and upload to S3 bucket"""
    dest = creating_folder_structure(dest)
    logger.info(f"Creating converted files in directory - {dest}")
    # Converting files
    for file in Path(src).iterdir():
        converted_file = converter_handler(dest, file)
        if bucket and converted_file:
            upload_file(file_name=converted_file,
                        bucket=bucket,
                        object_name=str(Path(converted_file).relative_to(dest)))


if __name__ == '__main__':
    init_logger()
    converter()
