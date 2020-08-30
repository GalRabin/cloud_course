
<p align="center">
    <img width="250" height="250" src="docs/tidy-logo.png">
</p>

# Tidy project

## Description

Tidy project is a SAS solution which allow enterprise to install/update/fix existing employees development enviorment.

### Terminology:
 - **Users** – User is configuration of PCs in the organization. (Username, Password, IP in VPN).
 - **Profiles** – Profile is configuration of set of tools used by specific Employee/Team in enterprise. (IDEs,  - git/svn etc)
 - **Jobs** – Jon is configuration of profile and user combined (User is part of specific team or multiple)


## API documentation

Press [here](https://documenter.getpostman.com/view/8320454/TVCb4VyR)

## Local usage

> Requirements - Docker engine and docker-compose shoudl be installed and running.

1. clone repository - `git clone https://github.com/GalRabin/csharp-course`

2. Install docker and docker-compose.

3. Run containers: `docker-compose up`

## AWS - Kubernetes deployment

> Requirements - aws cli and kubectl cli shoudl be configured.

1. Create aws cluster:

    ```shell
    eksctl create EKS cluster \
    --name tidy \
    --version 1.16 \
    --without-nodegroup
    ```

2. Create aws EKS nodes-group (Currently 1 node only):

    ```shell
    eksctl create nodegroup \
    --cluster tidy \
    --version 1.16 \
    --name tidy-node-group \
    --node-type t2.small \
    --nodes 1 \
    --nodes-min 1 \
    --nodes-max 2 \
    --node-ami auto
    ```

3. Create persistent volume for Open-VPN conf: `kubectl apply -f k8s/persist-volume.yaml`

4. Create deployment with `Open-VPN` and `Tidy`: `kubectl apply -f k8s/deployment.yaml`

5. Create service which expose services to Public network: `kubectl apply -f k8s/service.yaml`
