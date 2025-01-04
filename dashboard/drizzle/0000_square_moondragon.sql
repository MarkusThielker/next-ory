-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "schema_migration" (
	"version" varchar(48) NOT NULL,
	"version_self" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "identity_credentials" (
	"id" uuid PRIMARY KEY NOT NULL,
	"config" jsonb NOT NULL,
	"identity_credential_type_id" uuid NOT NULL,
	"identity_id" uuid NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"nid" uuid,
	"version" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "identity_credential_types" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(32) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "selfservice_login_flows" (
	"id" uuid PRIMARY KEY NOT NULL,
	"request_url" text NOT NULL,
	"issued_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"expires_at" timestamp NOT NULL,
	"active_method" varchar(32) NOT NULL,
	"csrf_token" varchar(255) NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"forced" boolean DEFAULT false NOT NULL,
	"type" varchar(16) DEFAULT 'browser' NOT NULL,
	"ui" jsonb,
	"nid" uuid,
	"requested_aal" varchar(4) DEFAULT 'aal1' NOT NULL,
	"internal_context" jsonb NOT NULL,
	"oauth2_login_challenge" uuid,
	"oauth2_login_challenge_data" text,
	"state" varchar(255),
	"submit_count" integer DEFAULT 0 NOT NULL,
	"organization_id" uuid
);
--> statement-breakpoint
CREATE TABLE "networks" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "selfservice_registration_flows" (
	"id" uuid PRIMARY KEY NOT NULL,
	"request_url" text NOT NULL,
	"issued_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"expires_at" timestamp NOT NULL,
	"active_method" varchar(32) NOT NULL,
	"csrf_token" varchar(255) NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"type" varchar(16) DEFAULT 'browser' NOT NULL,
	"ui" jsonb,
	"nid" uuid,
	"internal_context" jsonb NOT NULL,
	"oauth2_login_challenge" uuid,
	"oauth2_login_challenge_data" text,
	"state" varchar(255),
	"submit_count" integer DEFAULT 0 NOT NULL,
	"organization_id" uuid
);
--> statement-breakpoint
CREATE TABLE "identities" (
	"id" uuid PRIMARY KEY NOT NULL,
	"schema_id" varchar(2048) NOT NULL,
	"traits" jsonb NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"nid" uuid,
	"state" varchar(255) DEFAULT 'active' NOT NULL,
	"state_changed_at" timestamp,
	"metadata_public" jsonb,
	"metadata_admin" jsonb,
	"available_aal" varchar(4),
	"organization_id" uuid
);
--> statement-breakpoint
CREATE TABLE "identity_credential_identifiers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"identifier" varchar(255) NOT NULL,
	"identity_credential_id" uuid NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"nid" uuid,
	"identity_credential_type_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "identity_verifiable_addresses" (
	"id" uuid PRIMARY KEY NOT NULL,
	"status" varchar(16) NOT NULL,
	"via" varchar(16) NOT NULL,
	"verified" boolean NOT NULL,
	"value" varchar(400) NOT NULL,
	"verified_at" timestamp,
	"identity_id" uuid NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"nid" uuid
);
--> statement-breakpoint
CREATE TABLE "courier_messages" (
	"id" uuid PRIMARY KEY NOT NULL,
	"type" integer NOT NULL,
	"status" integer NOT NULL,
	"body" text NOT NULL,
	"subject" varchar(255) NOT NULL,
	"recipient" varchar(255) NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"template_type" varchar(255) DEFAULT '' NOT NULL,
	"template_data" "bytea",
	"nid" uuid,
	"send_count" integer DEFAULT 0 NOT NULL,
	"channel" varchar(32)
);
--> statement-breakpoint
CREATE TABLE "selfservice_errors" (
	"id" uuid PRIMARY KEY NOT NULL,
	"errors" jsonb NOT NULL,
	"seen_at" timestamp,
	"was_seen" boolean NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"csrf_token" varchar(255) DEFAULT '' NOT NULL,
	"nid" uuid
);
--> statement-breakpoint
CREATE TABLE "selfservice_verification_flows" (
	"id" uuid PRIMARY KEY NOT NULL,
	"request_url" text NOT NULL,
	"issued_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"expires_at" timestamp NOT NULL,
	"csrf_token" varchar(255) NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"type" varchar(16) DEFAULT 'browser' NOT NULL,
	"state" varchar(255) DEFAULT 'show_form' NOT NULL,
	"active_method" varchar(32),
	"ui" jsonb,
	"nid" uuid,
	"submit_count" integer DEFAULT 0 NOT NULL,
	"oauth2_login_challenge" text,
	"session_id" uuid,
	"identity_id" uuid,
	"authentication_methods" json
);
--> statement-breakpoint
CREATE TABLE "selfservice_settings_flows" (
	"id" uuid PRIMARY KEY NOT NULL,
	"request_url" text NOT NULL,
	"issued_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"expires_at" timestamp NOT NULL,
	"identity_id" uuid NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"active_method" varchar(32),
	"state" varchar(255) DEFAULT 'show_form' NOT NULL,
	"type" varchar(16) DEFAULT 'browser' NOT NULL,
	"ui" jsonb,
	"nid" uuid,
	"internal_context" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "continuity_containers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"identity_id" uuid,
	"name" varchar(255) NOT NULL,
	"payload" jsonb,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"nid" uuid
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"issued_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"expires_at" timestamp NOT NULL,
	"authenticated_at" timestamp NOT NULL,
	"identity_id" uuid NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"token" varchar(39),
	"active" boolean DEFAULT false,
	"nid" uuid,
	"logout_token" varchar(39),
	"aal" varchar(4) DEFAULT 'aal1' NOT NULL,
	"authentication_methods" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "identity_recovery_addresses" (
	"id" uuid PRIMARY KEY NOT NULL,
	"via" varchar(16) NOT NULL,
	"value" varchar(400) NOT NULL,
	"identity_id" uuid NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"nid" uuid
);
--> statement-breakpoint
CREATE TABLE "identity_verification_tokens" (
	"id" uuid PRIMARY KEY NOT NULL,
	"token" varchar(64) NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"used_at" timestamp,
	"expires_at" timestamp NOT NULL,
	"issued_at" timestamp NOT NULL,
	"identity_verifiable_address_id" uuid NOT NULL,
	"selfservice_verification_flow_id" uuid NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"nid" uuid
);
--> statement-breakpoint
CREATE TABLE "selfservice_recovery_flows" (
	"id" uuid PRIMARY KEY NOT NULL,
	"request_url" text NOT NULL,
	"issued_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"expires_at" timestamp NOT NULL,
	"active_method" varchar(32),
	"csrf_token" varchar(255) NOT NULL,
	"state" varchar(32) NOT NULL,
	"recovered_identity_id" uuid,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"type" varchar(16) DEFAULT 'browser' NOT NULL,
	"ui" jsonb,
	"nid" uuid,
	"submit_count" integer DEFAULT 0 NOT NULL,
	"skip_csrf_check" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "identity_recovery_tokens" (
	"id" uuid PRIMARY KEY NOT NULL,
	"token" varchar(64) NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"used_at" timestamp,
	"identity_recovery_address_id" uuid,
	"selfservice_recovery_flow_id" uuid,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"expires_at" timestamp DEFAULT '2000-01-01 00:00:00' NOT NULL,
	"issued_at" timestamp DEFAULT '2000-01-01 00:00:00' NOT NULL,
	"nid" uuid,
	"identity_id" uuid NOT NULL,
	"token_type" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "identity_recovery_tokens_token_type_ck" CHECK ((token_type = 1) OR (token_type = 2))
);
--> statement-breakpoint
CREATE TABLE "identity_recovery_codes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"code" varchar(64) NOT NULL,
	"used_at" timestamp,
	"identity_recovery_address_id" uuid,
	"code_type" integer NOT NULL,
	"expires_at" timestamp DEFAULT '2000-01-01 00:00:00' NOT NULL,
	"issued_at" timestamp DEFAULT '2000-01-01 00:00:00' NOT NULL,
	"selfservice_recovery_flow_id" uuid NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"nid" uuid NOT NULL,
	"identity_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_devices" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ip_address" varchar(50) DEFAULT '',
	"user_agent" varchar(512) DEFAULT '',
	"location" varchar(512) DEFAULT '',
	"nid" uuid NOT NULL,
	"session_id" uuid NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "unique_session_device" UNIQUE("ip_address","user_agent","nid","session_id")
);
--> statement-breakpoint
CREATE TABLE "identity_verification_codes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"code_hmac" varchar(64) NOT NULL,
	"used_at" timestamp,
	"identity_verifiable_address_id" uuid,
	"expires_at" timestamp DEFAULT '2000-01-01 00:00:00' NOT NULL,
	"issued_at" timestamp DEFAULT '2000-01-01 00:00:00' NOT NULL,
	"selfservice_verification_flow_id" uuid NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"nid" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courier_message_dispatches" (
	"id" uuid PRIMARY KEY NOT NULL,
	"message_id" uuid NOT NULL,
	"status" varchar(7) NOT NULL,
	"error" json,
	"nid" uuid NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_token_exchanges" (
	"id" uuid PRIMARY KEY NOT NULL,
	"nid" uuid NOT NULL,
	"flow_id" uuid NOT NULL,
	"session_id" uuid,
	"init_code" varchar(64) NOT NULL,
	"return_to_code" varchar(64) NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "identity_login_codes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"code" varchar(64) NOT NULL,
	"address" varchar(255) NOT NULL,
	"address_type" char(36) NOT NULL,
	"used_at" timestamp,
	"expires_at" timestamp DEFAULT '2000-01-01 00:00:00' NOT NULL,
	"issued_at" timestamp DEFAULT '2000-01-01 00:00:00' NOT NULL,
	"selfservice_login_flow_id" uuid NOT NULL,
	"identity_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"nid" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "identity_registration_codes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"code" varchar(64) NOT NULL,
	"address" varchar(255) NOT NULL,
	"address_type" char(36) NOT NULL,
	"used_at" timestamp,
	"expires_at" timestamp DEFAULT '2000-01-01 00:00:00' NOT NULL,
	"issued_at" timestamp DEFAULT '2000-01-01 00:00:00' NOT NULL,
	"selfservice_registration_flow_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"nid" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "identity_credentials" ADD CONSTRAINT "identity_credentials_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "public"."identities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity_credentials" ADD CONSTRAINT "identity_credentials_identity_credential_type_id_fkey" FOREIGN KEY ("identity_credential_type_id") REFERENCES "public"."identity_credential_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity_credentials" ADD CONSTRAINT "identity_credentials_nid_fk_idx" FOREIGN KEY ("nid") REFERENCES "public"."networks"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "selfservice_login_flows" ADD CONSTRAINT "selfservice_login_flows_nid_fk_idx" FOREIGN KEY ("nid") REFERENCES "public"."networks"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "selfservice_registration_flows" ADD CONSTRAINT "selfservice_registration_flows_nid_fk_idx" FOREIGN KEY ("nid") REFERENCES "public"."networks"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "identities" ADD CONSTRAINT "identities_nid_fk_idx" FOREIGN KEY ("nid") REFERENCES "public"."networks"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "identity_credential_identifiers" ADD CONSTRAINT "identity_credential_identifiers_identity_credential_id_fkey" FOREIGN KEY ("identity_credential_id") REFERENCES "public"."identity_credentials"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity_credential_identifiers" ADD CONSTRAINT "identity_credential_identifiers_nid_fk_idx" FOREIGN KEY ("nid") REFERENCES "public"."networks"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "identity_credential_identifiers" ADD CONSTRAINT "identity_credential_identifiers_type_id_fk_idx" FOREIGN KEY ("identity_credential_type_id") REFERENCES "public"."identity_credential_types"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "identity_verifiable_addresses" ADD CONSTRAINT "identity_verifiable_addresses_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "public"."identities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity_verifiable_addresses" ADD CONSTRAINT "identity_verifiable_addresses_nid_fk_idx" FOREIGN KEY ("nid") REFERENCES "public"."networks"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "courier_messages" ADD CONSTRAINT "courier_messages_nid_fk_idx" FOREIGN KEY ("nid") REFERENCES "public"."networks"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "selfservice_errors" ADD CONSTRAINT "selfservice_errors_nid_fk_idx" FOREIGN KEY ("nid") REFERENCES "public"."networks"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "selfservice_verification_flows" ADD CONSTRAINT "selfservice_verification_flows_nid_fk_idx" FOREIGN KEY ("nid") REFERENCES "public"."networks"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "selfservice_settings_flows" ADD CONSTRAINT "selfservice_profile_management_requests_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "public"."identities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "selfservice_settings_flows" ADD CONSTRAINT "selfservice_settings_flows_nid_fk_idx" FOREIGN KEY ("nid") REFERENCES "public"."networks"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "continuity_containers" ADD CONSTRAINT "continuity_containers_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "public"."identities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "continuity_containers" ADD CONSTRAINT "continuity_containers_nid_fk_idx" FOREIGN KEY ("nid") REFERENCES "public"."networks"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "public"."identities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_nid_fk_idx" FOREIGN KEY ("nid") REFERENCES "public"."networks"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "identity_recovery_addresses" ADD CONSTRAINT "identity_recovery_addresses_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "public"."identities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity_recovery_addresses" ADD CONSTRAINT "identity_recovery_addresses_nid_fk_idx" FOREIGN KEY ("nid") REFERENCES "public"."networks"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "identity_verification_tokens" ADD CONSTRAINT "identity_verification_tokens_identity_verifiable_address_i_fkey" FOREIGN KEY ("identity_verifiable_address_id") REFERENCES "public"."identity_verifiable_addresses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity_verification_tokens" ADD CONSTRAINT "identity_verification_tokens_selfservice_verification_flow_fkey" FOREIGN KEY ("selfservice_verification_flow_id") REFERENCES "public"."selfservice_verification_flows"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity_verification_tokens" ADD CONSTRAINT "identity_verification_tokens_nid_fk_idx" FOREIGN KEY ("nid") REFERENCES "public"."networks"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "selfservice_recovery_flows" ADD CONSTRAINT "selfservice_recovery_requests_recovered_identity_id_fkey" FOREIGN KEY ("recovered_identity_id") REFERENCES "public"."identities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "selfservice_recovery_flows" ADD CONSTRAINT "selfservice_recovery_flows_nid_fk_idx" FOREIGN KEY ("nid") REFERENCES "public"."networks"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "identity_recovery_tokens" ADD CONSTRAINT "identity_recovery_tokens_selfservice_recovery_request_id_fkey" FOREIGN KEY ("selfservice_recovery_flow_id") REFERENCES "public"."selfservice_recovery_flows"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity_recovery_tokens" ADD CONSTRAINT "identity_recovery_tokens_nid_fk_idx" FOREIGN KEY ("nid") REFERENCES "public"."networks"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "identity_recovery_tokens" ADD CONSTRAINT "identity_recovery_tokens_identity_recovery_address_id_fkey" FOREIGN KEY ("identity_recovery_address_id") REFERENCES "public"."identity_recovery_addresses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity_recovery_tokens" ADD CONSTRAINT "identity_recovery_tokens_identity_id_fk_idx" FOREIGN KEY ("identity_id") REFERENCES "public"."identities"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "identity_recovery_codes" ADD CONSTRAINT "identity_recovery_codes_identity_recovery_addresses_id_fk" FOREIGN KEY ("identity_recovery_address_id") REFERENCES "public"."identity_recovery_addresses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity_recovery_codes" ADD CONSTRAINT "identity_recovery_codes_selfservice_recovery_flows_id_fk" FOREIGN KEY ("selfservice_recovery_flow_id") REFERENCES "public"."selfservice_recovery_flows"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity_recovery_codes" ADD CONSTRAINT "identity_recovery_codes_identity_id_fk" FOREIGN KEY ("identity_id") REFERENCES "public"."identities"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "identity_recovery_codes" ADD CONSTRAINT "identity_recovery_codes_networks_id_fk" FOREIGN KEY ("nid") REFERENCES "public"."networks"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "session_devices" ADD CONSTRAINT "session_metadata_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_devices" ADD CONSTRAINT "session_metadata_nid_fk" FOREIGN KEY ("nid") REFERENCES "public"."networks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity_verification_codes" ADD CONSTRAINT "identity_verification_codes_identity_verifiable_addresses_id_fk" FOREIGN KEY ("identity_verifiable_address_id") REFERENCES "public"."identity_verifiable_addresses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity_verification_codes" ADD CONSTRAINT "identity_verification_codes_selfservice_verification_flows_id_f" FOREIGN KEY ("selfservice_verification_flow_id") REFERENCES "public"."selfservice_verification_flows"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity_verification_codes" ADD CONSTRAINT "identity_verification_codes_networks_id_fk" FOREIGN KEY ("nid") REFERENCES "public"."networks"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "courier_message_dispatches" ADD CONSTRAINT "courier_message_dispatches_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."courier_messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courier_message_dispatches" ADD CONSTRAINT "courier_message_dispatches_nid_fk" FOREIGN KEY ("nid") REFERENCES "public"."networks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity_login_codes" ADD CONSTRAINT "identity_login_codes_selfservice_login_flows_id_fk" FOREIGN KEY ("selfservice_login_flow_id") REFERENCES "public"."selfservice_login_flows"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity_login_codes" ADD CONSTRAINT "identity_login_codes_networks_id_fk" FOREIGN KEY ("nid") REFERENCES "public"."networks"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "identity_login_codes" ADD CONSTRAINT "identity_login_codes_identity_id_fk" FOREIGN KEY ("identity_id") REFERENCES "public"."identities"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
ALTER TABLE "identity_registration_codes" ADD CONSTRAINT "identity_registration_codes_selfservice_registration_flows_id_f" FOREIGN KEY ("selfservice_registration_flow_id") REFERENCES "public"."selfservice_registration_flows"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "identity_registration_codes" ADD CONSTRAINT "identity_registration_codes_networks_id_fk" FOREIGN KEY ("nid") REFERENCES "public"."networks"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
CREATE UNIQUE INDEX "schema_migration_version_idx" ON "schema_migration" USING btree ("version" text_ops);--> statement-breakpoint
CREATE INDEX "schema_migration_version_self_idx" ON "schema_migration" USING btree ("version_self" int4_ops);--> statement-breakpoint
CREATE INDEX "identity_credentials_id_nid_idx" ON "identity_credentials" USING btree ("id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_credentials_nid_id_idx" ON "identity_credentials" USING btree ("nid" uuid_ops,"id" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_credentials_nid_identity_id_idx" ON "identity_credentials" USING btree ("identity_id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "identity_credential_types_name_idx" ON "identity_credential_types" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX "selfservice_login_flows_id_nid_idx" ON "selfservice_login_flows" USING btree ("id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "selfservice_login_flows_nid_id_idx" ON "selfservice_login_flows" USING btree ("nid" uuid_ops,"id" uuid_ops);--> statement-breakpoint
CREATE INDEX "selfservice_registration_flows_id_nid_idx" ON "selfservice_registration_flows" USING btree ("id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "selfservice_registration_flows_nid_id_idx" ON "selfservice_registration_flows" USING btree ("nid" uuid_ops,"id" uuid_ops);--> statement-breakpoint
CREATE INDEX "identities_id_nid_idx" ON "identities" USING btree ("id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "identities_nid_id_idx" ON "identities" USING btree ("nid" uuid_ops,"id" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_credential_identifiers_id_nid_idx" ON "identity_credential_identifiers" USING btree ("id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "identity_credential_identifiers_identifier_nid_type_uq_idx" ON "identity_credential_identifiers" USING btree ("nid" uuid_ops,"identity_credential_type_id" uuid_ops,"identifier" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_credential_identifiers_nid_i_ici_idx" ON "identity_credential_identifiers" USING btree ("nid" text_ops,"identifier" text_ops,"identity_credential_id" text_ops);--> statement-breakpoint
CREATE INDEX "identity_credential_identifiers_nid_id_idx" ON "identity_credential_identifiers" USING btree ("nid" uuid_ops,"id" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_credential_identifiers_nid_identity_credential_id_idx" ON "identity_credential_identifiers" USING btree ("identity_credential_id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_verifiable_addresses_id_nid_idx" ON "identity_verifiable_addresses" USING btree ("id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_verifiable_addresses_nid_id_idx" ON "identity_verifiable_addresses" USING btree ("nid" uuid_ops,"id" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_verifiable_addresses_nid_identity_id_idx" ON "identity_verifiable_addresses" USING btree ("identity_id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_verifiable_addresses_status_via_idx" ON "identity_verifiable_addresses" USING btree ("nid" text_ops,"via" text_ops,"value" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "identity_verifiable_addresses_status_via_uq_idx" ON "identity_verifiable_addresses" USING btree ("nid" text_ops,"via" text_ops,"value" uuid_ops);--> statement-breakpoint
CREATE INDEX "courier_messages_id_nid_idx" ON "courier_messages" USING btree ("id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "courier_messages_nid_created_at_id_idx" ON "courier_messages" USING btree ("nid" timestamp_ops,"created_at" uuid_ops);--> statement-breakpoint
CREATE INDEX "courier_messages_nid_id_idx" ON "courier_messages" USING btree ("nid" uuid_ops,"id" uuid_ops);--> statement-breakpoint
CREATE INDEX "courier_messages_nid_recipient_created_at_id_idx" ON "courier_messages" USING btree ("nid" timestamp_ops,"recipient" text_ops,"created_at" uuid_ops);--> statement-breakpoint
CREATE INDEX "courier_messages_nid_status_created_at_id_idx" ON "courier_messages" USING btree ("nid" uuid_ops,"status" timestamp_ops,"created_at" uuid_ops);--> statement-breakpoint
CREATE INDEX "courier_messages_status_idx" ON "courier_messages" USING btree ("status" int4_ops);--> statement-breakpoint
CREATE INDEX "selfservice_errors_errors_nid_id_idx" ON "selfservice_errors" USING btree ("nid" uuid_ops,"id" uuid_ops);--> statement-breakpoint
CREATE INDEX "selfservice_verification_flows_id_nid_idx" ON "selfservice_verification_flows" USING btree ("id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "selfservice_verification_flows_nid_id_idx" ON "selfservice_verification_flows" USING btree ("nid" uuid_ops,"id" uuid_ops);--> statement-breakpoint
CREATE INDEX "selfservice_settings_flows_id_nid_idx" ON "selfservice_settings_flows" USING btree ("id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "selfservice_settings_flows_identity_id_nid_idx" ON "selfservice_settings_flows" USING btree ("identity_id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "selfservice_settings_flows_nid_id_idx" ON "selfservice_settings_flows" USING btree ("nid" uuid_ops,"id" uuid_ops);--> statement-breakpoint
CREATE INDEX "continuity_containers_id_nid_idx" ON "continuity_containers" USING btree ("id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "continuity_containers_identity_id_nid_idx" ON "continuity_containers" USING btree ("identity_id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "continuity_containers_nid_id_idx" ON "continuity_containers" USING btree ("nid" uuid_ops,"id" uuid_ops);--> statement-breakpoint
CREATE INDEX "sessions_id_nid_idx" ON "sessions" USING btree ("id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "sessions_identity_id_nid_sorted_idx" ON "sessions" USING btree ("identity_id" timestamp_ops,"nid" timestamp_ops,"authenticated_at" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_logout_token_uq_idx" ON "sessions" USING btree ("logout_token" text_ops);--> statement-breakpoint
CREATE INDEX "sessions_nid_created_at_id_idx" ON "sessions" USING btree ("nid" uuid_ops,"created_at" uuid_ops,"id" uuid_ops);--> statement-breakpoint
CREATE INDEX "sessions_nid_id_identity_id_idx" ON "sessions" USING btree ("nid" uuid_ops,"identity_id" uuid_ops,"id" uuid_ops);--> statement-breakpoint
CREATE INDEX "sessions_token_nid_idx" ON "sessions" USING btree ("nid" uuid_ops,"token" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_token_uq_idx" ON "sessions" USING btree ("token" text_ops);--> statement-breakpoint
CREATE INDEX "identity_recovery_addresses_id_nid_idx" ON "identity_recovery_addresses" USING btree ("id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_recovery_addresses_nid_id_idx" ON "identity_recovery_addresses" USING btree ("nid" uuid_ops,"id" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_recovery_addresses_nid_identity_id_idx" ON "identity_recovery_addresses" USING btree ("identity_id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_recovery_addresses_status_via_idx" ON "identity_recovery_addresses" USING btree ("nid" text_ops,"via" text_ops,"value" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "identity_recovery_addresses_status_via_uq_idx" ON "identity_recovery_addresses" USING btree ("nid" text_ops,"via" text_ops,"value" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_verification_tokens_id_nid_idx" ON "identity_verification_tokens" USING btree ("id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_verification_tokens_nid_id_idx" ON "identity_verification_tokens" USING btree ("nid" uuid_ops,"id" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_verification_tokens_token_nid_used_flow_id_idx" ON "identity_verification_tokens" USING btree ("nid" uuid_ops,"token" bool_ops,"used" text_ops,"selfservice_verification_flow_id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "identity_verification_tokens_token_uq_idx" ON "identity_verification_tokens" USING btree ("token" text_ops);--> statement-breakpoint
CREATE INDEX "identity_verification_tokens_verifiable_address_id_idx" ON "identity_verification_tokens" USING btree ("identity_verifiable_address_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_verification_tokens_verification_flow_id_idx" ON "identity_verification_tokens" USING btree ("selfservice_verification_flow_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "selfservice_recovery_flows_id_nid_idx" ON "selfservice_recovery_flows" USING btree ("id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "selfservice_recovery_flows_nid_id_idx" ON "selfservice_recovery_flows" USING btree ("nid" uuid_ops,"id" uuid_ops);--> statement-breakpoint
CREATE INDEX "selfservice_recovery_flows_recovered_identity_id_nid_idx" ON "selfservice_recovery_flows" USING btree ("recovered_identity_id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "identity_recovery_addresses_code_uq_idx" ON "identity_recovery_tokens" USING btree ("token" text_ops);--> statement-breakpoint
CREATE INDEX "identity_recovery_tokens_id_nid_idx" ON "identity_recovery_tokens" USING btree ("id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_recovery_tokens_identity_id_nid_idx" ON "identity_recovery_tokens" USING btree ("identity_id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_recovery_tokens_identity_recovery_address_id_idx" ON "identity_recovery_tokens" USING btree ("identity_recovery_address_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_recovery_tokens_nid_id_idx" ON "identity_recovery_tokens" USING btree ("nid" uuid_ops,"id" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_recovery_tokens_selfservice_recovery_flow_id_idx" ON "identity_recovery_tokens" USING btree ("selfservice_recovery_flow_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_recovery_tokens_token_nid_used_idx" ON "identity_recovery_tokens" USING btree ("nid" bool_ops,"token" text_ops,"used" bool_ops);--> statement-breakpoint
CREATE INDEX "identity_recovery_codes_flow_id_idx" ON "identity_recovery_codes" USING btree ("selfservice_recovery_flow_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_recovery_codes_id_nid_idx" ON "identity_recovery_codes" USING btree ("id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_recovery_codes_identity_id_nid_idx" ON "identity_recovery_codes" USING btree ("identity_id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_recovery_codes_identity_recovery_address_id_nid_idx" ON "identity_recovery_codes" USING btree ("identity_recovery_address_id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_recovery_codes_nid_flow_id_idx" ON "identity_recovery_codes" USING btree ("nid" uuid_ops,"selfservice_recovery_flow_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "session_devices_id_nid_idx" ON "session_devices" USING btree ("id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "session_devices_session_id_nid_idx" ON "session_devices" USING btree ("session_id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_verification_codes_flow_id_idx" ON "identity_verification_codes" USING btree ("selfservice_verification_flow_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_verification_codes_id_nid_idx" ON "identity_verification_codes" USING btree ("id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_verification_codes_nid_flow_id_idx" ON "identity_verification_codes" USING btree ("nid" uuid_ops,"selfservice_verification_flow_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_verification_codes_verifiable_address_nid_idx" ON "identity_verification_codes" USING btree ("identity_verifiable_address_id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "courier_message_dispatches_message_id_idx" ON "courier_message_dispatches" USING btree ("message_id" timestamp_ops,"created_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX "courier_message_dispatches_nid_idx" ON "courier_message_dispatches" USING btree ("nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "session_token_exchanges_nid_code_idx" ON "session_token_exchanges" USING btree ("init_code" uuid_ops,"nid" text_ops);--> statement-breakpoint
CREATE INDEX "session_token_exchanges_nid_flow_id_idx" ON "session_token_exchanges" USING btree ("flow_id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_login_codes_flow_id_idx" ON "identity_login_codes" USING btree ("selfservice_login_flow_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_login_codes_id_nid_idx" ON "identity_login_codes" USING btree ("id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_login_codes_identity_id_idx" ON "identity_login_codes" USING btree ("identity_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_login_codes_nid_flow_id_idx" ON "identity_login_codes" USING btree ("nid" uuid_ops,"selfservice_login_flow_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_registration_codes_flow_id_idx" ON "identity_registration_codes" USING btree ("selfservice_registration_flow_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_registration_codes_id_nid_idx" ON "identity_registration_codes" USING btree ("id" uuid_ops,"nid" uuid_ops);--> statement-breakpoint
CREATE INDEX "identity_registration_codes_nid_flow_id_idx" ON "identity_registration_codes" USING btree ("nid" uuid_ops,"selfservice_registration_flow_id" uuid_ops);
*/