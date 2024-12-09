
local claims = std.extVar('claims');

{
    identity: {
        traits: {
            [if 'email' in claims && claims.email_verified then 'email' else null]: claims.email,
            [if 'nickname' in claims then 'username' else null]: claims.nickname,
            [if 'nickname' in claims then 'name' else null]: claims.nickname,
        },
        metadata_public: claims,
    },
}
