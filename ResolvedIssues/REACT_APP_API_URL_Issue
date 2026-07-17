Query

Why did my React frontend continue calling the old backend URL (http://<old-ip>:8000) even after updating the .env file, deleting Docker images locally and from the registry, and running docker compose up -d?

Summary
Problem

After changing REACT_APP_API_URL from the EC2 private IP to http://localhost:8000, the frontend still made API requests to the old IP address.

Investigation
Verified both .env files contained http://localhost:8000.

Ran docker compose config and confirmed:

REACT_APP_API_URL: http://localhost:8000
Confirmed no other environment variable was overriding the value.
Despite deleting images and rebuilding with docker compose up -d, the frontend still used the old backend URL.
Root Cause

The React application had been built using Docker's BuildKit cache. Since React embeds REACT_APP_* variables during build time, Docker reused the cached npm run build layer, which still contained the old backend URL.

Deleting images alone did not remove Docker's build cache.

Solution

Force Docker to ignore the cached build layers:

docker compose build --no-cache frontend
docker compose up -d

This rebuilt the React application from scratch and embedded the updated REACT_APP_API_URL.

Key Learning
React environment variables (REACT_APP_*) are build-time variables, not runtime variables.
docker compose up --build may still reuse cached build layers.
docker compose build --no-cache forces a completely fresh build.
Docker images and Docker build cache are different; removing images does not necessarily clear cached build layers.
Best Practice

Whenever a frontend build-time environment variable changes (e.g., REACT_APP_API_URL), rebuild the frontend without cache:

docker compose build --no-cache frontend
docker compose up -d

This ensures the generated JavaScript bundle contains the latest configuration instead of stale cached values.