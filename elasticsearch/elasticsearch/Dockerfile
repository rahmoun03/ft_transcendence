# Dockerfile for Elasticsearch (ELK)
FROM docker.elastic.co/elasticsearch/elasticsearch:7.17.10

# Set environment variables
ENV discovery.type=single-node
ENV network.host=0.0.0.0
ENV ES_JAVA_OPTS="-Xms2g -Xmx2g"

#ENV ELASTIC_USERNAME=elastic
#ENV ELASTIC_PASSWORD=elastic123456
# curl -u elastic:changeme http://localhost:9200

# Expose necessary ports
EXPOSE 9200 9300

# Add optional configurations (if needed)
COPY elasticsearch.yml /usr/share/elasticsearch/config/elasticsearch.yml

# Define a volume for Elasticsearch data (important for persistence)
# VOLUME /usr/share/elasticsearch/data
