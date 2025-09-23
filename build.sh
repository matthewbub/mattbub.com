#!/bin/bash

set -e

echo "Building docker image..."
# Get Git commit SHA, fallback to "unknown" if not available
if git rev-parse HEAD >/dev/null 2>&1; then
  GIT_COMMIT=$(git rev-parse HEAD)
  echo "Using Git commit: $GIT_COMMIT"
else
  GIT_COMMIT="unknown"
  echo "Git repository not found, using: $GIT_COMMIT"
fi
docker build --build-arg GIT_COMMIT="$GIT_COMMIT" -t mattbub .

echo "Stopping container named mattbub if it exists..."
docker stop mattbub >/dev/null 2>&1 || true
docker rm mattbub >/dev/null 2>&1 || true

echo "Stopping containers using port 8090..."
CID_ON_PORT=$(docker ps --format '{{.ID}} {{.Ports}}' | grep ":8090->" | awk '{print $1}')
if [ -n "$CID_ON_PORT" ]; then
  echo "Stopping container $CID_ON_PORT"
  docker stop "$CID_ON_PORT" >/dev/null 2>&1 || true
  docker rm "$CID_ON_PORT" >/dev/null 2>&1 || true
fi

echo "Running docker container..."
docker run -d --name mattbub -p 8090:8090 -v app-data:/root/data mattbub

echo "Completed"