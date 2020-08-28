# Description
Script for converting `<file>.json.gz`/ `<file>.csv` to Parquet file.\
The convertered files will be stored in the following structure:
* records - All `<file>.json.gz` files --> `<file>.parquet`
* sensors - All `<file>.csv` files --> `<file>.parquet`

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
| bucket | bucket name to upload the files to, If not specified created only locally | True |

```shell script
python ./converter --src ./converter/data --dest ./ --bucket <bucket_name_to_upload_files>
```
> Will create directory locally and upload to specified bucket.