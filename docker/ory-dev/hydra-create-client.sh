# this script adds a new oath client using the
# Ory Hydra CLI and writes the client id and
# client secret to the command line.

read -r -p "Did you modify the script according to your needs? (y/N)? " answer
if [ answer != "y" && anser != "Y" ]; then
    exit 0
fi

# it is likely you will have to set different redirect-uris
# depending on the application you are trying to connect.
code_client=$(docker compose exec ory-hydra \
    hydra create client \
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
