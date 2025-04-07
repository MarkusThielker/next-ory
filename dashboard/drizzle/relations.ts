import { relations } from 'drizzle-orm/relations';
import {
	continuity_containers,
	courier_message_dispatches,
	courier_messages,
	identities,
	identity_credential_identifiers,
	identity_credential_types,
	identity_credentials,
	identity_login_codes,
	identity_recovery_addresses,
	identity_recovery_codes,
	identity_recovery_tokens,
	identity_registration_codes,
	identity_verifiable_addresses,
	identity_verification_codes,
	identity_verification_tokens,
	networks,
	selfservice_errors,
	selfservice_login_flows,
	selfservice_recovery_flows,
	selfservice_registration_flows,
	selfservice_settings_flows,
	selfservice_verification_flows,
	session_devices,
	sessions,
} from './schema';

export const identityCredentialsRelations = relations(identity_credentials, ({ one, many }) => ({
	identity: one(identities, {
		fields: [identity_credentials.identity_id],
		references: [identities.id],
	}),
	identityCredentialType: one(identity_credential_types, {
		fields: [identity_credentials.identity_credential_type_id],
		references: [identity_credential_types.id],
	}),
	network: one(networks, {
		fields: [identity_credentials.nid],
		references: [networks.id],
	}),
	identityCredentialIdentifiers: many(identity_credential_identifiers),
}));

export const identitiesRelations = relations(identities, ({ one, many }) => ({
	identityCredentials: many(identity_credentials),
	network: one(networks, {
		fields: [identities.nid],
		references: [networks.id],
	}),
	identityVerifiableAddresses: many(identity_verifiable_addresses),
	selfserviceSettingsFlows: many(selfservice_settings_flows),
	continuityContainers: many(continuity_containers),
	sessions: many(sessions),
	identityRecoveryAddresses: many(identity_recovery_addresses),
	selfserviceRecoveryFlows: many(selfservice_recovery_flows),
	identityRecoveryTokens: many(identity_recovery_tokens),
	identityRecoveryCodes: many(identity_recovery_codes),
	identityLoginCodes: many(identity_login_codes),
}));

export const identityCredentialTypesRelations = relations(identity_credential_types, ({ many }) => ({
	identityCredentials: many(identity_credentials),
	identityCredentialIdentifiers: many(identity_credential_identifiers),
}));

export const networksRelations = relations(networks, ({ many }) => ({
	identityCredentials: many(identity_credentials),
	selfserviceLoginFlows: many(selfservice_login_flows),
	selfserviceRegistrationFlows: many(selfservice_registration_flows),
	identities: many(identities),
	identityCredentialIdentifiers: many(identity_credential_identifiers),
	identityVerifiableAddresses: many(identity_verifiable_addresses),
	courierMessages: many(courier_messages),
	selfserviceErrors: many(selfservice_errors),
	selfserviceVerificationFlows: many(selfservice_verification_flows),
	selfserviceSettingsFlows: many(selfservice_settings_flows),
	continuityContainers: many(continuity_containers),
	sessions: many(sessions),
	identityRecoveryAddresses: many(identity_recovery_addresses),
	identityVerificationTokens: many(identity_verification_tokens),
	selfserviceRecoveryFlows: many(selfservice_recovery_flows),
	identityRecoveryTokens: many(identity_recovery_tokens),
	identityRecoveryCodes: many(identity_recovery_codes),
	sessionDevices: many(session_devices),
	identityVerificationCodes: many(identity_verification_codes),
	courierMessageDispatches: many(courier_message_dispatches),
	identityLoginCodes: many(identity_login_codes),
	identityRegistrationCodes: many(identity_registration_codes),
}));

export const selfserviceLoginFlowsRelations = relations(selfservice_login_flows, ({ one, many }) => ({
	network: one(networks, {
		fields: [selfservice_login_flows.nid],
		references: [networks.id],
	}),
	identityLoginCodes: many(identity_login_codes),
}));

