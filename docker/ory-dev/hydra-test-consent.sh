# this script adds a new oath client using the
# Ory Hydra CLI and uses the client to start
# the Ory Hydra test application.

code_client=$(docker compose exec ory-hydra \
    hydra create client \
    --endpoint http://localhost:4445 \
    --grant-type authorization_code,refresh_token \
    --response-type code,id_token \
    --format json \
    --scope openid --scope offline \
    --redirect-uri http://127.0.0.1:5555/callback)

code_client_id=$(echo $code_client | jq -r '.client_id')
code_client_secret=$(echo $code_client | jq -r '.client_secret')

docker compose exec ory-hydra \
    hydra perform authorization-code \
    --client-id $code_client_id \
    --client-secret $code_client_secret \
    --endpoint http://localhost:4444/ \
    --port 5555 \
    --scope openid --scope offline
