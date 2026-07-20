Issue Summary

After installing the Docker Compose and Buildx CLI plugins for both the root and jenkins users, the Jenkins pipeline advanced beyond the previous plugin-related errors. However, it failed during the docker compose build --no-cache stage with a permission denied error while connecting to the Docker daemon through /var/run/docker.sock. The root cause was that the jenkins user did not have permission to access the Docker socket.

Solution Summary

Resolved the issue by adding the jenkins user to the docker group, verifying the group membership, ensuring the Docker socket had the correct ownership and permissions, and restarting the Jenkins service so the new group membership took effect. After these changes, the Jenkins pipeline was able to communicate with the Docker daemon and execute Docker Compose commands successfully.

Commands Used
# Verify Jenkins user groups
groups jenkins
id jenkins

# Add Jenkins user to the Docker group
sudo usermod -aG docker jenkins

# Verify Docker socket permissions
ls -l /var/run/docker.sock

# (If required) Correct Docker socket ownership and permissions
sudo chown root:docker /var/run/docker.sock
sudo chmod 660 /var/run/docker.sock

# Restart Docker (if socket permissions were changed)
sudo systemctl restart docker

# Restart Jenkins to apply new group membership
sudo systemctl restart jenkins

# Verify Docker access as Jenkins
sudo -u jenkins docker ps

# Verify Docker Compose and Buildx
sudo -u jenkins docker compose version
sudo -u jenkins docker buildx version

This resolved the permission denied while trying to connect to the Docker daemon socket error and allowed the Jenkins pipeline to build Docker images successfully.