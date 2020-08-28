from abc import abstractmethod


class Error(Exception):
    @abstractmethod
    def msg(self):
        pass


class UserInitError(Error):
    def __init__(self, user, exec_info):
        self.user = user
        self.exec_info = exec_info

    def msg(self):
        return f"Error: User init error occured\nAdditional info:{self.exec_info}"


class UserValidationError(Error):
    def __init__(self, user, exec_info):
        self.user = user
        self.exec_info = exec_info

    def msg(self):
        return f"Error: User validation error - SSH connection error. \nAdditional info:{self.exec_info}"


class UserRegistrationError(Error):
    def __init__(self, user, exec_info):
        self.user = user
        self.exec_info = exec_info

    def msg(self):
        return f"Error: User registration error. \nAdditional info:{self.exec_info.msg()}"
