#!/bin/bash

read PC_NAME < POOLCONTROLLER_NAME
read PC_VERSION < POOLCONTROLLER_VERSION

echo building version ${PC_NAME}:${PC_VERSION}

docker build . --build-arg PC_VERSION=${PC_VERSION} -t ${PC_NAME}:${PC_VERSION}
docker build . --build-arg PC_VERSION=${PC_VERSION} -t ${PC_NAME}:latest
