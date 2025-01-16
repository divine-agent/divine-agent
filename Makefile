all: protobuf

protobuf:
	protoc --go_out=$(shell pwd)/core --go_opt=paths=source_relative \
	--go-grpc_out=$(shell pwd)/core --go-grpc_opt=paths=source_relative \
	proto/health/v1/health.proto

	python3 -m grpc_tools.protoc -Iproto=proto \
	--python_out=$(shell pwd)/sdk/divi \
	--pyi_out=$(shell pwd)/sdk/divi \
	--grpc_python_out=$(shell pwd)/sdk/divi \
	proto/health/v1/health.proto
