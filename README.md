# RE:ACT — Resource Rescue Network (React Frontend)

A responsive React + Vite starter frontend for the RE:ACT MERN college project.

## Included
- Responsive command-center dashboard
- Overview metrics and resource demand chart
- Resource requests table with status filters
- Inventory cards and stock progress
- Rescue Engine demo: ranks donors and creates a simulated allocation
- Activity feed and notifications
- Mock data, so the UI runs before the backend is connected

## Requirements
- Node.js LTS
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL shown in the terminal, usually `http://localhost:5173`.

## Build check
```bash
npm run build
```

## Connect your Express backend later
Create `client/.env` from `.env.example` and set `VITE_API_URL` to your API base URL.
Then replace the mock data in `src/data/mockData.js` with calls from your API service.

## Important
This is a frontend starter with simulated demo interactions. Login, database persistence, real map coordinates, real-time Socket.IO events, and secure inventory allocation require the backend to be implemented and connected. Do not treat mock allocations as real inventory reservations.
