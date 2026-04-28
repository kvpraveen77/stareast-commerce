# StarEast Commerce REST API

## Description
Simple REST API for an e-commerce checkout flow using JavaScript and Express.  
It uses JWT authentication and in-memory data only (no database).

## Installation
```bash
npm install
```

## How to Run
```bash
npm start
```

Server default URL: `http://localhost:3000`  
Swagger docs URL: `http://localhost:3000/docs`

## Rules
- API endpoints:
  - `POST /register`
  - `POST /login`
  - `POST /checkout`
  - `GET /healthcheck`
- Checkout payment accepts only:
  - `cash`
  - `credit_card`
- `cash` payment gives 10% discount.
- Only authenticated users can perform checkout (JWT bearer token required).
- Everything runs in memory.

## Data Already Existent
### Users
Preloaded users (all passwords are `password123`):
- `alice@example.com`
- `bob@example.com`
- `carol@example.com`

### Products
- `id: 1` - Laptop - `1200`
- `id: 2` - Headphones - `150`
- `id: 3` - Mouse - `50`

## How to Use the REST API
### 1) Healthcheck
`GET /healthcheck`

### 2) Register
`POST /register`
```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "123456"
}
```

### 3) Login (get JWT)
`POST /login`
```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```

### 4) Checkout (authenticated)
`POST /checkout` with header:
`Authorization: Bearer <token>`

Request body example:
```json
{
  "paymentMethod": "cash",
  "items": [
    { "productId": 1, "quantity": 1 },
    { "productId": 2, "quantity": 2 }
  ]
}
```

The response includes subtotal, discount (10% for cash), and final total.
