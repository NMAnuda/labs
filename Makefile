.PHONY: setup test run stop build lint

setup:
	@echo "Running setup script..."
	@pwsh ./scripts/setup.ps1 -ProjectName "MADLABS-Project" -ProjectType "SaaS"

test:
	@echo "Running tests..."
	# Replace with actual test command (e.g., npm test, dotnet test, pytest)
	@echo "Please define test command in Makefile"

run:
	@echo "Starting local environment..."
	docker compose up -d

stop:
	@echo "Stopping local environment..."
	docker compose down

build:
	@echo "Building application..."
	# Replace with actual build command
	@echo "Please define build command in Makefile"

lint:
	@echo "Running linters..."
	npm run lint || echo "Define lint command"
