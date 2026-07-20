Short Summary: Docker Image Cleanup Issue

Problem:
The Docker host had many old images consuming disk space and causing clutter before new builds.

Solution:
Removed all existing Docker images (and, if required, the containers using them) using Docker CLI commands.

# Stop and remove all containers
docker stop $(docker ps -aq)
docker rm -f $(docker ps -aq)

# Remove all Docker images
docker rmi -f $(docker images -aq)

Alternative (complete cleanup):

docker system prune -a --volumes -f

Result:
The Docker environment was cleaned, freeing disk space and ensuring subsequent image builds started from a fresh state.