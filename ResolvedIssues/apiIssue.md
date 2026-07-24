Issue:
Frontend was sending API requests with a duplicated /api path because REACT_APP_API_URL was set to /api.

Resolution:
Set REACT_APP_API_URL to an empty string ("") and rebuild the frontend image so React uses relative API paths.

Changes:

args:
  REACT_APP_API_URL: ""

Commands:

docker compose build --no-cache frontend
docker compose up -d frontend