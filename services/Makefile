default: all

token:
	openssl genrsa -out assets/private.key 4096
	openssl rsa -in assets/private.key -pubout -out assets/public.key

postgres:
	docker run --name divi_postgres -p 5432:5432 -e POSTGRES_PASSWORD=postgres@divi -e POSTGRES_USER=divi -d postgres
