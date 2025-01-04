import {
    boolean,
    char,
    check,
    foreignKey,
    index,
    integer,
    json,
    jsonb,
    pgTable,
    text,
    timestamp,
    unique,
    uniqueIndex,
    uuid,
    varchar,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const schema_migration = pgTable('schema_migration', {
    version: varchar({ length: 48 }).notNull(),
    version_self: integer('version_self').default(0).notNull(),
}, (table) => [
    uniqueIndex('schema_migration_version_idx').using('btree', table.version.asc().nullsLast().op('text_ops')),
    index('schema_migration_version_self_idx').using('btree', table.version_self.asc().nullsLast().op('int4_ops')),
]);

export const identity_credentials = pgTable('identity_credentials', {
    id: uuid().primaryKey().notNull(),
    config: jsonb().notNull(),
    identity_credential_type_id: uuid('identity_credential_type_id').notNull(),
    identity_id: uuid('identity_id').notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).notNull(),
    nid: uuid(),
    version: integer().default(0).notNull(),
}, (table) => [
    index('identity_credentials_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    index('identity_credentials_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
    index('identity_credentials_nid_identity_id_idx').using('btree', table.identity_id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    foreignKey({
        columns: [table.identity_id],
        foreignColumns: [identities.id],
        name: 'identity_credentials_identity_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
        columns: [table.identity_credential_type_id],
        foreignColumns: [identity_credential_types.id],
        name: 'identity_credentials_identity_credential_type_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
        columns: [table.nid],
        foreignColumns: [networks.id],
        name: 'identity_credentials_nid_fk_idx',
    }).onUpdate('restrict').onDelete('cascade'),
]);

export const identity_credential_types = pgTable('identity_credential_types', {
    id: uuid().primaryKey().notNull(),
    name: varchar({ length: 32 }).notNull(),
}, (table) => [
    uniqueIndex('identity_credential_types_name_idx').using('btree', table.name.asc().nullsLast().op('text_ops')),
]);

export const selfservice_login_flows = pgTable('selfservice_login_flows', {
    id: uuid().primaryKey().notNull(),
    request_url: text('request_url').notNull(),
    issued_at: timestamp('issued_at', { mode: 'string' }).default(sql`current_timestamp`).notNull(),
    expires_at: timestamp('expires_at', { mode: 'string' }).notNull(),
    active_method: varchar('active_method', { length: 32 }).notNull(),
    csrf_token: varchar('csrf_token', { length: 255 }).notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).notNull(),
    forced: boolean().default(false).notNull(),
    type: varchar({ length: 16 }).default('browser').notNull(),
    ui: jsonb(),
    nid: uuid(),
    requested_aal: varchar('requested_aal', { length: 4 }).default('aal1').notNull(),
    internal_context: jsonb('internal_context').notNull(),
    oauth2login_challenge: uuid('oauth2_login_challenge'),
    oauth2login_challenge_data: text('oauth2_login_challenge_data'),
    state: varchar({ length: 255 }),
    submit_count: integer('submit_count').default(0).notNull(),
    organization_id: uuid('organization_id'),
}, (table) => [
    index('selfservice_login_flows_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    index('selfservice_login_flows_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
    foreignKey({
        columns: [table.nid],
        foreignColumns: [networks.id],
        name: 'selfservice_login_flows_nid_fk_idx',
    }).onUpdate('restrict').onDelete('cascade'),
]);

export const networks = pgTable('networks', {
    id: uuid().primaryKey().notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).notNull(),
});

export const selfservice_registration_flows = pgTable('selfservice_registration_flows', {
    id: uuid().primaryKey().notNull(),
    request_url: text('request_url').notNull(),
    issued_at: timestamp('issued_at', { mode: 'string' }).default(sql`current_timestamp`).notNull(),
    expires_at: timestamp('expires_at', { mode: 'string' }).notNull(),
    active_method: varchar('active_method', { length: 32 }).notNull(),
    csrf_token: varchar('csrf_token', { length: 255 }).notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).notNull(),
    type: varchar({ length: 16 }).default('browser').notNull(),
    ui: jsonb(),
    nid: uuid(),
    internal_context: jsonb('internal_context').notNull(),
    oauth2login_challenge: uuid('oauth2_login_challenge'),
    oauth2login_challenge_data: text('oauth2_login_challenge_data'),
    state: varchar({ length: 255 }),
    submit_count: integer('submit_count').default(0).notNull(),
    organization_id: uuid('organization_id'),
}, (table) => [
    index('selfservice_registration_flows_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    index('selfservice_registration_flows_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
    foreignKey({
        columns: [table.nid],
        foreignColumns: [networks.id],
        name: 'selfservice_registration_flows_nid_fk_idx',
    }).onUpdate('restrict').onDelete('cascade'),
]);

export const identities = pgTable('identities', {
    id: uuid().primaryKey().notNull(),
    schema_id: varchar('schema_id', { length: 2048 }).notNull(),
    traits: jsonb().notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).notNull(),
    nid: uuid(),
    state: varchar({ length: 255 }).default('active').notNull(),
    state_changed_at: timestamp('state_changed_at', { mode: 'string' }),
    metadata_public: jsonb('metadata_public'),
    metadata_admin: jsonb('metadata_admin'),
    available_aal: varchar('available_aal', { length: 4 }),
    organization_id: uuid('organization_id'),
}, (table) => [
    index('identities_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    index('identities_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
    foreignKey({
        columns: [table.nid],
        foreignColumns: [networks.id],
        name: 'identities_nid_fk_idx',
    }).onUpdate('restrict').onDelete('cascade'),
]);

export const identity_credential_identifiers = pgTable('identity_credential_identifiers', {
    id: uuid().primaryKey().notNull(),
    identifier: varchar({ length: 255 }).notNull(),
    identity_credential_id: uuid('identity_credential_id').notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).notNull(),
    nid: uuid(),
    identity_credential_type_id: uuid('identity_credential_type_id').notNull(),
}, (table) => [
    index('identity_credential_identifiers_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    uniqueIndex('identity_credential_identifiers_identifier_nid_type_uq_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.identity_credential_type_id.asc().nullsLast().op('uuid_ops'), table.identifier.asc().nullsLast().op('uuid_ops')),
    index('identity_credential_identifiers_nid_i_ici_idx').using('btree', table.nid.asc().nullsLast().op('text_ops'), table.identifier.asc().nullsLast().op('text_ops'), table.identity_credential_id.asc().nullsLast().op('text_ops')),
    index('identity_credential_identifiers_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
    index('identity_credential_identifiers_nid_identity_credential_id_idx').using('btree', table.identity_credential_id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    foreignKey({
        columns: [table.identity_credential_id],
        foreignColumns: [identity_credentials.id],
        name: 'identity_credential_identifiers_identity_credential_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
        columns: [table.nid],
        foreignColumns: [networks.id],
        name: 'identity_credential_identifiers_nid_fk_idx',
    }).onUpdate('restrict').onDelete('cascade'),
    foreignKey({
        columns: [table.identity_credential_type_id],
        foreignColumns: [identity_credential_types.id],
        name: 'identity_credential_identifiers_type_id_fk_idx',
    }).onUpdate('restrict').onDelete('cascade'),
]);

export const identity_verifiable_addresses = pgTable('identity_verifiable_addresses', {
    id: uuid().primaryKey().notNull(),
    status: varchar({ length: 16 }).notNull(),
    via: varchar({ length: 16 }).notNull(),
    verified: boolean().notNull(),
    value: varchar({ length: 400 }).notNull(),
    verified_at: timestamp('verified_at', { mode: 'string' }),
    identity_id: uuid('identity_id').notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).notNull(),
    nid: uuid(),
}, (table) => [
    index('identity_verifiable_addresses_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    index('identity_verifiable_addresses_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
    index('identity_verifiable_addresses_nid_identity_id_idx').using('btree', table.identity_id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    index('identity_verifiable_addresses_status_via_idx').using('btree', table.nid.asc().nullsLast().op('text_ops'), table.via.asc().nullsLast().op('text_ops'), table.value.asc().nullsLast().op('text_ops')),
    uniqueIndex('identity_verifiable_addresses_status_via_uq_idx').using('btree', table.nid.asc().nullsLast().op('text_ops'), table.via.asc().nullsLast().op('text_ops'), table.value.asc().nullsLast().op('uuid_ops')),
    foreignKey({
        columns: [table.identity_id],
        foreignColumns: [identities.id],
        name: 'identity_verifiable_addresses_identity_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
        columns: [table.nid],
        foreignColumns: [networks.id],
        name: 'identity_verifiable_addresses_nid_fk_idx',
    }).onUpdate('restrict').onDelete('cascade'),
]);

export const courier_messages = pgTable('courier_messages', {
    id: uuid().primaryKey().notNull(),
    type: integer().notNull(),
    status: integer().notNull(),
    body: text().notNull(),
    subject: varchar({ length: 255 }).notNull(),
    recipient: varchar({ length: 255 }).notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).notNull(),
    template_type: varchar('template_type', { length: 255 }).default('').notNull(),
    // todo: failed to parse database type 'bytea'
    template_data: varchar('template_data'),
    nid: uuid(),
    send_count: integer('send_count').default(0).notNull(),
    channel: varchar({ length: 32 }),
}, (table) => [
    index('courier_messages_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    index('courier_messages_nid_created_at_id_idx').using('btree', table.nid.asc().nullsLast().op('timestamp_ops'), table.created_at.desc().nullsFirst().op('uuid_ops')),
    index('courier_messages_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
    index('courier_messages_nid_recipient_created_at_id_idx').using('btree', table.nid.asc().nullsLast().op('timestamp_ops'), table.recipient.asc().nullsLast().op('text_ops'), table.created_at.desc().nullsFirst().op('uuid_ops')),
    index('courier_messages_nid_status_created_at_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.status.asc().nullsLast().op('timestamp_ops'), table.created_at.desc().nullsFirst().op('uuid_ops')),
    index('courier_messages_status_idx').using('btree', table.status.asc().nullsLast().op('int4_ops')),
    foreignKey({
        columns: [table.nid],
        foreignColumns: [networks.id],
        name: 'courier_messages_nid_fk_idx',
    }).onUpdate('restrict').onDelete('cascade'),
]);

export const selfservice_errors = pgTable('selfservice_errors', {
    id: uuid().primaryKey().notNull(),
    errors: jsonb().notNull(),
    seen_at: timestamp('seen_at', { mode: 'string' }),
    was_seen: boolean('was_seen').notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).notNull(),
    csrf_token: varchar('csrf_token', { length: 255 }).default('').notNull(),
    nid: uuid(),
}, (table) => [
    index('selfservice_errors_errors_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
    foreignKey({
        columns: [table.nid],
        foreignColumns: [networks.id],
        name: 'selfservice_errors_nid_fk_idx',
    }).onUpdate('restrict').onDelete('cascade'),
]);

export const selfservice_verification_flows = pgTable('selfservice_verification_flows', {
    id: uuid().primaryKey().notNull(),
    request_url: text('request_url').notNull(),
    issued_at: timestamp('issued_at', { mode: 'string' }).default(sql`current_timestamp`).notNull(),
    expires_at: timestamp('expires_at', { mode: 'string' }).notNull(),
    csrf_token: varchar('csrf_token', { length: 255 }).notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).notNull(),
    type: varchar({ length: 16 }).default('browser').notNull(),
    state: varchar({ length: 255 }).default('show_form').notNull(),
    active_method: varchar('active_method', { length: 32 }),
    ui: jsonb(),
    nid: uuid(),
    submit_count: integer('submit_count').default(0).notNull(),
    oauth2login_challenge: text('oauth2_login_challenge'),
    session_id: uuid('session_id'),
    identity_id: uuid('identity_id'),
    authentication_methods: json('authentication_methods'),
}, (table) => [
    index('selfservice_verification_flows_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    index('selfservice_verification_flows_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
    foreignKey({
        columns: [table.nid],
        foreignColumns: [networks.id],
        name: 'selfservice_verification_flows_nid_fk_idx',
    }).onUpdate('restrict').onDelete('cascade'),
]);

export const selfservice_settings_flows = pgTable('selfservice_settings_flows', {
    id: uuid().primaryKey().notNull(),
    request_url: text('request_url').notNull(),
    issued_at: timestamp('issued_at', { mode: 'string' }).default(sql`current_timestamp`).notNull(),
    expires_at: timestamp('expires_at', { mode: 'string' }).notNull(),
    identity_id: uuid('identity_id').notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).notNull(),
    active_method: varchar('active_method', { length: 32 }),
    state: varchar({ length: 255 }).default('show_form').notNull(),
    type: varchar({ length: 16 }).default('browser').notNull(),
    ui: jsonb(),
    nid: uuid(),
    internal_context: jsonb('internal_context').notNull(),
}, (table) => [
    index('selfservice_settings_flows_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    index('selfservice_settings_flows_identity_id_nid_idx').using('btree', table.identity_id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    index('selfservice_settings_flows_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
    foreignKey({
        columns: [table.identity_id],
        foreignColumns: [identities.id],
        name: 'selfservice_profile_management_requests_identity_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
        columns: [table.nid],
        foreignColumns: [networks.id],
        name: 'selfservice_settings_flows_nid_fk_idx',
    }).onUpdate('restrict').onDelete('cascade'),
]);

export const continuity_containers = pgTable('continuity_containers', {
    id: uuid().primaryKey().notNull(),
    identity_id: uuid('identity_id'),
    name: varchar({ length: 255 }).notNull(),
    payload: jsonb(),
    expires_at: timestamp('expires_at', { mode: 'string' }).notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).notNull(),
    nid: uuid(),
}, (table) => [
    index('continuity_containers_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    index('continuity_containers_identity_id_nid_idx').using('btree', table.identity_id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    index('continuity_containers_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
    foreignKey({
        columns: [table.identity_id],
        foreignColumns: [identities.id],
        name: 'continuity_containers_identity_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
        columns: [table.nid],
        foreignColumns: [networks.id],
        name: 'continuity_containers_nid_fk_idx',
    }).onUpdate('restrict').onDelete('cascade'),
]);

export const sessions = pgTable('sessions', {
    id: uuid().primaryKey().notNull(),
    issued_at: timestamp('issued_at', { mode: 'string' }).default(sql`current_timestamp`).notNull(),
    expires_at: timestamp('expires_at', { mode: 'string' }).notNull(),
    authenticated_at: timestamp('authenticated_at', { mode: 'string' }).notNull(),
    identity_id: uuid('identity_id').notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).notNull(),
    token: varchar({ length: 39 }),
    active: boolean().default(false),
    nid: uuid(),
    logout_token: varchar('logout_token', { length: 39 }),
    aal: varchar({ length: 4 }).default('aal1').notNull(),
    authentication_methods: jsonb('authentication_methods').notNull(),
}, (table) => [
    index('sessions_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    index('sessions_identity_id_nid_sorted_idx').using('btree', table.identity_id.asc().nullsLast().op('timestamp_ops'), table.nid.asc().nullsLast().op('timestamp_ops'), table.authenticated_at.desc().nullsFirst().op('uuid_ops')),
    uniqueIndex('sessions_logout_token_uq_idx').using('btree', table.logout_token.asc().nullsLast().op('text_ops')),
    index('sessions_nid_created_at_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.created_at.desc().nullsFirst().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
    index('sessions_nid_id_identity_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.identity_id.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
    index('sessions_token_nid_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.token.asc().nullsLast().op('text_ops')),
    uniqueIndex('sessions_token_uq_idx').using('btree', table.token.asc().nullsLast().op('text_ops')),
    foreignKey({
        columns: [table.identity_id],
        foreignColumns: [identities.id],
        name: 'sessions_identity_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
        columns: [table.nid],
        foreignColumns: [networks.id],
        name: 'sessions_nid_fk_idx',
    }).onUpdate('restrict').onDelete('cascade'),
]);

export const identity_recovery_addresses = pgTable('identity_recovery_addresses', {
    id: uuid().primaryKey().notNull(),
    via: varchar({ length: 16 }).notNull(),
    value: varchar({ length: 400 }).notNull(),
    identity_id: uuid('identity_id').notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).notNull(),
    nid: uuid(),
}, (table) => [
    index('identity_recovery_addresses_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    index('identity_recovery_addresses_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
    index('identity_recovery_addresses_nid_identity_id_idx').using('btree', table.identity_id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    index('identity_recovery_addresses_status_via_idx').using('btree', table.nid.asc().nullsLast().op('text_ops'), table.via.asc().nullsLast().op('text_ops'), table.value.asc().nullsLast().op('text_ops')),
    uniqueIndex('identity_recovery_addresses_status_via_uq_idx').using('btree', table.nid.asc().nullsLast().op('text_ops'), table.via.asc().nullsLast().op('text_ops'), table.value.asc().nullsLast().op('uuid_ops')),
    foreignKey({
        columns: [table.identity_id],
        foreignColumns: [identities.id],
        name: 'identity_recovery_addresses_identity_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
        columns: [table.nid],
        foreignColumns: [networks.id],
        name: 'identity_recovery_addresses_nid_fk_idx',
    }).onUpdate('restrict').onDelete('cascade'),
]);

export const identity_verification_tokens = pgTable('identity_verification_tokens', {
    id: uuid().primaryKey().notNull(),
    token: varchar({ length: 64 }).notNull(),
    used: boolean().default(false).notNull(),
    used_at: timestamp('used_at', { mode: 'string' }),
    expires_at: timestamp('expires_at', { mode: 'string' }).notNull(),
    issued_at: timestamp('issued_at', { mode: 'string' }).notNull(),
    identity_verifiable_address_id: uuid('identity_verifiable_address_id').notNull(),
    selfservice_verification_flow_id: uuid('selfservice_verification_flow_id').notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).notNull(),
    nid: uuid(),
}, (table) => [
    index('identity_verification_tokens_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    index('identity_verification_tokens_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
    index('identity_verification_tokens_token_nid_used_flow_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.token.asc().nullsLast().op('bool_ops'), table.used.asc().nullsLast().op('text_ops'), table.selfservice_verification_flow_id.asc().nullsLast().op('uuid_ops')),
    uniqueIndex('identity_verification_tokens_token_uq_idx').using('btree', table.token.asc().nullsLast().op('text_ops')),
    index('identity_verification_tokens_verifiable_address_id_idx').using('btree', table.identity_verifiable_address_id.asc().nullsLast().op('uuid_ops')),
    index('identity_verification_tokens_verification_flow_id_idx').using('btree', table.selfservice_verification_flow_id.asc().nullsLast().op('uuid_ops')),
    foreignKey({
        columns: [table.identity_verifiable_address_id],
        foreignColumns: [identity_verifiable_addresses.id],
        name: 'identity_verification_tokens_identity_verifiable_address_i_fkey',
    }).onDelete('cascade'),
    foreignKey({
        columns: [table.selfservice_verification_flow_id],
        foreignColumns: [selfservice_verification_flows.id],
        name: 'identity_verification_tokens_selfservice_verification_flow_fkey',
    }).onDelete('cascade'),
    foreignKey({
        columns: [table.nid],
        foreignColumns: [networks.id],
        name: 'identity_verification_tokens_nid_fk_idx',
    }).onUpdate('restrict').onDelete('cascade'),
]);

export const selfservice_recovery_flows = pgTable('selfservice_recovery_flows', {
    id: uuid().primaryKey().notNull(),
    request_url: text('request_url').notNull(),
    issued_at: timestamp('issued_at', { mode: 'string' }).default(sql`current_timestamp`).notNull(),
    expires_at: timestamp('expires_at', { mode: 'string' }).notNull(),
    active_method: varchar('active_method', { length: 32 }),
    csrf_token: varchar('csrf_token', { length: 255 }).notNull(),
    state: varchar({ length: 32 }).notNull(),
    recovered_identity_id: uuid('recovered_identity_id'),
    created_at: timestamp('created_at', { mode: 'string' }).notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).notNull(),
    type: varchar({ length: 16 }).default('browser').notNull(),
    ui: jsonb(),
    nid: uuid(),
    submit_count: integer('submit_count').default(0).notNull(),
    skip_csrf_check: boolean('skip_csrf_check').default(false).notNull(),
}, (table) => [
    index('selfservice_recovery_flows_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    index('selfservice_recovery_flows_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
    index('selfservice_recovery_flows_recovered_identity_id_nid_idx').using('btree', table.recovered_identity_id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    foreignKey({
        columns: [table.recovered_identity_id],
        foreignColumns: [identities.id],
        name: 'selfservice_recovery_requests_recovered_identity_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
        columns: [table.nid],
        foreignColumns: [networks.id],
        name: 'selfservice_recovery_flows_nid_fk_idx',
    }).onUpdate('restrict').onDelete('cascade'),
]);

export const identity_recovery_tokens = pgTable('identity_recovery_tokens', {
    id: uuid().primaryKey().notNull(),
    token: varchar({ length: 64 }).notNull(),
    used: boolean().default(false).notNull(),
    used_at: timestamp('used_at', { mode: 'string' }),
    identity_recovery_address_id: uuid('identity_recovery_address_id'),
    selfservice_recovery_flow_id: uuid('selfservice_recovery_flow_id'),
    created_at: timestamp('created_at', { mode: 'string' }).notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).notNull(),
    expires_at: timestamp('expires_at', { mode: 'string' }).default('2000-01-01 00:00:00').notNull(),
    issued_at: timestamp('issued_at', { mode: 'string' }).default('2000-01-01 00:00:00').notNull(),
    nid: uuid(),
    identity_id: uuid('identity_id').notNull(),
    token_type: integer('token_type').default(0).notNull(),
}, (table) => [
    uniqueIndex('identity_recovery_addresses_code_uq_idx').using('btree', table.token.asc().nullsLast().op('text_ops')),
    index('identity_recovery_tokens_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    index('identity_recovery_tokens_identity_id_nid_idx').using('btree', table.identity_id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    index('identity_recovery_tokens_identity_recovery_address_id_idx').using('btree', table.identity_recovery_address_id.asc().nullsLast().op('uuid_ops')),
    index('identity_recovery_tokens_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
    index('identity_recovery_tokens_selfservice_recovery_flow_id_idx').using('btree', table.selfservice_recovery_flow_id.asc().nullsLast().op('uuid_ops')),
    index('identity_recovery_tokens_token_nid_used_idx').using('btree', table.nid.asc().nullsLast().op('bool_ops'), table.token.asc().nullsLast().op('text_ops'), table.used.asc().nullsLast().op('bool_ops')),
    foreignKey({
        columns: [table.selfservice_recovery_flow_id],
        foreignColumns: [selfservice_recovery_flows.id],
        name: 'identity_recovery_tokens_selfservice_recovery_request_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
        columns: [table.nid],
        foreignColumns: [networks.id],
        name: 'identity_recovery_tokens_nid_fk_idx',
    }).onUpdate('restrict').onDelete('cascade'),
    foreignKey({
        columns: [table.identity_recovery_address_id],
        foreignColumns: [identity_recovery_addresses.id],
        name: 'identity_recovery_tokens_identity_recovery_address_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
        columns: [table.identity_id],
        foreignColumns: [identities.id],
        name: 'identity_recovery_tokens_identity_id_fk_idx',
    }).onUpdate('restrict').onDelete('cascade'),
    check('identity_recovery_tokens_token_type_ck', sql`(token_type = 1)
                                                        or
        (token_type = 2)`),
]);

export const identity_recovery_codes = pgTable('identity_recovery_codes', {
    id: uuid().primaryKey().notNull(),
    code: varchar({ length: 64 }).notNull(),
    used_at: timestamp('used_at', { mode: 'string' }),
    identity_recovery_address_id: uuid('identity_recovery_address_id'),
    code_type: integer('code_type').notNull(),
    expires_at: timestamp('expires_at', { mode: 'string' }).default('2000-01-01 00:00:00').notNull(),
    issued_at: timestamp('issued_at', { mode: 'string' }).default('2000-01-01 00:00:00').notNull(),
    selfservice_recovery_flow_id: uuid('selfservice_recovery_flow_id').notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).notNull(),
    nid: uuid().notNull(),
    identity_id: uuid('identity_id').notNull(),
}, (table) => [
    index('identity_recovery_codes_flow_id_idx').using('btree', table.selfservice_recovery_flow_id.asc().nullsLast().op('uuid_ops')),
    index('identity_recovery_codes_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    index('identity_recovery_codes_identity_id_nid_idx').using('btree', table.identity_id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    index('identity_recovery_codes_identity_recovery_address_id_nid_idx').using('btree', table.identity_recovery_address_id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    index('identity_recovery_codes_nid_flow_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.selfservice_recovery_flow_id.asc().nullsLast().op('uuid_ops')),
    foreignKey({
        columns: [table.identity_recovery_address_id],
        foreignColumns: [identity_recovery_addresses.id],
        name: 'identity_recovery_codes_identity_recovery_addresses_id_fk',
    }).onDelete('cascade'),
    foreignKey({
        columns: [table.selfservice_recovery_flow_id],
        foreignColumns: [selfservice_recovery_flows.id],
        name: 'identity_recovery_codes_selfservice_recovery_flows_id_fk',
    }).onDelete('cascade'),
    foreignKey({
        columns: [table.identity_id],
        foreignColumns: [identities.id],
        name: 'identity_recovery_codes_identity_id_fk',
    }).onUpdate('restrict').onDelete('cascade'),
    foreignKey({
        columns: [table.nid],
        foreignColumns: [networks.id],
        name: 'identity_recovery_codes_networks_id_fk',
    }).onUpdate('restrict').onDelete('cascade'),
]);

export const session_devices = pgTable('session_devices', {
    id: uuid().primaryKey().notNull(),
    ip_address: varchar('ip_address', { length: 50 }).default(''),
    user_agent: varchar('user_agent', { length: 512 }).default(''),
    location: varchar({ length: 512 }).default(''),
    nid: uuid().notNull(),
    session_id: uuid('session_id').notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).notNull(),
}, (table) => [
    index('session_devices_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    index('session_devices_session_id_nid_idx').using('btree', table.session_id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    foreignKey({
        columns: [table.session_id],
        foreignColumns: [sessions.id],
        name: 'session_metadata_sessions_id_fk',
    }).onDelete('cascade'),
    foreignKey({
        columns: [table.nid],
        foreignColumns: [networks.id],
        name: 'session_metadata_nid_fk',
    }).onDelete('cascade'),
    unique('unique_session_device').on(table.ip_address, table.user_agent, table.nid, table.session_id),
]);

export const identity_verification_codes = pgTable('identity_verification_codes', {
    id: uuid().primaryKey().notNull(),
    code_hmac: varchar('code_hmac', { length: 64 }).notNull(),
    used_at: timestamp('used_at', { mode: 'string' }),
    identity_verifiable_address_id: uuid('identity_verifiable_address_id'),
    expires_at: timestamp('expires_at', { mode: 'string' }).default('2000-01-01 00:00:00').notNull(),
    issued_at: timestamp('issued_at', { mode: 'string' }).default('2000-01-01 00:00:00').notNull(),
    selfservice_verification_flow_id: uuid('selfservice_verification_flow_id').notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).notNull(),
    nid: uuid().notNull(),
}, (table) => [
    index('identity_verification_codes_flow_id_idx').using('btree', table.selfservice_verification_flow_id.asc().nullsLast().op('uuid_ops')),
    index('identity_verification_codes_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    index('identity_verification_codes_nid_flow_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.selfservice_verification_flow_id.asc().nullsLast().op('uuid_ops')),
    index('identity_verification_codes_verifiable_address_nid_idx').using('btree', table.identity_verifiable_address_id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    foreignKey({
        columns: [table.identity_verifiable_address_id],
        foreignColumns: [identity_verifiable_addresses.id],
        name: 'identity_verification_codes_identity_verifiable_addresses_id_fk',
    }).onDelete('cascade'),
    foreignKey({
        columns: [table.selfservice_verification_flow_id],
        foreignColumns: [selfservice_verification_flows.id],
        name: 'identity_verification_codes_selfservice_verification_flows_id_f',
    }).onDelete('cascade'),
    foreignKey({
        columns: [table.nid],
        foreignColumns: [networks.id],
        name: 'identity_verification_codes_networks_id_fk',
    }).onUpdate('restrict').onDelete('cascade'),
]);

export const courier_message_dispatches = pgTable('courier_message_dispatches', {
    id: uuid().primaryKey().notNull(),
    message_id: uuid('message_id').notNull(),
    status: varchar({ length: 7 }).notNull(),
    error: json(),
    nid: uuid().notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).default(sql`current_timestamp`).notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).default(sql`current_timestamp`).notNull(),
}, (table) => [
    index('courier_message_dispatches_message_id_idx').using('btree', table.message_id.asc().nullsLast().op('timestamp_ops'), table.created_at.desc().nullsFirst().op('timestamp_ops')),
    index('courier_message_dispatches_nid_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops')),
    foreignKey({
        columns: [table.message_id],
        foreignColumns: [courier_messages.id],
        name: 'courier_message_dispatches_message_id_fk',
    }).onDelete('cascade'),
    foreignKey({
        columns: [table.nid],
        foreignColumns: [networks.id],
        name: 'courier_message_dispatches_nid_fk',
    }).onDelete('cascade'),
]);

export const session_token_exchanges = pgTable('session_token_exchanges', {
    id: uuid().primaryKey().notNull(),
    nid: uuid().notNull(),
    flow_id: uuid('flow_id').notNull(),
    session_id: uuid('session_id'),
    init_code: varchar('init_code', { length: 64 }).notNull(),
    return_to_code: varchar('return_to_code', { length: 64 }).notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).notNull(),
}, (table) => [
    index('session_token_exchanges_nid_code_idx').using('btree', table.init_code.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('text_ops')),
    index('session_token_exchanges_nid_flow_id_idx').using('btree', table.flow_id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
]);

export const identity_login_codes = pgTable('identity_login_codes', {
    id: uuid().primaryKey().notNull(),
    code: varchar({ length: 64 }).notNull(),
    address: varchar({ length: 255 }).notNull(),
    address_type: char('address_type', { length: 36 }).notNull(),
    used_at: timestamp('used_at', { mode: 'string' }),
    expires_at: timestamp('expires_at', { mode: 'string' }).default('2000-01-01 00:00:00').notNull(),
    issued_at: timestamp('issued_at', { mode: 'string' }).default('2000-01-01 00:00:00').notNull(),
    selfservice_login_flow_id: uuid('selfservice_login_flow_id').notNull(),
    identity_id: uuid('identity_id').notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).default(sql`current_timestamp`).notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).default(sql`current_timestamp`).notNull(),
    nid: uuid().notNull(),
}, (table) => [
    index('identity_login_codes_flow_id_idx').using('btree', table.selfservice_login_flow_id.asc().nullsLast().op('uuid_ops')),
    index('identity_login_codes_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    index('identity_login_codes_identity_id_idx').using('btree', table.identity_id.asc().nullsLast().op('uuid_ops')),
    index('identity_login_codes_nid_flow_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.selfservice_login_flow_id.asc().nullsLast().op('uuid_ops')),
    foreignKey({
        columns: [table.selfservice_login_flow_id],
        foreignColumns: [selfservice_login_flows.id],
        name: 'identity_login_codes_selfservice_login_flows_id_fk',
    }).onDelete('cascade'),
    foreignKey({
        columns: [table.nid],
        foreignColumns: [networks.id],
        name: 'identity_login_codes_networks_id_fk',
    }).onUpdate('restrict').onDelete('cascade'),
    foreignKey({
        columns: [table.identity_id],
        foreignColumns: [identities.id],
        name: 'identity_login_codes_identity_id_fk',
    }).onUpdate('restrict').onDelete('cascade'),
]);

export const identity_registration_codes = pgTable('identity_registration_codes', {
    id: uuid().primaryKey().notNull(),
    code: varchar({ length: 64 }).notNull(),
    address: varchar({ length: 255 }).notNull(),
    address_type: char('address_type', { length: 36 }).notNull(),
    used_at: timestamp('used_at', { mode: 'string' }),
    expires_at: timestamp('expires_at', { mode: 'string' }).default('2000-01-01 00:00:00').notNull(),
    issued_at: timestamp('issued_at', { mode: 'string' }).default('2000-01-01 00:00:00').notNull(),
    selfservice_registration_flow_id: uuid('selfservice_registration_flow_id').notNull(),
    created_at: timestamp('created_at', { mode: 'string' }).default(sql`current_timestamp`).notNull(),
    updated_at: timestamp('updated_at', { mode: 'string' }).default(sql`current_timestamp`).notNull(),
    nid: uuid().notNull(),
}, (table) => [
    index('identity_registration_codes_flow_id_idx').using('btree', table.selfservice_registration_flow_id.asc().nullsLast().op('uuid_ops')),
    index('identity_registration_codes_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
    index('identity_registration_codes_nid_flow_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.selfservice_registration_flow_id.asc().nullsLast().op('uuid_ops')),
    foreignKey({
        columns: [table.selfservice_registration_flow_id],
        foreignColumns: [selfservice_registration_flows.id],
        name: 'identity_registration_codes_selfservice_registration_flows_id_f',
    }).onDelete('cascade'),
    foreignKey({
        columns: [table.nid],
        foreignColumns: [networks.id],
        name: 'identity_registration_codes_networks_id_fk',
    }).onUpdate('restrict').onDelete('cascade'),
]);
