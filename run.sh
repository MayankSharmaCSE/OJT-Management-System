#!/bin/bash

# Configuration
BACKEND_DIR="./backend"
FRONTEND_DIR="./frontend"

# Colors for log clarity
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting OJT Management System...${NC}"

# Pre-startup cleanup (Kill existing instances)
pkill -f uvicorn > /dev/null 2>&1

# Function to handle cleanup on stop
cleanup() {
    echo -e "${BLUE}\nStopping all services...${NC}"
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

trap cleanup SIGINT

# Get Local IP Address
LOCAL_IP=$(ipconfig getifaddr en0 || ipconfig getifaddr en1 || echo "localhost")

# 0. Sync Configuration (Auto-update IPs)
echo -e "${GREEN}Syncing Network Configuration (IP: ${LOCAL_IP})...${NC}"
# Update Backend CORS
sed -i '' "s|CORS_ORIGINS=.*|CORS_ORIGINS=\"http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001,http://${LOCAL_IP}:3000,http://${LOCAL_IP}:3001\"|g" "$BACKEND_DIR/.env"
# Update Frontend API URL
sed -i '' "s|VITE_API_URL=.*|VITE_API_URL=http://${LOCAL_IP}:8000/api/v1|g" "$FRONTEND_DIR/.env"

# 1. Initialize Database (Optional, but recommended for first run)
echo -e "${GREEN}Initializing Database...${NC}"
cd $BACKEND_DIR
export PYTHONPATH=$PYTHONPATH:.
python3 init_db.py
cd ..

# 2. Start Backend
echo -e "${GREEN}Starting Backend Server (Uvicorn) on 0.0.0.0:8000...${NC}"
cd $BACKEND_DIR
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# 3. Start Frontend
echo -e "${GREEN}Starting Frontend Server (Vite) on 0.0.0.0:3000...${NC}"
cd $FRONTEND_DIR
# We use --host to make it accessible on the network
npm run dev -- --host 0.0.0.0 --port 3000 &
FRONTEND_PID=$!
cd ..

echo -e "${BLUE}All services are running!${NC}"
echo -e "Local:     ${GREEN}http://localhost:3000${NC}"
echo -e "Network:   ${GREEN}http://${LOCAL_IP}:3000${NC}"
echo -e "Backend:   ${GREEN}http://${LOCAL_IP}:8000${NC}"
echo -e "Press Ctrl+C to stop both services."

# Wait for background processes
wait