export const selfserviceRegistrationFlowsRelations = relations(selfservice_registration_flows, ({ one, many }) => ({
	network: one(networks, {
		fields: [selfservice_registration_flows.nid],
		references: [networks.id],
	}),
	identityRegistrationCodes: many(identity_registration_codes),
}));

export const identityCredentialIdentifiersRelations = relations(identity_credential_identifiers, ({ one }) => ({
	identityCredential: one(identity_credentials, {
		fields: [identity_credential_identifiers.identity_credential_id],
		references: [identity_credentials.id],
	}),
	network: one(networks, {
		fields: [identity_credential_identifiers.nid],
		references: [networks.id],
	}),
	identityCredentialType: one(identity_credential_types, {
		fields: [identity_credential_identifiers.identity_credential_type_id],
		references: [identity_credential_types.id],
	}),
}));

export const identityVerifiableAddressesRelations = relations(identity_verifiable_addresses, ({ one, many }) => ({
	identity: one(identities, {
		fields: [identity_verifiable_addresses.identity_id],
		references: [identities.id],
	}),
	network: one(networks, {
		fields: [identity_verifiable_addresses.nid],
		references: [networks.id],
	}),
	identityVerificationTokens: many(identity_verification_tokens),
	identityVerificationCodes: many(identity_verification_codes),
}));

export const courierMessagesRelations = relations(courier_messages, ({ one, many }) => ({
	network: one(networks, {
		fields: [courier_messages.nid],
		references: [networks.id],
	}),
	courierMessageDispatches: many(courier_message_dispatches),
}));

export const selfserviceErrorsRelations = relations(selfservice_errors, ({ one }) => ({
	network: one(networks, {
		fields: [selfservice_errors.nid],
		references: [networks.id],
	}),
}));

export const selfserviceVerificationFlowsRelations = relations(selfservice_verification_flows, ({ one, many }) => ({
	network: one(networks, {
		fields: [selfservice_verification_flows.nid],
		references: [networks.id],
	}),
	identityVerificationTokens: many(identity_verification_tokens),
	identityVerificationCodes: many(identity_verification_codes),
}));

export const selfserviceSettingsFlowsRelations = relations(selfservice_settings_flows, ({ one }) => ({
	identity: one(identities, {
		fields: [selfservice_settings_flows.identity_id],
		references: [identities.id],
	}),
	network: one(networks, {
		fields: [selfservice_settings_flows.nid],
		references: [networks.id],
	}),
}));

export const continuityContainersRelations = relations(continuity_containers, ({ one }) => ({
	identity: one(identities, {
		fields: [continuity_containers.identity_id],
		references: [identities.id],
	}),
	network: one(networks, {
		fields: [continuity_containers.nid],
		references: [networks.id],
	}),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
	identity: one(identities, {
		fields: [sessions.identity_id],
		references: [identities.id],
	}),
	network: one(networks, {
		fields: [sessions.nid],
		references: [networks.id],
	}),
	sessionDevices: many(session_devices),
}));

export const identityRecoveryAddressesRelations = relations(identity_recovery_addresses, ({ one, many }) => ({
	identity: one(identities, {
		fields: [identity_recovery_addresses.identity_id],
		references: [identities.id],
	}),
	network: one(networks, {
		fields: [identity_recovery_addresses.nid],
		references: [networks.id],
	}),
	identityRecoveryTokens: many(identity_recovery_tokens),
	identityRecoveryCodes: many(identity_recovery_codes),
}));

export const identityVerificationTokensRelations = relations(identity_verification_tokens, ({ one }) => ({
	identityVerifiableAddress: one(identity_verifiable_addresses, {
		fields: [identity_verification_tokens.identity_verifiable_address_id],
		references: [identity_verifiable_addresses.id],
	}),
	selfserviceVerificationFlow: one(selfservice_verification_flows, {
		fields: [identity_verification_tokens.selfservice_verification_flow_id],
		references: [selfservice_verification_flows.id],
	}),
	network: one(networks, {
		fields: [identity_verification_tokens.nid],
		references: [networks.id],
	}),
}));

