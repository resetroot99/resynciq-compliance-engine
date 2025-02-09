#!/bin/bash
echo "Starting deployment..."
npm run build
docker-compose up -d
echo "Deployment complete!" 