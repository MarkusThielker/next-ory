# this script creates a reference from the role to the permission you provide

# check if a identity id argument was provided
if [ $# -ne 4 ]; then
  echo "Usage: $0 <object> <relation> <role> <role_relation>"
  exit 1
fi

# set user id variable
OBJECT=$1
RELATION=$2
ROLE=$3
ROLE_RELATION=$4

# execute curl to Ory Keto write endpoint
curl --request PUT \
  --url http://localhost:4467/admin/relation-tuples \
  --data '{
           "namespace": "permissions",
           "object": "'"$OBJECT"'",
           "relation": "'"$RELATION"'",
           "subject_set": {
              "namespace": "roles",
              "object": "'"$ROLE"'",
              "relation": "'"$ROLE_RELATION"'"
           }
         }'

# write success response to terminal
echo "Added relation Permissions:$OBJECT#$RELATION@(Roles:$ROLE#$RELATION)"
