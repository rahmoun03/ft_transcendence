#!/usr/bin/bash
docker stop $(docker ps -q)
docker rm $(docker ps -aq)
docker rmi $(docker images)
docker system prune -a
