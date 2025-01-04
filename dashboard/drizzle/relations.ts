import { relations } from 'drizzle-orm/relations';
import {
	continuityContainers,
	courierMessageDispatches,
	courierMessages,
	identities,
	identityCredentialIdentifiers,
	identityCredentials,
	identityCredentialTypes,
	identityLoginCodes,
	identityRecoveryAddresses,
	identityRecoveryCodes,
	identityRecoveryTokens,
	identityRegistrationCodes,
	identityVerifiableAddresses,
	identityVerificationCodes,
	identityVerificationTokens,
	networks,
	selfserviceErrors,
	selfserviceLoginFlows,
	selfserviceRecoveryFlows,
	selfserviceRegistrationFlows,
	selfserviceSettingsFlows,
	selfserviceVerificationFlows,
	sessionDevices,
	sessions,
} from './schema';

export const identityCredentialsRelations = relations(identityCredentials, ({ one, many }) => ({
	identity: one(identities, {
		fields: [identityCredentials.identityId],
		references: [identities.id],
	}),
	identityCredentialType: one(identityCredentialTypes, {
		fields: [identityCredentials.identityCredentialTypeId],
		references: [identityCredentialTypes.id],
	}),
	network: one(networks, {
		fields: [identityCredentials.nid],
		references: [networks.id],
	}),
	identityCredentialIdentifiers: many(identityCredentialIdentifiers),
}));

export const identitiesRelations = relations(identities, ({ one, many }) => ({
	identityCredentials: many(identityCredentials),
	network: one(networks, {
		fields: [identities.nid],
		references: [networks.id],
	}),
	identityVerifiableAddresses: many(identityVerifiableAddresses),
	selfserviceSettingsFlows: many(selfserviceSettingsFlows),
	continuityContainers: many(continuityContainers),
	sessions: many(sessions),
	identityRecoveryAddresses: many(identityRecoveryAddresses),
	selfserviceRecoveryFlows: many(selfserviceRecoveryFlows),
	identityRecoveryTokens: many(identityRecoveryTokens),
	identityRecoveryCodes: many(identityRecoveryCodes),
	identityLoginCodes: many(identityLoginCodes),
}));

export const identityCredentialTypesRelations = relations(identityCredentialTypes, ({ many }) => ({
	identityCredentials: many(identityCredentials),
	identityCredentialIdentifiers: many(identityCredentialIdentifiers),
}));

export const networksRelations = relations(networks, ({ many }) => ({
	identityCredentials: many(identityCredentials),
	selfserviceLoginFlows: many(selfserviceLoginFlows),
	selfserviceRegistrationFlows: many(selfserviceRegistrationFlows),
	identities: many(identities),
	identityCredentialIdentifiers: many(identityCredentialIdentifiers),
	identityVerifiableAddresses: many(identityVerifiableAddresses),
	courierMessages: many(courierMessages),
	selfserviceErrors: many(selfserviceErrors),
	selfserviceVerificationFlows: many(selfserviceVerificationFlows),
	selfserviceSettingsFlows: many(selfserviceSettingsFlows),
	continuityContainers: many(continuityContainers),
	sessions: many(sessions),
	identityRecoveryAddresses: many(identityRecoveryAddresses),
	identityVerificationTokens: many(identityVerificationTokens),
	selfserviceRecoveryFlows: many(selfserviceRecoveryFlows),
	identityRecoveryTokens: many(identityRecoveryTokens),
	identityRecoveryCodes: many(identityRecoveryCodes),
	sessionDevices: many(sessionDevices),
	identityVerificationCodes: many(identityVerificationCodes),
	courierMessageDispatches: many(courierMessageDispatches),
	identityLoginCodes: many(identityLoginCodes),
	identityRegistrationCodes: many(identityRegistrationCodes),
}));

export const selfserviceLoginFlowsRelations = relations(selfserviceLoginFlows, ({ one, many }) => ({
	network: one(networks, {
		fields: [selfserviceLoginFlows.nid],
		references: [networks.id],
	}),
	identityLoginCodes: many(identityLoginCodes),
}));

