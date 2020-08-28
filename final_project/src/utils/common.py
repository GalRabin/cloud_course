from pathlib import Path

from flask import jsonify, make_response

from src.utils.responses import ServerResponseDynamo


def get_src_root():
    return Path(__file__).parent.parent.parent


def jsonify_objects(objects: list):
    return jsonify([item.to_dict() for item in objects])


def handle_response(response: ServerResponseDynamo):
    status_code = 200
    if response.is_fail():
        status_code = 500

    return make_response(response.to_dict(), status_code)
