# Description
Script for converting `<file>.json.gz`/ `<file>.csv` to avro file.\
The convertered files will be stored in the following structure:
* records - All `<file>.json.gz` files
* sensors - All `<file>.csv` files

## Installation
```
pip3 install requirements
```

## USAGE
**AWS credentails must be configured in enviorment before using this script for uploading to bucket**\
| Arg | Description | Optional |
| --- | --- | --- |
| src | folder containg `<file>.json.gz` files `<file>.json.gz`/ `<file>.csv` | False |
| dest | destinating to store converted files. | False |
| bucket | bucket name to upload the files to | True |

```shell script
./parser.py --src <dir_of_files_to_convert> --dest <dir_to_create_results> --bucket <bucket_name_to_upload_files>
```