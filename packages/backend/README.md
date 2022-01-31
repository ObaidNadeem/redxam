# Backend

### Graphql Schema

> New fields in the backend need to be added to the resolver and to the schema of the Query

## Style Guide

> Here are redxam we follow the Airbnb standard.

[Airbnb React Style Guide](https://github.com/airbnb/javascript/tree/master/react)

## Running docker

### Installation & Usage:

1. Download and install Docker from its official website, [guide](https://docs.docker.com/get-started/#download-and-install-docker).
2. Download and install Docker Compose, [guide](https://docs.docker.com/compose/install/).
3. Go to this project's directory.
4. Build the docker image using `npm run build:docker`.
5. Start the image by using:
   - If you want to run it as a background process, use `docker-compose up -d`.
   - If you want to run it as a foreground process, use `docker-compose up`.

### More info:

- The environment file is automatically loaded into the image by docker-compose.
- The exposed port is `5005`.
- The version of docker engine used was `20.10.8`.
- The version of docker desktop used was `4.1.1`.
