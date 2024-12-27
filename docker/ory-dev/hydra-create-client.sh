# this script adds a new oath client using the
# Ory Hydra CLI and writes the client id and
# client secret to the command line.

# Check if the number of arguments is correct
if [ $# -ne 2 ]; then
  echo "Usage: $0 <name> <owner>"
  exit 1
fi

name=$1
owner=$2

# it is likely you will have to set different redirect-uris
# depending on the application you are trying to connect.
code_client=$(docker compose exec ory-hydra \
    hydra create client \
    --name "$name" \
    --owner "$owner" \
    --endpoint http://localhost:4445 \
    --grant-type authorization_code,refresh_token \
    --response-type code,id_token \
    --format json \
    --scope openid --scope offline \
    --redirect-uri http://localhost:8080/login/oauth2/code/hydra)

code_client_id=$(echo $code_client | jq -r '.client_id')
code_client_secret=$(echo $code_client | jq -r '.client_secret')

echo "Client ID:" $code_client_id
echo "Client Secret:" $code_client_secret
