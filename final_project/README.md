<p align="center">
    <img width="250" height="250" src="tidy-logo.png">
</p>

# StayTidy project

## API documentation
Press [here](https://documenter.getpostman.com/view/8320454/TVCb4VyR)

## Installation and contribution

1. clone repository - `git clone https://github.com/GalRabin/csharp-course`

2. Install requirments - `pip install -r requirements.txt`

3. Rebuild docker image - `docker build -t galrabin/final_project:<version> .`

4. Run docker image:
    - Windows - `docker run -p 8000:8000 -v C:/Users/user/.aws:/home/app/.aws/ galrabin/final_project:1.1`
    - Unix - `docker run -p 8000:8000 -v $HOME/.aws:/home/app/.aws/ galrabin/final_project:1.1`
