# this script gives the referenced identity the admin role
# make sure to provide the id of the identity

# check if a identity id argument was provided
if [ -z "$1" ]; then
  echo "Error: please provide an identity id."
  exit 1
fi

# set user id variable
IDENTITY_ID=$1

# execute Ory Keto CLI command to make user an admin
docker compose exec ory-keto \
    ory create relation-tuples \
    \{'namespace':'roles','object':'admin','relation':'member','subject_id':IDENTITY_ID}

# respond with success message
echo "Identity $IDENTITY_ID was given the admin role."