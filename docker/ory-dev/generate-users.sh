#!/bin/bash

# Check if the number of arguments is correct
if [ $# -ne 2 ]; then
  echo "Usage: $0 <schema_id> <count>"
  exit 1
fi

# Get the schema ID and count from the arguments
schema_id=$1
count=$2

# Loop through the count
for i in $(seq 1 $count); do

  # Create the JSON data with the email and name
  data=$(cat <<EOF
{
  "schema_id": "$schema_id",
  "state": "active",
  "traits": {
    "email": "user-$i@example.com",
    "name": "User $i"
  }
}
EOF
)

  # Execute the curl command
  curl --request POST \
    --url http://127.0.0.1:4434/admin/identities \
    --data "$data"

done

exit 0
