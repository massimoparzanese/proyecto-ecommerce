#!/bin/bash

set -e

echo "🛍️ Starting E-Commerce App..."
echo ""

# Directory of this script (project root)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Backend setup
echo -e "${BLUE}📦 Setting up backend...${NC}"
cd backend

if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}Installing backend dependencies...${NC}"
  pnpm install
fi

echo -e "${YELLOW}Starting database with Docker...${NC}"
docker compose up -d

echo -e "${YELLOW}Waiting for database to be ready...${NC}"
sleep 5

# Check if MongoDB is ready
echo -e "${YELLOW}Checking database connection...${NC}"
for i in {1..30}; do
  if docker exec ecommerce-mongo mongosh --eval "db.adminCommand('ismaster')" --quiet > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Database is ready${NC}"
    break
  fi
  if [ $i -eq 30 ]; then
    echo -e "${RED}❌ Database failed to start${NC}"
    exit 1
  fi
  sleep 1
done

echo -e "${YELLOW}Seeding database...${NC}"
pnpm run seed

echo -e "${GREEN}✓ Backend setup complete${NC}"
echo ""

# Frontend setup
echo -e "${BLUE}📦 Setting up frontend...${NC}"
cd ../frontend

if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}Installing frontend dependencies...${NC}"
  pnpm install
fi

echo -e "${GREEN}✓ Frontend setup complete${NC}"
echo ""

# Start services
echo -e "${BLUE}🟢 Starting services...${NC}"
echo ""

cd ../backend
echo -e "${YELLOW}Starting backend on http://localhost:3000${NC}"
pnpm run dev &
BACKEND_PID=$!

cd ../frontend
echo -e "${YELLOW}Starting frontend on http://localhost:5173${NC}"
pnpm run dev &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}✅ E-Commerce App is running!${NC}"
echo ""
echo "Backend:  http://localhost:3000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"

# Trap to clean up processes on exit
trap 'echo ""; echo "Stopping services..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true; echo "Stopping docker containers..."; (cd "${SCRIPT_DIR}/backend" && docker compose down -v) || true; exit' INT TERM

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID