#!/bin/bash

set -e

echo "Building docker image..."
docker build --build-arg GIT_COMMIT=$(git rev-parse HEAD) -t mattbub .

echo "Stopping container named mattbub if it exists..."
docker rm -f mattbub >/dev/null 2>&1 || true

echo "Stopping containers using port 8090..."
CID_ON_PORT=$(docker ps --format '{{.ID}} {{.Ports}}' | awk '/:8090->/ {print $1}')
if [ -n "$CID_ON_PORT" ]; then
  echo "$CID_ON_PORT" | xargs docker rm -f
fi

echo "Running docker container..."
docker run -d --name mattbub -p 8090:8090 -v app-data:/root/data mattbub

echo "Completed"