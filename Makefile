local:
	@docker-compose -f ./docker-compose.local.yml stop && docker-compose -f docker-compose.local.yml up --build -d --remove-orphans

prod:
	@docker-compose -f ./docker-compose.prod.yml stop && docker-compose -f ./docker-compose.prod.yml up --build -d --remove-orphans