# ShopFlow — Docker Compose Setup

## What this is
A single command to run all 9 containers (MySQL + 8 services) together,
fully networked, instead of running 8 separate `docker run` commands by hand.

## Folder structure expected
```
shopflow-project/
├── docker-compose.yml      <- this file
├── .env                    <- your real secrets go here
├── mysql-init/
│   └── 01-create-databases.sql
├── auth-service/           <- each with its own Dockerfile already inside
├── product-service/
├── order-service/
├── payment-service/
├── notification-service/
├── api-gateway/
├── frontend/
└── admin-dashboard/
```

## First-time setup

1. Make sure every one of the 8 service folders already has its `Dockerfile`
   inside it (you should have these from earlier).
2. Edit `.env` at the root — at minimum, set a real `JWT_SECRET`:
   ```bash
   openssl rand -base64 32
   ```
3. If you want real emails sent (not just console logs), fill in
   `EMAIL_USER` and `EMAIL_PASS` (Gmail App Password) and set
   `EMAIL_ENABLED=true`.

## Running everything

```bash
cd shopflow-project
docker compose up --build
```

- `--build` forces Docker to (re)build every service's image from its
  Dockerfile before starting. You only strictly need `--build` the first
  time, or after changing any source code — but it's a safe habit to
  always include it.
- This will take a few minutes the FIRST time (downloading base images,
  installing dependencies). Subsequent runs are much faster due to caching.

## Watching it start up correctly

You'll see MySQL start first, then go through its healthcheck (the
`mysqladmin ping` retries from the design plan). Backend services wait
for that healthcheck to pass before they even attempt to start — this is
the fix for the "MySQL not ready yet" race condition.

## Verifying everything is connected

Once everything shows as running, open a new terminal and run:

```bash
curl http://localhost:8000/health/all
```

You should see `"gateway_status": "ALL_SYSTEMS_OPERATIONAL"` with every
service showing `"status": "UP"`. If anything shows `DOWN`, check that
specific service's logs:

```bash
docker compose logs auth-service
docker compose logs product-service
# etc.
```

## Stopping everything

```bash
docker compose down
```

This stops and removes the containers, but your MySQL data is SAFE — it
lives in the `mysql-data` volume, which `down` does not touch.

## Starting completely fresh (wipes the database too)

```bash
docker compose down -v
```

The `-v` flag also removes the volume — use this if you want
`mysql-init/01-create-databases.sql` to actually re-run (it only runs on
a genuinely empty MySQL data directory).

## Rebuilding just ONE service after a code change

```bash
docker compose up --build auth-service
```

This rebuilds and restarts only `auth-service`, leaving everything else
running untouched.
