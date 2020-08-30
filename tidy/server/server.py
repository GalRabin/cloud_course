from flask import Flask, request, make_response
from objects import JobManager, Profile, User, Job
from utils.common import handle_response, jsonify_objects


APP = Flask(__name__)
API_VERSION = 'api/v1'
INTERNAL = 'internal'


#########
# Users #
#########


@APP.route(f'/{INTERNAL}/create-users-table', methods=['POST'])
def create_users_table():
    return handle_response(User.create_table())


@APP.route(f'/{API_VERSION}/list-users', methods=['GET'])
def list_users():
    return jsonify_objects(User.list())


@APP.route(f'/{API_VERSION}/user', methods=['GET', 'POST', 'DELETE'])
def user():
    response = None
    if request.method == 'POST':
        response = handle_response(User(**request.json).put())
    elif request.method == 'GET':
        try:
            response = User.get(request.json.get('uuid')).to_dict()
        except (AttributeError, KeyError):
            response = make_response(f"Unable to find item with uuid {request.json.get('uuid')}")
    elif request.method == 'DELETE':
        response = handle_response(User.delete(request.json.get('uuid')))

    return response


############
# Profiles #
############


@APP.route(f'/{INTERNAL}/create-profiles-table', methods=['POST'])
def create_profiles_table():
    return handle_response(Profile.create_table())


@APP.route(f'/{API_VERSION}/list-profiles', methods=['GET'])
def list_profiles():
    return jsonify_objects(Profile.list())


@APP.route(f'/{API_VERSION}/profile', methods=['GET', 'POST', 'DELETE'])
def profile():
    response = None
    if request.method == 'POST':
        response = handle_response(Profile(**request.json).put())
    elif request.method == 'GET':
        try:
            response = Profile.get(request.json.get('uuid')).to_dict()
        except (AttributeError, KeyError):
            response = make_response(f"Unable to find item with uuid {request.json.get('uuid')}")
    elif request.method == 'DELETE':
        response = handle_response(Profile.delete(request.json.get('uuid')))

    return response


########
# Jobs #
########


@APP.route(f'/{INTERNAL}/create-jobs-table', methods=['POST'])
def create_jobs_table():
    return handle_response(Job.create_table())


@APP.route(f'/{API_VERSION}/list-jobs', methods=['GET'])
def list_jobs():
    return jsonify_objects(Job.list())


@APP.route(f'/{API_VERSION}/job', methods=['GET', 'POST'])
def job():
    response = None
    if request.method == 'POST':
        response = handle_response(Job(**request.json).put())
    elif request.method == 'GET':
        try:
            response = Job.get(request.json.get('uuid')).to_dict()
        except (AttributeError, KeyError):
            response = make_response(f"Unable to find item with uuid {request.json.get('uuid')}", 500)

    return response


@APP.route(f'/{API_VERSION}/job/execute/<uuid>', methods=['POST'])
def job_execute(uuid: str):
    return handle_response(JobManager.execute_job(uuid))


@APP.route(f'/{API_VERSION}/job/status/<uuid>', methods=['GET'])
def job_status(uuid: str):
    try:
        res = JobManager.job_status(uuid)
    except Exception:
        return make_response(f"Job {uuid} not executed yet", 500)

    return handle_response(res)


if __name__ == '__main__':
    APP.run(host='0.0.0.0', port=8000, debug=True)
