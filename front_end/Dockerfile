FROM nginx:alpine

# Copy the project files
COPY . /usr/share/nginx/html/

# Copy our custom nginx config
COPY default.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
#Typically, the main Nginx configuration file is /etc/nginx/nginx.conf
#In your conf.d/default.conf file, remove the http block and only keep the server block
# /etc/nginx/conf.d/default.conf

# Ensure log directory exists and reset log files (for logstash issue)
RUN mkdir -p /var/log/nginx && \
    rm -rf /var/log/nginx/access.log /var/log/nginx/error.log && \
    touch /var/log/nginx/access.log /var/log/nginx/error.log && \
    chmod 777 /var/log/nginx/access.log /var/log/nginx/error.log

EXPOSE 8080

COPY init-2.sh /docker-entrypoint.d/

CMD ["nginx", "-g", "daemon off;"]