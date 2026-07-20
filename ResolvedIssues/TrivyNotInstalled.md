Issue: Trivy Not Installed on Amazon Linux

Issue Description:
The Jenkins pipeline required Trivy to perform Docker image vulnerability scanning, but Trivy was not installed on the Amazon Linux server. As a result, Docker images could not be scanned for security vulnerabilities before being pushed to the Docker registry.

Solution:

Add the Trivy repository:

cat <<EOF | sudo tee /etc/yum.repos.d/trivy.repo
[trivy]
name=Trivy repository
baseurl=https://aquasecurity.github.io/trivy-repo/rpm/releases/\$basearch/
gpgcheck=0
enabled=1
EOF

Install Trivy:

sudo yum install trivy -y

Verify the installation:

trivy --version

Download the vulnerability database:

trivy image --download-db-only

Scan a Docker image:

trivy image shopflow-api-gateway:latest
Outcome:

Trivy was successfully installed and integrated into the Jenkins CI/CD pipeline. Docker images are now scanned for vulnerabilities after the build stage and before being pushed to the Docker registry, improving the security of the deployment process.