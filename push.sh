#!/bin/bash

read PC_NAME < POOLCONTROLLER_NAME
read PC_VERSION < POOLCONTROLLER_VERSION

echo pushing ${PC_NAME}:${PC_VERSION}

docker push ${PC_NAME}:${PC_VERSION}
docker push ${PC_NAME}:latest

