all: build

protobuf:
	protoc --go_out=. --go_opt=paths=source_relative \
	--go-grpc_out=. --go-grpc_opt=paths=source_relative \
	divi/proto/core/v1/health_check_response.proto

	mv divi/proto/core/v1/*.go divi/proto/core/v1/go/
	cp divi/proto/core/v1/go/* core/proto/

	python3 -m grpc_tools.protoc -Idivi/proto=divi/proto \
	--python_out=. \
	--pyi_out=. \
	--grpc_python_out=. \
	divi/proto/core/v1/health_check_response.proto

build:
	cd core && go build -o ../divi/bin/core main.go
