Issue

The application required a unique JWT secret for every deployment, but the .env file contained a hardcoded JWT_SECRET value. Updating it manually before each build was time-consuming and not suitable for an automated CI/CD pipeline.

Solution

Implemented a Jenkins pipeline stage that generates a new JWT secret using openssl rand -base64 32 during each pipeline run. The generated value is captured and used to replace the existing JWT_SECRET entry in the .env file using sed, ensuring the application always uses a fresh secret before the Docker image is built.

Command Used:

openssl rand -base64 32

Update Command:

sed -i 's|^JWT_SECRET=.*|JWT_SECRET=<generated_secret>|' shopflow-project/.env

This automated the JWT secret generation and eliminated the need for manual updates during deployments.