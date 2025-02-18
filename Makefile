.PHONY: up down clean rebuild

up:
	docker-compose up

down:
	docker-compose down

clean:
	docker-compose down -v
	docker system prune -f

rebuild: clean
	docker-compose up --build
	

push:
	@git add . && \
	if [ $$? -eq 0 ]; then \
		git commit -m "auto commit $$(date)" && \
		if [ $$? -eq 0 ]; then \
			git push && \
			if [ $$? -eq 0 ]; then \
				echo "\033[0;32mcommit and push success\033[0m"; \
			else \
				echo "\033[0;31mpush failed\033[0m"; \
			fi \
		else \
			echo "\033[0;31mcommit failed\033[0m"; \
		fi \
	else \
		echo "\033[0;31madd failed\033[0m"; \
	fi

flush:
	python3 backend/manage.py flush