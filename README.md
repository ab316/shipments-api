# Introduction
See [study](./STUDY.md)

# Usage
## Local Docker Setup
### Requirements
1. Docker
1. Docker Compose
1. Make
1. npm
1. yarn
1. NodeJs >= 16

### Procedure
1. `make`
1. `docker-compose up -d`
1. `make deploy`
1. Access the API at `http://localhost:3000`. You can use the postman collection in the repository

# Future Work
## Code base
1. Add request body validation for the API endpoints
1. Proper error-handling in the Service layer
1. Do something about price multiplier for Domestic region
1. Swagger documentation for API? Unless we decide to move to GraphQL

## Product
1. Multi-currency support
1. Support full country name in native/swedish