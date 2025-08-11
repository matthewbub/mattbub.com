#!/bin/bash

echo "Building docker image..."
docker build --build-arg GIT_COMMIT=$(git rev-parse HEAD) -t mattbub .

sleep 5

echo "Stopping docker container..."
CID=$(docker ps -q -f name=mattbub)
echo "Container ID is: $CID"

sleep 5


if [ -n "$CID" ]; then
  echo "Stopping container..."
  docker kill $CID
fi

sleep 5

echo "Removing docker container..."
docker rm mattbub

sleep 5

echo "Running docker container..."
docker run -d -p 8090:8090 -v app-data:/root/data mattbub

echo "Completed"