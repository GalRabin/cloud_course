FROM python

ENV AWS_DEFAULT_REGION us-east-2

ENV HOME /home/app
WORKDIR /home/app

COPY requirements.txt ./
RUN apt-get update && apt-get install sshpass
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD [ "python", "./server.py" ]