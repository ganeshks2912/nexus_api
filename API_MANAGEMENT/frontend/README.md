# Nexus APIs Frontend

Simple, professional React frontend connected to the existing Nexus APIs Express backend.

## Stack
- React + Vite
- React Router
- Axios
- Plain CSS (no UI framework)

## Run

From `API_MANAGEMENT/frontend`:

```bash
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and Vite proxies `/auth`, `/tenants`, `/apis`, `/api-keys`, `/analytics`, `/gateway`, and `/health` to `http://localhost:5000`.

Start the backend separately on port 5000.

## Connected backend endpoints

### Auth
- POST `/auth/register`
- POST `/auth/login`
- POST `/auth/refresh`
- POST `/auth/logout`
- GET `/auth/me`

### Tenants / members
- POST `/tenants`
- GET `/tenants/my-tenants`
- POST `/tenants/:tenantId/members`
- GET `/tenants/:tenantId/members`
- PATCH `/tenants/:tenantId/members/:userId`
- DELETE `/tenants/:tenantId/members/:userId`

### APIs
- POST `/apis`
- GET `/apis/:tenantId`
- GET `/apis/details/:apiId`
- PATCH `/apis/:apiId`
- DELETE `/apis/:apiId`

### API keys
- POST `/api-keys`
- GET `/api-keys/:apiId`
- PATCH `/api-keys/:keyId/revoke`

### Analytics
- GET `/analytics/:apiId`

### Gateway
- ALL `/gateway/:apiId/:endpoint` using `x-api-key`

The frontend uses JWT Bearer authentication for management endpoints and `x-api-key` for gateway requests.
