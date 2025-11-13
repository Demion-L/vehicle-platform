# User Service

NestJS microservice that manages platform users and publishes lifecycle events to RabbitMQ so that downstream services (for example, the vehicle service) can react to account creation.

## Getting Started

1. Install dependencies with `yarn install`.
2. Provide an `.env` file or environment variables with the configuration listed below.
3. Run `yarn start:dev` for local development or `yarn build && yarn start` for production-style runs.

### Required Environment Variables

| Variable | Description | Example |
| --- | --- | --- |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USER` | Database username | `postgres` |
| `DB_PASS` | Database password | `postgres` |
| `DB_NAME` | Database name | `users` |
| `RABBITMQ_URL` | Connection string for RabbitMQ | `amqp://guest:guest@localhost:5672` |

## REST API

All routes are prefixed with `/users`.

| Method | Route | Description | Body |
| --- | --- | --- | --- |
| `POST` | `/` | Create a new user and emit a `USER_CREATED` RabbitMQ event | `{ "name": string, "email": string, "password": string }` |
| `GET` | `/` | List all users | _None_ |
| `GET` | `/:id` | Retrieve a specific user by numeric ID | _None_ |
| `PUT` | `/:id` | Update an existing user | Partial user payload |
| `DELETE` | `/:id` | Remove a user record | _None_ |

## RabbitMQ Integration

- Queue: `user_events`
- Event emitted: `USER_CREATED`
- Payload: `{ type: "USER_CREATED", data: { id: number, email: string } }`

Downstream services listen to this queue to provision related resources when a user is created.

