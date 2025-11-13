# Vehicle Platform

A microservices-based vehicle management platform built with NestJS, PostgreSQL, and RabbitMQ.

## Project Structure

```
vehicle-platform/
├── user-service/       # User management service
├── vehicle-service/    # Vehicle management service
└── frontend/           # Frontend application
```

## Services

### User Service
- **Port**: 5000
- **Database Port**: 5436
- **Database User**: postgres
- **Database Name**: usersdb
- **RabbitMQ URL**: amqp://localhost:5673

### Vehicle Service
- **Port**: 4001
- **Database Port**: 5436
- **Database User**: postgres
- **Database Name**: vehiclesdb
- **RabbitMQ URL**: amqp://localhost:5674

## Prerequisites

- Node.js (v18 or higher)
- Yarn
- PostgreSQL
- RabbitMQ
- Docker (optional, for containerized databases)

## Getting Started

### 1. User Service Setup

```bash
cd user-service
yarn install
```

Create a `.env` file in the `user-service` directory:

```env
PORT=5000
DB_PORT=5436
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=usersdb
DB_HOST=localhost
RABBITMQ_URL=amqp://localhost:5673
```

Start the service:

```bash
yarn start:dev
```

The service will be available at `http://localhost:5000`

### 2. Vehicle Service Setup

```bash
cd vehicle-service
yarn install
```

Create a `.env` file in the `vehicle-service` directory:

```env
PORT=4001
DB_PORT=5436
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=vehiclesdb
DB_HOST=localhost
RABBITMQ_URL=amqp://localhost:5674
```

Start the service:

```bash
yarn start:dev
```

The service will be available at `http://localhost:4001`

### 3. Database Setup (Shared Postgres via Docker)

Local development uses a single PostgreSQL container defined in the root `docker-compose.yml`. It bootstraps both service databases via `db/init.sql`.

```bash
# From the project root
docker compose up -d postgres
```

- Container name: `postgres_local2`
- Host port: `5436` (mapped to container `5432`)
- Credentials: `postgres` / `password`
- Databases created on first boot: `usersdb`, `vehiclesdb`

Check connectivity:

```bash
PGPASSWORD=password psql -h localhost -p 5436 -U postgres -l
```

> Tip: stop any older per-service Postgres containers (e.g., `postgres_vehicle`) to avoid port conflicts.

### 4. RabbitMQ Setup

Ensure RabbitMQ is running on the specified ports:
- User Service: `amqp://localhost:5673`
- Vehicle Service: `amqp://localhost:5674`

You can run RabbitMQ using Docker:

```bash
# For User Service RabbitMQ (port 5673)
docker run -d --name rabbitmq-user -p 5673:5672 -p 15673:15672 rabbitmq:3-management

# For Vehicle Service RabbitMQ (port 5674)
docker run -d --name rabbitmq-vehicle -p 5674:5672 -p 15674:15672 rabbitmq:3-management
```

## Environment Variables

### User Service
- `PORT` - Service port (default: 5000)
- `DB_PORT` - PostgreSQL port (default: 5436)
- `DB_USER` - PostgreSQL username (default: postgres)
- `DB_PASSWORD` - PostgreSQL password (default: password)
- `DB_NAME` - Database name (default: usersdb)
- `DB_HOST` - Database host (default: localhost)
- `RABBITMQ_URL` - RabbitMQ connection URL (default: amqp://localhost:5673)

### Vehicle Service
- `PORT` - Service port (default: 4001)
- `DB_PORT` - PostgreSQL port (default: 5436)
- `DB_USER` - PostgreSQL username (default: postgres)
- `DB_PASSWORD` - PostgreSQL password (default: password)
- `DB_NAME` - Database name (default: vehiclesdb)
- `DB_HOST` - Database host (default: localhost)
- `RABBITMQ_URL` - RabbitMQ connection URL (default: amqp://localhost:5674)

## Technology Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Message Queue**: RabbitMQ
- **Package Manager**: Yarn

## Development

### Running Services in Development Mode

```bash
# User Service
cd user-service
yarn start:dev

# Vehicle Service
cd vehicle-service
yarn start:dev
```

### Building Services

```bash
# User Service
cd user-service
yarn build

# Vehicle Service
cd vehicle-service
yarn build
```

## API Endpoints

### User Service (Port 5000)
- Base URL: `http://localhost:5000`

### Vehicle Service (Port 4001)
- Base URL: `http://localhost:4001`

## License

MIT

## AWS Deployment (PostgreSQL)

For AWS deployment later:
- Use AWS RDS Postgres.
- Point both services to the same RDS endpoint.
- Use separate databases (`vehiclesdb` and `usersdb`) on the same RDS instance.
- Keep the same environment variable structure; only `DB_HOST` changes to your RDS endpoint.

