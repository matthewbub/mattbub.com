# List volumes and confirm 'app-data' exists
docker volume ls

# See where Docker stores it on disk
docker volume inspect app-data

mkdir -p ~/app-data-backup
docker run --rm -v app-data:/from -v "$PWD":/to alpine sh -c 'cp -a /from/. /to/'
# files now in $PWD