export const selfserviceRegistrationFlowsRelations = relations(selfserviceRegistrationFlows, ({ one, many }) => ({
	network: one(networks, {
		fields: [selfserviceRegistrationFlows.nid],
		references: [networks.id],
	}),
	identityRegistrationCodes: many(identityRegistrationCodes),
}));

export const identityCredentialIdentifiersRelations = relations(identityCredentialIdentifiers, ({ one }) => ({
	identityCredential: one(identityCredentials, {
		fields: [identityCredentialIdentifiers.identityCredentialId],
		references: [identityCredentials.id],
	}),
	network: one(networks, {
		fields: [identityCredentialIdentifiers.nid],
		references: [networks.id],
	}),
	identityCredentialType: one(identityCredentialTypes, {
		fields: [identityCredentialIdentifiers.identityCredentialTypeId],
		references: [identityCredentialTypes.id],
	}),
}));

export const identityVerifiableAddressesRelations = relations(identityVerifiableAddresses, ({ one, many }) => ({
	identity: one(identities, {
		fields: [identityVerifiableAddresses.identityId],
		references: [identities.id],
	}),
	network: one(networks, {
		fields: [identityVerifiableAddresses.nid],
		references: [networks.id],
	}),
	identityVerificationTokens: many(identityVerificationTokens),
	identityVerificationCodes: many(identityVerificationCodes),
}));

export const courierMessagesRelations = relations(courierMessages, ({ one, many }) => ({
	network: one(networks, {
		fields: [courierMessages.nid],
		references: [networks.id],
	}),
	courierMessageDispatches: many(courierMessageDispatches),
}));

export const selfserviceErrorsRelations = relations(selfserviceErrors, ({ one }) => ({
	network: one(networks, {
		fields: [selfserviceErrors.nid],
		references: [networks.id],
	}),
}));

export const selfserviceVerificationFlowsRelations = relations(selfserviceVerificationFlows, ({ one, many }) => ({
	network: one(networks, {
		fields: [selfserviceVerificationFlows.nid],
		references: [networks.id],
	}),
	identityVerificationTokens: many(identityVerificationTokens),
	identityVerificationCodes: many(identityVerificationCodes),
}));

export const selfserviceSettingsFlowsRelations = relations(selfserviceSettingsFlows, ({ one }) => ({
	identity: one(identities, {
		fields: [selfserviceSettingsFlows.identityId],
		references: [identities.id],
	}),
	network: one(networks, {
		fields: [selfserviceSettingsFlows.nid],
		references: [networks.id],
	}),
}));

export const continuityContainersRelations = relations(continuityContainers, ({ one }) => ({
	identity: one(identities, {
		fields: [continuityContainers.identityId],
		references: [identities.id],
	}),
	network: one(networks, {
		fields: [continuityContainers.nid],
		references: [networks.id],
	}),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
	identity: one(identities, {
		fields: [sessions.identityId],
		references: [identities.id],
	}),
	network: one(networks, {
		fields: [sessions.nid],
		references: [networks.id],
	}),
	sessionDevices: many(sessionDevices),
}));

export const identityRecoveryAddressesRelations = relations(identityRecoveryAddresses, ({ one, many }) => ({
	identity: one(identities, {
		fields: [identityRecoveryAddresses.identityId],
		references: [identities.id],
	}),
	network: one(networks, {
		fields: [identityRecoveryAddresses.nid],
		references: [networks.id],
	}),
	identityRecoveryTokens: many(identityRecoveryTokens),
	identityRecoveryCodes: many(identityRecoveryCodes),
}));

export const identityVerificationTokensRelations = relations(identityVerificationTokens, ({ one }) => ({
	identityVerifiableAddress: one(identityVerifiableAddresses, {
		fields: [identityVerificationTokens.identityVerifiableAddressId],
		references: [identityVerifiableAddresses.id],
	}),
	selfserviceVerificationFlow: one(selfserviceVerificationFlows, {
		fields: [identityVerificationTokens.selfserviceVerificationFlowId],
		references: [selfserviceVerificationFlows.id],
	}),
	network: one(networks, {
		fields: [identityVerificationTokens.nid],
		references: [networks.id],
	}),
}));

