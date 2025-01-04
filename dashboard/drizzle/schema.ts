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

export const schemaMigration = pgTable('schema_migration', {
	version: varchar({ length: 48 }).notNull(),
	versionSelf: integer('version_self').default(0).notNull(),
}, (table) => [
	uniqueIndex('schema_migration_version_idx').using('btree', table.version.asc().nullsLast().op('text_ops')),
	index('schema_migration_version_self_idx').using('btree', table.versionSelf.asc().nullsLast().op('int4_ops')),
]);

export const identityCredentials = pgTable('identity_credentials', {
	id: uuid().primaryKey().notNull(),
	config: jsonb().notNull(),
	identityCredentialTypeId: uuid('identity_credential_type_id').notNull(),
	identityId: uuid('identity_id').notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
	nid: uuid(),
	version: integer().default(0).notNull(),
}, (table) => [
	index('identity_credentials_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	index('identity_credentials_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
	index('identity_credentials_nid_identity_id_idx').using('btree', table.identityId.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	foreignKey({
		columns: [table.identityId],
		foreignColumns: [identities.id],
		name: 'identity_credentials_identity_id_fkey',
	}).onDelete('cascade'),
	foreignKey({
		columns: [table.identityCredentialTypeId],
		foreignColumns: [identityCredentialTypes.id],
		name: 'identity_credentials_identity_credential_type_id_fkey',
	}).onDelete('cascade'),
	foreignKey({
		columns: [table.nid],
		foreignColumns: [networks.id],
		name: 'identity_credentials_nid_fk_idx',
	}).onUpdate('restrict').onDelete('cascade'),
]);

export const identityCredentialTypes = pgTable('identity_credential_types', {
	id: uuid().primaryKey().notNull(),
	name: varchar({ length: 32 }).notNull(),
}, (table) => [
	uniqueIndex('identity_credential_types_name_idx').using('btree', table.name.asc().nullsLast().op('text_ops')),
]);

export const selfserviceLoginFlows = pgTable('selfservice_login_flows', {
	id: uuid().primaryKey().notNull(),
	requestUrl: text('request_url').notNull(),
	issuedAt: timestamp('issued_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	expiresAt: timestamp('expires_at', { mode: 'string' }).notNull(),
	activeMethod: varchar('active_method', { length: 32 }).notNull(),
	csrfToken: varchar('csrf_token', { length: 255 }).notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
	forced: boolean().default(false).notNull(),
	type: varchar({ length: 16 }).default('browser').notNull(),
	ui: jsonb(),
	nid: uuid(),
	requestedAal: varchar('requested_aal', { length: 4 }).default('aal1').notNull(),
	internalContext: jsonb('internal_context').notNull(),
	oauth2LoginChallenge: uuid('oauth2_login_challenge'),
	oauth2LoginChallengeData: text('oauth2_login_challenge_data'),
	state: varchar({ length: 255 }),
	submitCount: integer('submit_count').default(0).notNull(),
	organizationId: uuid('organization_id'),
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
	createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
});

export const selfserviceRegistrationFlows = pgTable('selfservice_registration_flows', {
	id: uuid().primaryKey().notNull(),
	requestUrl: text('request_url').notNull(),
	issuedAt: timestamp('issued_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	expiresAt: timestamp('expires_at', { mode: 'string' }).notNull(),
	activeMethod: varchar('active_method', { length: 32 }).notNull(),
	csrfToken: varchar('csrf_token', { length: 255 }).notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
	type: varchar({ length: 16 }).default('browser').notNull(),
	ui: jsonb(),
	nid: uuid(),
	internalContext: jsonb('internal_context').notNull(),
	oauth2LoginChallenge: uuid('oauth2_login_challenge'),
	oauth2LoginChallengeData: text('oauth2_login_challenge_data'),
	state: varchar({ length: 255 }),
	submitCount: integer('submit_count').default(0).notNull(),
	organizationId: uuid('organization_id'),
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
	schemaId: varchar('schema_id', { length: 2048 }).notNull(),
	traits: jsonb().notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
	nid: uuid(),
	state: varchar({ length: 255 }).default('active').notNull(),
	stateChangedAt: timestamp('state_changed_at', { mode: 'string' }),
	metadataPublic: jsonb('metadata_public'),
	metadataAdmin: jsonb('metadata_admin'),
	availableAal: varchar('available_aal', { length: 4 }),
	organizationId: uuid('organization_id'),
}, (table) => [
	index('identities_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	index('identities_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
	foreignKey({
		columns: [table.nid],
		foreignColumns: [networks.id],
		name: 'identities_nid_fk_idx',
	}).onUpdate('restrict').onDelete('cascade'),
]);

export const identityCredentialIdentifiers = pgTable('identity_credential_identifiers', {
	id: uuid().primaryKey().notNull(),
	identifier: varchar({ length: 255 }).notNull(),
	identityCredentialId: uuid('identity_credential_id').notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
	nid: uuid(),
	identityCredentialTypeId: uuid('identity_credential_type_id').notNull(),
}, (table) => [
	index('identity_credential_identifiers_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	uniqueIndex('identity_credential_identifiers_identifier_nid_type_uq_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.identityCredentialTypeId.asc().nullsLast().op('uuid_ops'), table.identifier.asc().nullsLast().op('uuid_ops')),
	index('identity_credential_identifiers_nid_i_ici_idx').using('btree', table.nid.asc().nullsLast().op('text_ops'), table.identifier.asc().nullsLast().op('text_ops'), table.identityCredentialId.asc().nullsLast().op('text_ops')),
	index('identity_credential_identifiers_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
	index('identity_credential_identifiers_nid_identity_credential_id_idx').using('btree', table.identityCredentialId.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	foreignKey({
		columns: [table.identityCredentialId],
		foreignColumns: [identityCredentials.id],
		name: 'identity_credential_identifiers_identity_credential_id_fkey',
	}).onDelete('cascade'),
	foreignKey({
		columns: [table.nid],
		foreignColumns: [networks.id],
		name: 'identity_credential_identifiers_nid_fk_idx',
	}).onUpdate('restrict').onDelete('cascade'),
	foreignKey({
		columns: [table.identityCredentialTypeId],
		foreignColumns: [identityCredentialTypes.id],
		name: 'identity_credential_identifiers_type_id_fk_idx',
	}).onUpdate('restrict').onDelete('cascade'),
]);

export const identityVerifiableAddresses = pgTable('identity_verifiable_addresses', {
	id: uuid().primaryKey().notNull(),
	status: varchar({ length: 16 }).notNull(),
	via: varchar({ length: 16 }).notNull(),
	verified: boolean().notNull(),
	value: varchar({ length: 400 }).notNull(),
	verifiedAt: timestamp('verified_at', { mode: 'string' }),
	identityId: uuid('identity_id').notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
	nid: uuid(),
}, (table) => [
	index('identity_verifiable_addresses_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	index('identity_verifiable_addresses_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
	index('identity_verifiable_addresses_nid_identity_id_idx').using('btree', table.identityId.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	index('identity_verifiable_addresses_status_via_idx').using('btree', table.nid.asc().nullsLast().op('text_ops'), table.via.asc().nullsLast().op('text_ops'), table.value.asc().nullsLast().op('text_ops')),
	uniqueIndex('identity_verifiable_addresses_status_via_uq_idx').using('btree', table.nid.asc().nullsLast().op('text_ops'), table.via.asc().nullsLast().op('text_ops'), table.value.asc().nullsLast().op('uuid_ops')),
	foreignKey({
		columns: [table.identityId],
		foreignColumns: [identities.id],
		name: 'identity_verifiable_addresses_identity_id_fkey',
	}).onDelete('cascade'),
	foreignKey({
		columns: [table.nid],
		foreignColumns: [networks.id],
		name: 'identity_verifiable_addresses_nid_fk_idx',
	}).onUpdate('restrict').onDelete('cascade'),
]);

export const courierMessages = pgTable('courier_messages', {
	id: uuid().primaryKey().notNull(),
	type: integer().notNull(),
	status: integer().notNull(),
	body: text().notNull(),
	subject: varchar({ length: 255 }).notNull(),
	recipient: varchar({ length: 255 }).notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
	templateType: varchar('template_type', { length: 255 }).default('').notNull(),
	// TODO: failed to parse database type 'bytea'
	templateData: varchar('template_data'),
	nid: uuid(),
	sendCount: integer('send_count').default(0).notNull(),
	channel: varchar({ length: 32 }),
}, (table) => [
	index('courier_messages_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	index('courier_messages_nid_created_at_id_idx').using('btree', table.nid.asc().nullsLast().op('timestamp_ops'), table.createdAt.desc().nullsFirst().op('uuid_ops')),
	index('courier_messages_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
	index('courier_messages_nid_recipient_created_at_id_idx').using('btree', table.nid.asc().nullsLast().op('timestamp_ops'), table.recipient.asc().nullsLast().op('text_ops'), table.createdAt.desc().nullsFirst().op('uuid_ops')),
	index('courier_messages_nid_status_created_at_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.status.asc().nullsLast().op('timestamp_ops'), table.createdAt.desc().nullsFirst().op('uuid_ops')),
	index('courier_messages_status_idx').using('btree', table.status.asc().nullsLast().op('int4_ops')),
	foreignKey({
		columns: [table.nid],
		foreignColumns: [networks.id],
		name: 'courier_messages_nid_fk_idx',
	}).onUpdate('restrict').onDelete('cascade'),
]);

export const selfserviceErrors = pgTable('selfservice_errors', {
	id: uuid().primaryKey().notNull(),
	errors: jsonb().notNull(),
	seenAt: timestamp('seen_at', { mode: 'string' }),
	wasSeen: boolean('was_seen').notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
	csrfToken: varchar('csrf_token', { length: 255 }).default('').notNull(),
	nid: uuid(),
}, (table) => [
	index('selfservice_errors_errors_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
	foreignKey({
		columns: [table.nid],
		foreignColumns: [networks.id],
		name: 'selfservice_errors_nid_fk_idx',
	}).onUpdate('restrict').onDelete('cascade'),
]);

export const selfserviceVerificationFlows = pgTable('selfservice_verification_flows', {
	id: uuid().primaryKey().notNull(),
	requestUrl: text('request_url').notNull(),
	issuedAt: timestamp('issued_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	expiresAt: timestamp('expires_at', { mode: 'string' }).notNull(),
	csrfToken: varchar('csrf_token', { length: 255 }).notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
	type: varchar({ length: 16 }).default('browser').notNull(),
	state: varchar({ length: 255 }).default('show_form').notNull(),
	activeMethod: varchar('active_method', { length: 32 }),
	ui: jsonb(),
	nid: uuid(),
	submitCount: integer('submit_count').default(0).notNull(),
	oauth2LoginChallenge: text('oauth2_login_challenge'),
	sessionId: uuid('session_id'),
	identityId: uuid('identity_id'),
	authenticationMethods: json('authentication_methods'),
}, (table) => [
	index('selfservice_verification_flows_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	index('selfservice_verification_flows_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
	foreignKey({
		columns: [table.nid],
		foreignColumns: [networks.id],
		name: 'selfservice_verification_flows_nid_fk_idx',
	}).onUpdate('restrict').onDelete('cascade'),
]);

export const selfserviceSettingsFlows = pgTable('selfservice_settings_flows', {
	id: uuid().primaryKey().notNull(),
	requestUrl: text('request_url').notNull(),
	issuedAt: timestamp('issued_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	expiresAt: timestamp('expires_at', { mode: 'string' }).notNull(),
	identityId: uuid('identity_id').notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
	activeMethod: varchar('active_method', { length: 32 }),
	state: varchar({ length: 255 }).default('show_form').notNull(),
	type: varchar({ length: 16 }).default('browser').notNull(),
	ui: jsonb(),
	nid: uuid(),
	internalContext: jsonb('internal_context').notNull(),
}, (table) => [
	index('selfservice_settings_flows_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	index('selfservice_settings_flows_identity_id_nid_idx').using('btree', table.identityId.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	index('selfservice_settings_flows_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
	foreignKey({
		columns: [table.identityId],
		foreignColumns: [identities.id],
		name: 'selfservice_profile_management_requests_identity_id_fkey',
	}).onDelete('cascade'),
	foreignKey({
		columns: [table.nid],
		foreignColumns: [networks.id],
		name: 'selfservice_settings_flows_nid_fk_idx',
	}).onUpdate('restrict').onDelete('cascade'),
]);

export const continuityContainers = pgTable('continuity_containers', {
	id: uuid().primaryKey().notNull(),
	identityId: uuid('identity_id'),
	name: varchar({ length: 255 }).notNull(),
	payload: jsonb(),
	expiresAt: timestamp('expires_at', { mode: 'string' }).notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
	nid: uuid(),
}, (table) => [
	index('continuity_containers_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	index('continuity_containers_identity_id_nid_idx').using('btree', table.identityId.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	index('continuity_containers_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
	foreignKey({
		columns: [table.identityId],
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
	issuedAt: timestamp('issued_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	expiresAt: timestamp('expires_at', { mode: 'string' }).notNull(),
	authenticatedAt: timestamp('authenticated_at', { mode: 'string' }).notNull(),
	identityId: uuid('identity_id').notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
	token: varchar({ length: 39 }),
	active: boolean().default(false),
	nid: uuid(),
	logoutToken: varchar('logout_token', { length: 39 }),
	aal: varchar({ length: 4 }).default('aal1').notNull(),
	authenticationMethods: jsonb('authentication_methods').notNull(),
}, (table) => [
	index('sessions_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	index('sessions_identity_id_nid_sorted_idx').using('btree', table.identityId.asc().nullsLast().op('timestamp_ops'), table.nid.asc().nullsLast().op('timestamp_ops'), table.authenticatedAt.desc().nullsFirst().op('uuid_ops')),
	uniqueIndex('sessions_logout_token_uq_idx').using('btree', table.logoutToken.asc().nullsLast().op('text_ops')),
	index('sessions_nid_created_at_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.createdAt.desc().nullsFirst().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
	index('sessions_nid_id_identity_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.identityId.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
	index('sessions_token_nid_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.token.asc().nullsLast().op('text_ops')),
	uniqueIndex('sessions_token_uq_idx').using('btree', table.token.asc().nullsLast().op('text_ops')),
	foreignKey({
		columns: [table.identityId],
		foreignColumns: [identities.id],
		name: 'sessions_identity_id_fkey',
	}).onDelete('cascade'),
	foreignKey({
		columns: [table.nid],
		foreignColumns: [networks.id],
		name: 'sessions_nid_fk_idx',
	}).onUpdate('restrict').onDelete('cascade'),
]);

export const identityRecoveryAddresses = pgTable('identity_recovery_addresses', {
	id: uuid().primaryKey().notNull(),
	via: varchar({ length: 16 }).notNull(),
	value: varchar({ length: 400 }).notNull(),
	identityId: uuid('identity_id').notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
	nid: uuid(),
}, (table) => [
	index('identity_recovery_addresses_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	index('identity_recovery_addresses_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
	index('identity_recovery_addresses_nid_identity_id_idx').using('btree', table.identityId.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	index('identity_recovery_addresses_status_via_idx').using('btree', table.nid.asc().nullsLast().op('text_ops'), table.via.asc().nullsLast().op('text_ops'), table.value.asc().nullsLast().op('text_ops')),
	uniqueIndex('identity_recovery_addresses_status_via_uq_idx').using('btree', table.nid.asc().nullsLast().op('text_ops'), table.via.asc().nullsLast().op('text_ops'), table.value.asc().nullsLast().op('uuid_ops')),
	foreignKey({
		columns: [table.identityId],
		foreignColumns: [identities.id],
		name: 'identity_recovery_addresses_identity_id_fkey',
	}).onDelete('cascade'),
	foreignKey({
		columns: [table.nid],
		foreignColumns: [networks.id],
		name: 'identity_recovery_addresses_nid_fk_idx',
	}).onUpdate('restrict').onDelete('cascade'),
]);

export const identityVerificationTokens = pgTable('identity_verification_tokens', {
	id: uuid().primaryKey().notNull(),
	token: varchar({ length: 64 }).notNull(),
	used: boolean().default(false).notNull(),
	usedAt: timestamp('used_at', { mode: 'string' }),
	expiresAt: timestamp('expires_at', { mode: 'string' }).notNull(),
	issuedAt: timestamp('issued_at', { mode: 'string' }).notNull(),
	identityVerifiableAddressId: uuid('identity_verifiable_address_id').notNull(),
	selfserviceVerificationFlowId: uuid('selfservice_verification_flow_id').notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
	nid: uuid(),
}, (table) => [
	index('identity_verification_tokens_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	index('identity_verification_tokens_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
	index('identity_verification_tokens_token_nid_used_flow_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.token.asc().nullsLast().op('bool_ops'), table.used.asc().nullsLast().op('text_ops'), table.selfserviceVerificationFlowId.asc().nullsLast().op('uuid_ops')),
	uniqueIndex('identity_verification_tokens_token_uq_idx').using('btree', table.token.asc().nullsLast().op('text_ops')),
	index('identity_verification_tokens_verifiable_address_id_idx').using('btree', table.identityVerifiableAddressId.asc().nullsLast().op('uuid_ops')),
	index('identity_verification_tokens_verification_flow_id_idx').using('btree', table.selfserviceVerificationFlowId.asc().nullsLast().op('uuid_ops')),
	foreignKey({
		columns: [table.identityVerifiableAddressId],
		foreignColumns: [identityVerifiableAddresses.id],
		name: 'identity_verification_tokens_identity_verifiable_address_i_fkey',
	}).onDelete('cascade'),
	foreignKey({
		columns: [table.selfserviceVerificationFlowId],
		foreignColumns: [selfserviceVerificationFlows.id],
		name: 'identity_verification_tokens_selfservice_verification_flow_fkey',
	}).onDelete('cascade'),
	foreignKey({
		columns: [table.nid],
		foreignColumns: [networks.id],
		name: 'identity_verification_tokens_nid_fk_idx',
	}).onUpdate('restrict').onDelete('cascade'),
]);

export const selfserviceRecoveryFlows = pgTable('selfservice_recovery_flows', {
	id: uuid().primaryKey().notNull(),
	requestUrl: text('request_url').notNull(),
	issuedAt: timestamp('issued_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	expiresAt: timestamp('expires_at', { mode: 'string' }).notNull(),
	activeMethod: varchar('active_method', { length: 32 }),
	csrfToken: varchar('csrf_token', { length: 255 }).notNull(),
	state: varchar({ length: 32 }).notNull(),
	recoveredIdentityId: uuid('recovered_identity_id'),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
	type: varchar({ length: 16 }).default('browser').notNull(),
	ui: jsonb(),
	nid: uuid(),
	submitCount: integer('submit_count').default(0).notNull(),
	skipCsrfCheck: boolean('skip_csrf_check').default(false).notNull(),
}, (table) => [
	index('selfservice_recovery_flows_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	index('selfservice_recovery_flows_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
	index('selfservice_recovery_flows_recovered_identity_id_nid_idx').using('btree', table.recoveredIdentityId.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	foreignKey({
		columns: [table.recoveredIdentityId],
		foreignColumns: [identities.id],
		name: 'selfservice_recovery_requests_recovered_identity_id_fkey',
	}).onDelete('cascade'),
	foreignKey({
		columns: [table.nid],
		foreignColumns: [networks.id],
		name: 'selfservice_recovery_flows_nid_fk_idx',
	}).onUpdate('restrict').onDelete('cascade'),
]);

export const identityRecoveryTokens = pgTable('identity_recovery_tokens', {
	id: uuid().primaryKey().notNull(),
	token: varchar({ length: 64 }).notNull(),
	used: boolean().default(false).notNull(),
	usedAt: timestamp('used_at', { mode: 'string' }),
	identityRecoveryAddressId: uuid('identity_recovery_address_id'),
	selfserviceRecoveryFlowId: uuid('selfservice_recovery_flow_id'),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
	expiresAt: timestamp('expires_at', { mode: 'string' }).default('2000-01-01 00:00:00').notNull(),
	issuedAt: timestamp('issued_at', { mode: 'string' }).default('2000-01-01 00:00:00').notNull(),
	nid: uuid(),
	identityId: uuid('identity_id').notNull(),
	tokenType: integer('token_type').default(0).notNull(),
}, (table) => [
	uniqueIndex('identity_recovery_addresses_code_uq_idx').using('btree', table.token.asc().nullsLast().op('text_ops')),
	index('identity_recovery_tokens_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	index('identity_recovery_tokens_identity_id_nid_idx').using('btree', table.identityId.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	index('identity_recovery_tokens_identity_recovery_address_id_idx').using('btree', table.identityRecoveryAddressId.asc().nullsLast().op('uuid_ops')),
	index('identity_recovery_tokens_nid_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.id.asc().nullsLast().op('uuid_ops')),
	index('identity_recovery_tokens_selfservice_recovery_flow_id_idx').using('btree', table.selfserviceRecoveryFlowId.asc().nullsLast().op('uuid_ops')),
	index('identity_recovery_tokens_token_nid_used_idx').using('btree', table.nid.asc().nullsLast().op('bool_ops'), table.token.asc().nullsLast().op('text_ops'), table.used.asc().nullsLast().op('bool_ops')),
	foreignKey({
		columns: [table.selfserviceRecoveryFlowId],
		foreignColumns: [selfserviceRecoveryFlows.id],
		name: 'identity_recovery_tokens_selfservice_recovery_request_id_fkey',
	}).onDelete('cascade'),
	foreignKey({
		columns: [table.nid],
		foreignColumns: [networks.id],
		name: 'identity_recovery_tokens_nid_fk_idx',
	}).onUpdate('restrict').onDelete('cascade'),
	foreignKey({
		columns: [table.identityRecoveryAddressId],
		foreignColumns: [identityRecoveryAddresses.id],
		name: 'identity_recovery_tokens_identity_recovery_address_id_fkey',
	}).onDelete('cascade'),
	foreignKey({
		columns: [table.identityId],
		foreignColumns: [identities.id],
		name: 'identity_recovery_tokens_identity_id_fk_idx',
	}).onUpdate('restrict').onDelete('cascade'),
	check('identity_recovery_tokens_token_type_ck', sql`(token_type = 1)
														OR (token_type = 2)`),
]);

export const identityRecoveryCodes = pgTable('identity_recovery_codes', {
	id: uuid().primaryKey().notNull(),
	code: varchar({ length: 64 }).notNull(),
	usedAt: timestamp('used_at', { mode: 'string' }),
	identityRecoveryAddressId: uuid('identity_recovery_address_id'),
	codeType: integer('code_type').notNull(),
	expiresAt: timestamp('expires_at', { mode: 'string' }).default('2000-01-01 00:00:00').notNull(),
	issuedAt: timestamp('issued_at', { mode: 'string' }).default('2000-01-01 00:00:00').notNull(),
	selfserviceRecoveryFlowId: uuid('selfservice_recovery_flow_id').notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
	nid: uuid().notNull(),
	identityId: uuid('identity_id').notNull(),
}, (table) => [
	index('identity_recovery_codes_flow_id_idx').using('btree', table.selfserviceRecoveryFlowId.asc().nullsLast().op('uuid_ops')),
	index('identity_recovery_codes_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	index('identity_recovery_codes_identity_id_nid_idx').using('btree', table.identityId.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	index('identity_recovery_codes_identity_recovery_address_id_nid_idx').using('btree', table.identityRecoveryAddressId.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	index('identity_recovery_codes_nid_flow_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.selfserviceRecoveryFlowId.asc().nullsLast().op('uuid_ops')),
	foreignKey({
		columns: [table.identityRecoveryAddressId],
		foreignColumns: [identityRecoveryAddresses.id],
		name: 'identity_recovery_codes_identity_recovery_addresses_id_fk',
	}).onDelete('cascade'),
	foreignKey({
		columns: [table.selfserviceRecoveryFlowId],
		foreignColumns: [selfserviceRecoveryFlows.id],
		name: 'identity_recovery_codes_selfservice_recovery_flows_id_fk',
	}).onDelete('cascade'),
	foreignKey({
		columns: [table.identityId],
		foreignColumns: [identities.id],
		name: 'identity_recovery_codes_identity_id_fk',
	}).onUpdate('restrict').onDelete('cascade'),
	foreignKey({
		columns: [table.nid],
		foreignColumns: [networks.id],
		name: 'identity_recovery_codes_networks_id_fk',
	}).onUpdate('restrict').onDelete('cascade'),
]);

export const sessionDevices = pgTable('session_devices', {
	id: uuid().primaryKey().notNull(),
	ipAddress: varchar('ip_address', { length: 50 }).default(''),
	userAgent: varchar('user_agent', { length: 512 }).default(''),
	location: varchar({ length: 512 }).default(''),
	nid: uuid().notNull(),
	sessionId: uuid('session_id').notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
}, (table) => [
	index('session_devices_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	index('session_devices_session_id_nid_idx').using('btree', table.sessionId.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	foreignKey({
		columns: [table.sessionId],
		foreignColumns: [sessions.id],
		name: 'session_metadata_sessions_id_fk',
	}).onDelete('cascade'),
	foreignKey({
		columns: [table.nid],
		foreignColumns: [networks.id],
		name: 'session_metadata_nid_fk',
	}).onDelete('cascade'),
	unique('unique_session_device').on(table.ipAddress, table.userAgent, table.nid, table.sessionId),
]);

export const identityVerificationCodes = pgTable('identity_verification_codes', {
	id: uuid().primaryKey().notNull(),
	codeHmac: varchar('code_hmac', { length: 64 }).notNull(),
	usedAt: timestamp('used_at', { mode: 'string' }),
	identityVerifiableAddressId: uuid('identity_verifiable_address_id'),
	expiresAt: timestamp('expires_at', { mode: 'string' }).default('2000-01-01 00:00:00').notNull(),
	issuedAt: timestamp('issued_at', { mode: 'string' }).default('2000-01-01 00:00:00').notNull(),
	selfserviceVerificationFlowId: uuid('selfservice_verification_flow_id').notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
	nid: uuid().notNull(),
}, (table) => [
	index('identity_verification_codes_flow_id_idx').using('btree', table.selfserviceVerificationFlowId.asc().nullsLast().op('uuid_ops')),
	index('identity_verification_codes_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	index('identity_verification_codes_nid_flow_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.selfserviceVerificationFlowId.asc().nullsLast().op('uuid_ops')),
	index('identity_verification_codes_verifiable_address_nid_idx').using('btree', table.identityVerifiableAddressId.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	foreignKey({
		columns: [table.identityVerifiableAddressId],
		foreignColumns: [identityVerifiableAddresses.id],
		name: 'identity_verification_codes_identity_verifiable_addresses_id_fk',
	}).onDelete('cascade'),
	foreignKey({
		columns: [table.selfserviceVerificationFlowId],
		foreignColumns: [selfserviceVerificationFlows.id],
		name: 'identity_verification_codes_selfservice_verification_flows_id_f',
	}).onDelete('cascade'),
	foreignKey({
		columns: [table.nid],
		foreignColumns: [networks.id],
		name: 'identity_verification_codes_networks_id_fk',
	}).onUpdate('restrict').onDelete('cascade'),
]);

export const courierMessageDispatches = pgTable('courier_message_dispatches', {
	id: uuid().primaryKey().notNull(),
	messageId: uuid('message_id').notNull(),
	status: varchar({ length: 7 }).notNull(),
	error: json(),
	nid: uuid().notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	index('courier_message_dispatches_message_id_idx').using('btree', table.messageId.asc().nullsLast().op('timestamp_ops'), table.createdAt.desc().nullsFirst().op('timestamp_ops')),
	index('courier_message_dispatches_nid_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops')),
	foreignKey({
		columns: [table.messageId],
		foreignColumns: [courierMessages.id],
		name: 'courier_message_dispatches_message_id_fk',
	}).onDelete('cascade'),
	foreignKey({
		columns: [table.nid],
		foreignColumns: [networks.id],
		name: 'courier_message_dispatches_nid_fk',
	}).onDelete('cascade'),
]);

export const sessionTokenExchanges = pgTable('session_token_exchanges', {
	id: uuid().primaryKey().notNull(),
	nid: uuid().notNull(),
	flowId: uuid('flow_id').notNull(),
	sessionId: uuid('session_id'),
	initCode: varchar('init_code', { length: 64 }).notNull(),
	returnToCode: varchar('return_to_code', { length: 64 }).notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).notNull(),
}, (table) => [
	index('session_token_exchanges_nid_code_idx').using('btree', table.initCode.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('text_ops')),
	index('session_token_exchanges_nid_flow_id_idx').using('btree', table.flowId.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
]);

export const identityLoginCodes = pgTable('identity_login_codes', {
	id: uuid().primaryKey().notNull(),
	code: varchar({ length: 64 }).notNull(),
	address: varchar({ length: 255 }).notNull(),
	addressType: char('address_type', { length: 36 }).notNull(),
	usedAt: timestamp('used_at', { mode: 'string' }),
	expiresAt: timestamp('expires_at', { mode: 'string' }).default('2000-01-01 00:00:00').notNull(),
	issuedAt: timestamp('issued_at', { mode: 'string' }).default('2000-01-01 00:00:00').notNull(),
	selfserviceLoginFlowId: uuid('selfservice_login_flow_id').notNull(),
	identityId: uuid('identity_id').notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	nid: uuid().notNull(),
}, (table) => [
	index('identity_login_codes_flow_id_idx').using('btree', table.selfserviceLoginFlowId.asc().nullsLast().op('uuid_ops')),
	index('identity_login_codes_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	index('identity_login_codes_identity_id_idx').using('btree', table.identityId.asc().nullsLast().op('uuid_ops')),
	index('identity_login_codes_nid_flow_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.selfserviceLoginFlowId.asc().nullsLast().op('uuid_ops')),
	foreignKey({
		columns: [table.selfserviceLoginFlowId],
		foreignColumns: [selfserviceLoginFlows.id],
		name: 'identity_login_codes_selfservice_login_flows_id_fk',
	}).onDelete('cascade'),
	foreignKey({
		columns: [table.nid],
		foreignColumns: [networks.id],
		name: 'identity_login_codes_networks_id_fk',
	}).onUpdate('restrict').onDelete('cascade'),
	foreignKey({
		columns: [table.identityId],
		foreignColumns: [identities.id],
		name: 'identity_login_codes_identity_id_fk',
	}).onUpdate('restrict').onDelete('cascade'),
]);

export const identityRegistrationCodes = pgTable('identity_registration_codes', {
	id: uuid().primaryKey().notNull(),
	code: varchar({ length: 64 }).notNull(),
	address: varchar({ length: 255 }).notNull(),
	addressType: char('address_type', { length: 36 }).notNull(),
	usedAt: timestamp('used_at', { mode: 'string' }),
	expiresAt: timestamp('expires_at', { mode: 'string' }).default('2000-01-01 00:00:00').notNull(),
	issuedAt: timestamp('issued_at', { mode: 'string' }).default('2000-01-01 00:00:00').notNull(),
	selfserviceRegistrationFlowId: uuid('selfservice_registration_flow_id').notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp('updated_at', { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	nid: uuid().notNull(),
}, (table) => [
	index('identity_registration_codes_flow_id_idx').using('btree', table.selfserviceRegistrationFlowId.asc().nullsLast().op('uuid_ops')),
	index('identity_registration_codes_id_nid_idx').using('btree', table.id.asc().nullsLast().op('uuid_ops'), table.nid.asc().nullsLast().op('uuid_ops')),
	index('identity_registration_codes_nid_flow_id_idx').using('btree', table.nid.asc().nullsLast().op('uuid_ops'), table.selfserviceRegistrationFlowId.asc().nullsLast().op('uuid_ops')),
	foreignKey({
		columns: [table.selfserviceRegistrationFlowId],
		foreignColumns: [selfserviceRegistrationFlows.id],
		name: 'identity_registration_codes_selfservice_registration_flows_id_f',
	}).onDelete('cascade'),
	foreignKey({
		columns: [table.nid],
		foreignColumns: [networks.id],
		name: 'identity_registration_codes_networks_id_fk',
	}).onUpdate('restrict').onDelete('cascade'),
]);
