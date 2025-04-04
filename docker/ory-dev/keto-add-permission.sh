# this script gives the referenced identity the provided permission
# make sure to provide the id of the identity

# check if a required arguments were provided
if [ $# -ne 3 ]; then
  echo "Usage: $0 <object> <relation> <identity_id>"
  exit 1
fi

# set variables from input
OBJECT=$1
RELATION=$2
IDENTITY_ID=$3

# execute curl to Ory Keto write endpoint
curl --request PUT \
  --url http://localhost:4467/admin/relation-tuples \
  --data '{
           "namespace": "permissions",
           "object": "'"$OBJECT"'",
           "relation": "'"$RELATION"'",
           "subject_id": "'"$IDENTITY_ID"'"
         }'

# write success response to terminal
echo "Added permission $OBJECT#$RELATION@$IDENTITY_ID"
