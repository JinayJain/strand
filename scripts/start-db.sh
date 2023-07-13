#!/bin/bash

docker run --rm -p 5432:5432 --env-file .env -v ${PWD}/dbdata:/var/lib/postgresql/data postgres:14