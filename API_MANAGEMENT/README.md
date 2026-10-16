Nexus APIs – Multi-Tenant API Gateway & Management Platform

Nexus APIs is a multi-tenant API management platform built to simplify API access, security, traffic control, and performance monitoring. It provides a centralized API gateway and a React-based dashboard for managing APIs, API keys, organizations, and request analytics.

Key Features

- Multi-Tenant Architecture: Manage APIs across organizations with tenant-scoped access.
- JWT Authentication: Secure user authentication with access tokens and refresh tokens.
- Role-Based Access Control (RBAC): Support organization roles such as Owner, Admin, Developer, and Viewer.
- API Key Management: Create, manage, and revoke API keys for protected gateway access.
- API Gateway: Forward client requests to configured backend APIs.
- Rate Limiting: Control API traffic using Redis-backed request limits.
- Analytics & Monitoring: Track request counts, success and failure rates, and response-time metrics.
- Organization Management: Manage tenants and their members.
- React Dashboard: Manage APIs, keys, organizations, and analytics through a simple, responsive interface.
- Gateway Tester: Send test requests through the gateway using an API key.

Tech Stack

Layer| Technologies
Frontend| React.js, Vite, React Router, Axios, CSS
Backend| Node.js, Express.js
Database| PostgreSQL
Caching and Rate Limiting| Redis
Authentication| JWT, Refresh Tokens
API Communication| REST APIs, Axios
Development Tools| Git, GitHub, VS Code, Docker

Architecture

                    React Dashboard
                    (Vite + React)
                          |
                       Axios
                          |
                    Express Backend
                          |
              +-----------+-----------+
              |           |           |
          PostgreSQL     Redis     API Gateway
              |           |           |
         Users, APIs,   Rate Limit   Target APIs
         Tenants, Keys  Counters
              |
         API Metrics
              |
       Analytics Endpoint

Project Structure

API_MANAGEMENT/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── package.json
│   └── vite.config.js
├── mock-service/
├── package.json
├── docker-compose.yml
└── README.md

Prerequisites

Install the following before running the project:

- Node.js and npm
- PostgreSQL
- Docker Desktop
- Git

Redis must be running and accessible to the backend. Configure the PostgreSQL database and application secrets in your local environment.

Getting Started

1. Clone the Repository

git clone <GITHUB_REPOSITORY_URL>
cd API_MANAGEMENT

2. Configure Environment Variables

Create a ".env" file in the backend root directory using your project's existing environment-variable names.

Configure the following values as applicable:

PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secure_jwt_secret
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

Use the actual variable names expected by your backend configuration. Do not commit ".env" files, database passwords, JWT secrets, or API-key secrets.

3. Start Redis

Start Docker Desktop, then run the Redis service using the existing Compose configuration:

docker compose up -d

If your Compose file contains other services, check which services it starts before running this command.

Verify running containers:

docker ps

4. Start the Backend

From the project root:

npm install
node src/server.js

The backend should be available at:

http://localhost:5000

5. Start the React Frontend

Open a second terminal:

cd frontend
npm install
npm run dev

Open the frontend at:

http://localhost:5173

The Vite development proxy forwards supported API requests to the backend running on port 5000.

API Capabilities

The frontend integrates with the backend's existing routes for the following capabilities:

Module| Purpose
Authentication| Register, login, refresh tokens, logout, and retrieve the current user
Tenants| Create organizations and retrieve accessible tenants
Members| View and manage organization membership and roles
APIs| Create, list, inspect, update, and delete APIs
API Keys| Create keys, list keys, and revoke keys
Analytics| Retrieve request and response-time metrics for an API
Gateway| Forward requests to configured APIs using an API key

Exact route availability and permissions depend on the backend implementation.

Analytics and Monitoring

The analytics module uses stored API request metrics to calculate:

- Total requests
- Successful requests
- Failed requests
- Error rate
- Average response time
- Minimum response time
- Maximum response time

Metrics are stored in PostgreSQL and retrieved through the analytics endpoint. Tenant membership checks restrict analytics access to authorized users.

Security

- JWT-protected management endpoints
- Tenant-scoped data access
- Role-based authorization
- API-key-based gateway authentication
- Redis-backed rate limiting
- Environment-based secret configuration

Important: The frontend is not a security boundary. Authorization, tenant isolation, and role checks must also be enforced by the backend.

Future Enhancements

- Audit logging for administrative actions
- Advanced analytics charts and time-range filtering
- Gateway health monitoring and alerts
- API version management
- Webhook management
- Usage-based billing
- Production deployment and automated testing

Author

Your Name
ganesh k s

Computer Science Engineering

---

Built as a full-stack project to explore multi-tenant SaaS architecture, API gateway design, authentication, rate limiting, and API performance analytics.
