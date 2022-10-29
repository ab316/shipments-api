dev:
		yarn

deploy: push seed

push:
	docker-compose exec server yarn prisma:push

seed:
	docker-compose exec server yarn prisma:seed
