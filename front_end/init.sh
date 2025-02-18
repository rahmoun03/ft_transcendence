#!/bin/bash

# Set a maximum wait time (e.g., 60 seconds)
MAX_WAIT=60
COUNTER=0

# Wait for Elasticsearch to be available (check if it's responding with a 200 status code)
echo "Waiting for Elasticsearch to start..."
while ! curl -s -o /dev/null -w "%{http_code}" http://elasticsearch:9200 | grep -q "200"; do
    sleep 5
    COUNTER=$((COUNTER+5))
    if [ "$COUNTER" -ge "$MAX_WAIT" ]; then
        echo "Elasticsearch is taking too long to start. Exiting..."
        exit 1
    fi
    echo "Still waiting for Elasticsearch to start..."
done

# Create the index if it doesn't exist
echo "Elasticsearch is up. Creating index..."
curl -X PUT "http://elasticsearch:9200/nginx-logs-1" || echo "Index already exists"

# Start nginx (or any other service you want to start after the index creation)
echo "Starting nginx..."
nginx -g "daemon off;"
