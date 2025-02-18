FROM grafana/grafana:latest

# Working directory For Grafana
WORKDIR /usr/share/grafana

# Copy custom configuration (optional)
# COPY grafana.ini /etc/grafana/grafana.ini

# Expose default Grafana port
EXPOSE 3000

# Default entrypoint provided by Grafana
CMD ["grafana-server", "--homepath=/usr/share/grafana"]

# Start Grafana
# ENTRYPOINT [ "/run.sh" ]


