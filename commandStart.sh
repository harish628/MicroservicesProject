# Terminal 1 — Auth (Go)
cd auth-service && go mod tidy && go run main.go

# Terminal 2 — Product (Python FastAPI)
cd product-service && pip install -r requirements.txt --break-system-packages && python main.py

# Terminal 3 — Order (Node.js)
cd order-service && npm install && npm start

# Terminal 4 — Payment (Python Flask)
cd payment-service && pip install -r requirements.txt --break-system-packages && python app.py

# Terminal 5 — Notification (Node.js)
cd notification-service && npm install && npm start

# Terminal 6 — API Gateway (start LAST among backend — it depends on all 5)
cd api-gateway && npm install && npm start

# Terminal 7 — React storefront
cd frontend && npm install && npm start

# Terminal 8 — Angular admin
cd admin-dashboard && npm install && npm start