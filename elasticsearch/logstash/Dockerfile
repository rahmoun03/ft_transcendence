FROM docker.elastic.co/logstash/logstash:7.17.10

# Copy the logstash.conf to the pipeline directory inside the container
COPY pipeline/logstash.conf /usr/share/logstash/pipeline/logstash.conf

# Optionally, ensure the right permissions are set for the config file
# RUN chown logstash:logstash /usr/share/logstash/pipeline/logstash.conf

EXPOSE 5044


