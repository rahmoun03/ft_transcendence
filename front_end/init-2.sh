#!/bin/sh

# Wait for Elasticsearch to be available (check if port 9200 is open)
echo "Waiting for Elasticsearch to become available..."
until curl --silent --head --fail http://elasticsearch:9200; do
    echo "Elasticsearch not available yet. Retrying in 5 seconds..."
    sleep 5
done

# Elasticsearch is up, so create the 'nginx-logs' index
echo "Elasticsearch is available, creating the 'nginx-logs' index..."
curl -X PUT "http://elasticsearch:9200/nginx-logs-1"

# Once Elasticsearch is set up, pass control back to the main process (nginx)
echo "Elasticsearch index created, starting Nginx..."
exec "$@"
