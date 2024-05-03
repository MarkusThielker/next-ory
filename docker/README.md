# Starting as a container

Starting this project in a container makes testing it really easy. \

```bash
# move to the environment you want to start (here development)
cd ory-dev

# use the example environment for development
cp .env.example .env

# execute the docker compose file
docker compose up -d

# test the consent flow
sh ./hydra-test-consent.sh
```

These commands will start up multiple containers in the background.
Then continue with starting the authentication UI development server as described in the authentication README.

## Services and Ports

As mentioned above, the docker command starts multiple container which interact with each other.
Here you see a list of all services and their exposed ports.
These ports are only exposed to the host machine.
If you start up the environment on a remote server, you will need to tunnel the ports.

| Service        | Port (Public) | Description                                                               |
|----------------|---------------|---------------------------------------------------------------------------|
| Console        | 4411 (✗)      | Admin dashboard for Kratos data management (soon)                         |
| Authentication | 3000 (✗)      | User interface for authentication and account management (no docker yet)  |
| ORY Kratos     | 4433 (✗)      | User management system handling users and self-service flows (Public API) |
| ORY Kratos     | 4434 (✗)      | User management system handling users and self-service flows (Admin API)  |
| Mailslurper    | 4436 (✗)      | Mock mailing server (Dashboard)                                           |
| Mailslurper    | 4437 (✗)      | Mock mailing server (API)                                                 |
| ORY Hydra      | 4444 (✗)      | OAuth2 and OIDC server connected to Kratos (Public API)                   |
| ORY Hydra      | 4445 (✗)      | OAuth2 and OIDC server connected to Kratos (Admin API)                    |
| ORY Hydra      | 5555 (✗)      | Hydra test application to test the consent flow                           |
| Postgres DB    | 4455 (✗)      | Postgres database for storing user data                                   |
