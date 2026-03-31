# 🏥 Dawa Inventory — दवा इन्वेंटरी

Full-stack medicine inventory management system.

## Stack
- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Frontend**: React + Vite
- **Database**: MongoDB on Railway
- **Hosting**: Railway (backend + frontend as separate services)

## Project Structure
```
dawa-inventory/
├── backend/          # Express API
└── frontend/         # React + Vite
```

## Local Development

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/dawa-inventory.git
cd dawa-inventory
```

### 2. Backend setup
```bash
cd backend
cp .env.example .env       # fill in your values
npm install
npm run seed               # seed sample data
npm run dev
# API runs on http://localhost:5000
```

### 3. Frontend setup
```bash
cd frontend
cp .env.example .env       # set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
# App runs on http://localhost:5173
```

## Default Login (after seed)
| Role  | Email                  | Password   |
|-------|------------------------|------------|
| Admin | admin@dawa.com         | Admin@123  |
| Staff | staff@dawa.com         | Staff@123  |

## Railway Deployment
See [DEPLOY.md](./DEPLOY.md) for full step-by-step instructions.
