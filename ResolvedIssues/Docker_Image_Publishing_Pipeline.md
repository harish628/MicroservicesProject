Issue

docker compose push could not push images because:

Jenkins wasn't authenticated to Docker Hub.
Images were not tagged with the Docker Hub repository name (username/image:tag).
Resolution
Generated a Docker Hub Personal Access Token (PAT).
Stored it in Jenkins Credentials as a Username with Password credential.

Logged in to Docker Hub in the Jenkins pipeline using:

echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

Updated the docker-compose.yml to include the correct image: names, for example:

image: harish628/auth-service:latest

Built the images:

docker compose build --no-cache

Pushed all images with a single command:

docker compose push

Result: Jenkins successfully authenticated with Docker Hub and pushed all Docker Compose images to the Docker Hub repositories using docker compose push.