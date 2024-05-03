
local claims = std.extVar('claims');

{
    identity: {
        traits: {
            [if 'email' in claims && claims.email_verified then 'email' else null]: claims.email
        },
        metadata_public: claims,
    },
}