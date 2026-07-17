Issue: Extracting .env Variables from docker-compose.yml
Problem

A docker-compose.yml file may contain a mix of:

Hardcoded environment variables.
Variables loaded from a .env file using ${VARIABLE} syntax.

Before deploying or sharing the project, it is useful to identify which values must be defined in the .env file.

How to Identify .env Variables

Only values referenced using the following syntax are read from the .env file:

environment:
  MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}

or with a default value:

MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-root}

Variables written directly are not read from .env:

DB_HOST: mysql
DB_PORT: 3306
PORT: 8001
.env Variables Found
MYSQL_ROOT_PASSWORD=root

JWT_SECRET=

EMAIL_ENABLED=false
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=ShopFlow <noreply@shopflow.com>
Hardcoded Variables (Not Required in .env)

These values are fixed in the compose file and do not need to be present in .env unless you choose to parameterize them:

DB_HOST
DB_PORT
DB_USER
DB_NAME
PORT
AUTH_SERVICE_URL
PRODUCT_SERVICE_URL
ORDER_SERVICE_URL
PAYMENT_SERVICE_URL
NOTIFICATION_SERVICE_URL
PAYMENT_SUCCESS_RATE
ALLOWED_ORIGINS
REACT_APP_API_URL
Key Takeaway
${VARIABLE} → Value is loaded from the .env file.
${VARIABLE:-default} → Value is loaded from .env; if not found, Docker Compose uses the specified default.
Direct values (e.g., DB_HOST: mysql) → Stored in docker-compose.yml and do not require a .env entry.
Best Practice
Keep secrets (passwords, API keys, JWT secrets, SMTP credentials) in the .env file or a secret management solution.
Keep non-sensitive configuration (ports, service names, internal URLs) in docker-compose.yml.
Commit a .env.example file with placeholder values to Git, and keep the actual .env file out of version control by adding it to .gitignore.