# ShopFlow Microservices Architecture Overview

## Architecture

The ShopFlow application follows a **Microservices Architecture** with an **API Gateway** acting as the single entry point for all backend requests.

```text
                    User Browser
                         │
                         ▼
              Frontend (React + Nginx)
                         │
          REACT_APP_API_URL=http://<server>:8000
                         │
                         ▼
                  API Gateway (:8000)
      ┌──────────────┬──────────────┬──────────────┬──────────────┐
      │              │              │              │              │
      ▼              ▼              ▼              ▼              ▼
 Auth Service   Product Service Order Service Payment Service Notification
     :5001          :5002            :5003          :5004            :5005
      │              │               │              │               │
      └──────────────┴───────────────┴──────────────┴───────────────┘
                              │
                              ▼
                         MySQL Database

              Admin Dashboard (React + Nginx)
                        │
                        └────────────► API Gateway
```

## Request Flow

1. The user accesses the React Frontend.
2. The Frontend sends API requests to the API Gateway.
3. The API Gateway routes each request to the appropriate microservice.
4. The microservice performs business logic and interacts with MySQL if required.
5. The response travels back through the API Gateway to the Frontend.

---

# Docker Compose Workflow

When executing:

```bash
docker compose up --build
```

Docker Compose performs the following steps:

1. Builds Docker images for all services.
2. Creates a dedicated Docker network (`shopflow-network`).
3. Starts all containers.
4. Connects every container to the same network.
5. Provides automatic DNS-based service discovery.

---

# Service Communication

## Backend → Backend Communication

Containers communicate using **Docker service names**, not IP addresses.

Example:

```text
API Gateway
   │
   ├── http://auth:5001
   ├── http://product:5002
   ├── http://order:5003
   ├── http://payment:5004
   └── http://notification:5005
```

Similarly:

```text
Order Service
        │
        ▼
     mysql:3306
```

Docker automatically resolves service names (`auth`, `product`, `mysql`, etc.) using its internal DNS.

---

# Frontend Communication

The React application runs inside the user's browser, **outside the Docker network**.

Because of this, the browser **cannot resolve Docker service names** like:

* api-gateway
* auth
* product
* mysql

Instead, the browser must communicate using a **public IP address or domain name**.

Example:

```text
REACT_APP_API_URL=http://3.110.188.73:8000
```

or

```text
REACT_APP_API_URL=https://shopflow.example.com
```

---

# Why REACT_APP_API_URL Is Needed

During `npm run build`, React embeds (`bakes`) the API URL directly into the generated JavaScript bundle.

For this reason:

* The frontend must know the public API endpoint **at build time**.
* Changing the API URL later requires rebuilding the React image.
* Runtime environment variable changes do not affect an already-built React application.

---

# Key Takeaways

* React Frontend and Admin Dashboard communicate only with the API Gateway.
* The API Gateway routes requests to the appropriate microservice.
* Backend services communicate using Docker service names over the internal Docker network.
* The browser cannot access Docker service names; it requires a public IP or domain.
* Docker Compose automatically creates networking and DNS between containers.
* `REACT_APP_API_URL` is a build-time variable that determines where the frontend sends API requests.
