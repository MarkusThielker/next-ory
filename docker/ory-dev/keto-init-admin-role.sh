# this script adds all permissions required for full control over the dashboard to
# all everybody, who is a member of the admin role

# Define an array with tuples as strings
permissions=(
  "admin.stack.dashboard#access"
  "admin.stack.status#access"
  "admin.user#access"
  "admin.user#create"
  "admin.user#edit"
  "admin.user#delete"
  "admin.user.session#access"
  "admin.user.session#delete"
  "admin.user.state#edit"
  "admin.user.code#create"
  "admin.user.link#create"
  "admin.user.trait#access"
  "admin.user.trait#edit"
  "admin.user.address#access"
  "admin.user.credential#access"
  "admin.user.credential#delete"
)

# Iterate over the array
for permission in "${permissions[@]}"; do

    # split strings
    IFS='#' read -r OBJECT RELATION <<< "$permission"

    # execute curl to Ory Keto write endpoint
    curl --silent --request PUT \
      --url http://localhost:4467/admin/relation-tuples \
      --data '{
               "namespace": "permissions",
               "object": "'"$OBJECT"'",
               "relation": "'"$RELATION"'",
               "subject_set": {
                  "namespace": "roles",
                  "object": "admin",
                  "relation": "member"
               }
             }' > /dev/null

    # write success response to terminal
    echo "Added relation Permissions:$OBJECT#$RELATION@(Roles:admin#member)"

done
