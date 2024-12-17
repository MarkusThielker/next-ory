# this script gives the referenced identity the admin role
# make sure to provide the id of the identity

# check if a identity id argument was provided
if [ -z "$1" ]; then
  echo "Error: please provide an identity id."
  exit 1
fi

# set user id variable
IDENTITY_ID=$1

# execute curl to Ory Keto write endpoint
curl --request PUT \
  --url http://localhost:4467/admin/relation-tuples \
  --data '{
           "namespace": "roles",
           "object": "admin",
           "relation": "member",
           "subject_id": "'"$IDENTITY_ID"'"
         }'

# write success response to terminal
echo "Applied admin role to the user with ID $IDENTITY_ID"
