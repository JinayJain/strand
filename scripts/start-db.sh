#!/bin/bash

APP_NAME="strand"
VOLUME_NAME="${APP_NAME}-db-data"
CONTAINER_NAME="${APP_NAME}-db"

DB_USER="strand"
DB_PASSWORD="strand"

# check if the container exists
if [ "$(docker ps -a -q -f name=$CONTAINER_NAME)" ]; then
  echo "Container $CONTAINER_NAME already exists. Stopping it..."
  docker stop $CONTAINER_NAME
fi

# create the volume, if it doesn't exist
docker volume create --name $VOLUME_NAME 

# start the database container
docker run -d \
  --name $CONTAINER_NAME \
  --rm \
  -p 5432:5432 \
  -v $VOLUME_NAME:/var/lib/postgresql/data \
    -e POSTGRES_USER=$DB_USER \
    -e POSTGRES_PASSWORD=$DB_PASSWORD \
    -e POSTGRES_DB=$APP_NAME \
  postgres:16