export const selfserviceRecoveryFlowsRelations = relations(selfserviceRecoveryFlows, ({ one, many }) => ({
	identity: one(identities, {
		fields: [selfserviceRecoveryFlows.recoveredIdentityId],
		references: [identities.id],
	}),
	network: one(networks, {
		fields: [selfserviceRecoveryFlows.nid],
		references: [networks.id],
	}),
	identityRecoveryTokens: many(identityRecoveryTokens),
	identityRecoveryCodes: many(identityRecoveryCodes),
}));

export const identityRecoveryTokensRelations = relations(identityRecoveryTokens, ({ one }) => ({
	selfserviceRecoveryFlow: one(selfserviceRecoveryFlows, {
		fields: [identityRecoveryTokens.selfserviceRecoveryFlowId],
		references: [selfserviceRecoveryFlows.id],
	}),
	network: one(networks, {
		fields: [identityRecoveryTokens.nid],
		references: [networks.id],
	}),
	identityRecoveryAddress: one(identityRecoveryAddresses, {
		fields: [identityRecoveryTokens.identityRecoveryAddressId],
		references: [identityRecoveryAddresses.id],
	}),
	identity: one(identities, {
		fields: [identityRecoveryTokens.identityId],
		references: [identities.id],
	}),
}));

export const identityRecoveryCodesRelations = relations(identityRecoveryCodes, ({ one }) => ({
	identityRecoveryAddress: one(identityRecoveryAddresses, {
		fields: [identityRecoveryCodes.identityRecoveryAddressId],
		references: [identityRecoveryAddresses.id],
	}),
	selfserviceRecoveryFlow: one(selfserviceRecoveryFlows, {
		fields: [identityRecoveryCodes.selfserviceRecoveryFlowId],
		references: [selfserviceRecoveryFlows.id],
	}),
	identity: one(identities, {
		fields: [identityRecoveryCodes.identityId],
		references: [identities.id],
	}),
	network: one(networks, {
		fields: [identityRecoveryCodes.nid],
		references: [networks.id],
	}),
}));

export const sessionDevicesRelations = relations(sessionDevices, ({ one }) => ({
	session: one(sessions, {
		fields: [sessionDevices.sessionId],
		references: [sessions.id],
	}),
	network: one(networks, {
		fields: [sessionDevices.nid],
		references: [networks.id],
	}),
}));

export const identityVerificationCodesRelations = relations(identityVerificationCodes, ({ one }) => ({
	identityVerifiableAddress: one(identityVerifiableAddresses, {
		fields: [identityVerificationCodes.identityVerifiableAddressId],
		references: [identityVerifiableAddresses.id],
	}),
	selfserviceVerificationFlow: one(selfserviceVerificationFlows, {
		fields: [identityVerificationCodes.selfserviceVerificationFlowId],
		references: [selfserviceVerificationFlows.id],
	}),
	network: one(networks, {
		fields: [identityVerificationCodes.nid],
		references: [networks.id],
	}),
}));

export const courierMessageDispatchesRelations = relations(courierMessageDispatches, ({ one }) => ({
	courierMessage: one(courierMessages, {
		fields: [courierMessageDispatches.messageId],
		references: [courierMessages.id],
	}),
	network: one(networks, {
		fields: [courierMessageDispatches.nid],
		references: [networks.id],
	}),
}));

export const identityLoginCodesRelations = relations(identityLoginCodes, ({ one }) => ({
	selfserviceLoginFlow: one(selfserviceLoginFlows, {
		fields: [identityLoginCodes.selfserviceLoginFlowId],
		references: [selfserviceLoginFlows.id],
	}),
	network: one(networks, {
		fields: [identityLoginCodes.nid],
		references: [networks.id],
	}),
	identity: one(identities, {
		fields: [identityLoginCodes.identityId],
		references: [identities.id],
	}),
}));

export const identityRegistrationCodesRelations = relations(identityRegistrationCodes, ({ one }) => ({
	selfserviceRegistrationFlow: one(selfserviceRegistrationFlows, {
		fields: [identityRegistrationCodes.selfserviceRegistrationFlowId],
		references: [selfserviceRegistrationFlows.id],
	}),
	network: one(networks, {
		fields: [identityRegistrationCodes.nid],
		references: [networks.id],
	}),
}));