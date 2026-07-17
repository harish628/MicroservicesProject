Issue: docker compose build requires Buildx 0.17.0 or later
Problem

While running the following command on an Amazon Linux 2023 EC2 instance:

docker compose build --no-cache

Docker failed with the error:

compose build requires buildx 0.17.0 or later
Root Cause
Docker Engine version: 25.0.16
Docker Compose version: v5.3.1
Installed Buildx version: 0.12.1, which is older than the required 0.17.0.

While attempting to upgrade Buildx using:

curl -SL https://github.com/docker/buildx/releases/latest/download/buildx-linux-amd64 \
-o ~/.docker/cli-plugins/docker-buildx

only a 9-byte file was downloaded containing:

Not Found

This caused the following error:

failed to fetch metadata: fork/exec /root/.docker/cli-plugins/docker-buildx: exec format error

because Docker tried to execute the downloaded text file instead of a valid binary.

Resolution
Removed the invalid Buildx plugin:
rm -f ~/.docker/cli-plugins/docker-buildx
Downloaded a specific Buildx release instead of using the latest URL:
mkdir -p ~/.docker/cli-plugins

curl -L \
https://github.com/docker/buildx/releases/download/v0.28.0/buildx-v0.28.0.linux-amd64 \
-o ~/.docker/cli-plugins/docker-buildx

chmod +x ~/.docker/cli-plugins/docker-buildx
Verified the installation:
docker buildx version

Output:

github.com/docker/buildx v0.28.0
Key Learnings
Verify the installed Buildx version using:
docker buildx version
If a downloaded binary is only a few bytes (e.g., 9 bytes), check its contents using:
cat ~/.docker/cli-plugins/docker-buildx

A response such as Not Found indicates that the download URL is invalid.

Prefer downloading a specific Buildx release (for example, v0.28.0) instead of relying on the latest/download URL when it is unavailable or redirected incorrectly.
Commands Used
docker version
docker compose version
docker buildx version
cat /etc/os-release
uname -m
ls -lh ~/.docker/cli-plugins/docker-buildx
cat ~/.docker/cli-plugins/docker-buildx
rm -f ~/.docker/cli-plugins/docker-buildx
mkdir -p ~/.docker/cli-plugins
curl -L https://github.com/docker/buildx/releases/download/v0.28.0/buildx-v0.28.0.linux-amd64 -o ~/.docker/cli-plugins/docker-buildx
chmod +x ~/.docker/cli-plugins/docker-buildx
docker buildx version