export const selfserviceRecoveryFlowsRelations = relations(selfservice_recovery_flows, ({ one, many }) => ({
	identity: one(identities, {
		fields: [selfservice_recovery_flows.recovered_identity_id],
		references: [identities.id],
	}),
	network: one(networks, {
		fields: [selfservice_recovery_flows.nid],
		references: [networks.id],
	}),
	identityRecoveryTokens: many(identity_recovery_tokens),
	identityRecoveryCodes: many(identity_recovery_codes),
}));

export const identityRecoveryTokensRelations = relations(identity_recovery_tokens, ({ one }) => ({
	selfserviceRecoveryFlow: one(selfservice_recovery_flows, {
		fields: [identity_recovery_tokens.selfservice_recovery_flow_id],
		references: [selfservice_recovery_flows.id],
	}),
	network: one(networks, {
		fields: [identity_recovery_tokens.nid],
		references: [networks.id],
	}),
	identityRecoveryAddress: one(identity_recovery_addresses, {
		fields: [identity_recovery_tokens.identity_recovery_address_id],
		references: [identity_recovery_addresses.id],
	}),
	identity: one(identities, {
		fields: [identity_recovery_tokens.identity_id],
		references: [identities.id],
	}),
}));

export const identityRecoveryCodesRelations = relations(identity_recovery_codes, ({ one }) => ({
	identityRecoveryAddress: one(identity_recovery_addresses, {
		fields: [identity_recovery_codes.identity_recovery_address_id],
		references: [identity_recovery_addresses.id],
	}),
	selfserviceRecoveryFlow: one(selfservice_recovery_flows, {
		fields: [identity_recovery_codes.selfservice_recovery_flow_id],
		references: [selfservice_recovery_flows.id],
	}),
	identity: one(identities, {
		fields: [identity_recovery_codes.identity_id],
		references: [identities.id],
	}),
	network: one(networks, {
		fields: [identity_recovery_codes.nid],
		references: [networks.id],
	}),
}));

export const sessionDevicesRelations = relations(session_devices, ({ one }) => ({
	session: one(sessions, {
		fields: [session_devices.session_id],
		references: [sessions.id],
	}),
	network: one(networks, {
		fields: [session_devices.nid],
		references: [networks.id],
	}),
}));

export const identityVerificationCodesRelations = relations(identity_verification_codes, ({ one }) => ({
	identityVerifiableAddress: one(identity_verifiable_addresses, {
		fields: [identity_verification_codes.identity_verifiable_address_id],
		references: [identity_verifiable_addresses.id],
	}),
	selfserviceVerificationFlow: one(selfservice_verification_flows, {
		fields: [identity_verification_codes.selfservice_verification_flow_id],
		references: [selfservice_verification_flows.id],
	}),
	network: one(networks, {
		fields: [identity_verification_codes.nid],
		references: [networks.id],
	}),
}));

export const courierMessageDispatchesRelations = relations(courier_message_dispatches, ({ one }) => ({
	courierMessage: one(courier_messages, {
		fields: [courier_message_dispatches.message_id],
		references: [courier_messages.id],
	}),
	network: one(networks, {
		fields: [courier_message_dispatches.nid],
		references: [networks.id],
	}),
}));

export const identityLoginCodesRelations = relations(identity_login_codes, ({ one }) => ({
	selfserviceLoginFlow: one(selfservice_login_flows, {
		fields: [identity_login_codes.selfservice_login_flow_id],
		references: [selfservice_login_flows.id],
	}),
	network: one(networks, {
		fields: [identity_login_codes.nid],
		references: [networks.id],
	}),
	identity: one(identities, {
		fields: [identity_login_codes.identity_id],
		references: [identities.id],
	}),
}));

export const identityRegistrationCodesRelations = relations(identity_registration_codes, ({ one }) => ({
	selfserviceRegistrationFlow: one(selfservice_registration_flows, {
		fields: [identity_registration_codes.selfservice_registration_flow_id],
		references: [selfservice_registration_flows.id],
	}),
	network: one(networks, {
		fields: [identity_registration_codes.nid],
		references: [networks.id],
	}),
}));