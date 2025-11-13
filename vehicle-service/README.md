# Vehicle Service

NestJS microservice that stores vehicle records and reacts to RabbitMQ events raised by the user service to provision default vehicles.

## Getting Started

1. Install dependencies with `yarn install`.
2. Configure environment variables as described below.
3. Run `yarn start:dev` for development or `yarn build && yarn start` for a compiled run.

### Required Environment Variables

| Variable | Description | Example |
| --- | --- | --- |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USER` | Database username | `postgres` |
| `DB_PASS` | Database password | `postgres` |
| `DB_NAME` | Database name | `vehicles` |
| `RABBITMQ_URL` | RabbitMQ connection string | `amqp://guest:guest@localhost:5672` |

## REST API

All routes are prefixed with `/vehicles`.

| Method | Route | Description | Body |
| --- | --- | --- | --- |
| `GET` | `/` | List all vehicle records | _None_ |
| `GET` | `/:id` | Retrieve a single vehicle by numeric ID | _None_ |
| `POST` | `/` | Create a vehicle | Partial vehicle payload |
| `PUT` | `/:id` | Update a vehicle | Partial vehicle payload |
| `DELETE` | `/:id` | Delete a vehicle | _None_ |

## RabbitMQ Listener

- Queue: `user_events`
- Subscribed event: `USER_CREATED`
- Action: Calls `createBlankForUser(userId)` in `VehiclesService` to set up an empty vehicle record for the newly created user.

On failure to handle a message, the service will `nack` the message so RabbitMQ can requeue it.

