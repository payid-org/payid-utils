/**
 * Type of payment address in PaymentInformation.
 */
import { JWK } from 'jose/webcrypto/types'

// TODO:(@nhartner) pull most these types from an external PayString types library once it exists
export enum AddressDetailsType {
  CryptoAddress = 'CryptoAddressDetails',
  // Replaces AchAddressDetails
  FiatAddress = 'FiatAddressDetails',
  // Maintain compatibility for 1.0
  AchAddress = 'AchAddressDetails',
}

/**
 * Matching schema for AddressDetailsType.CryptoAddress.
 */
export interface CryptoAddressDetails {
  readonly address: string
  readonly tag?: string
}

/**
 * Matching schema for AddressDetailsType.FiatAddress.
 */
export interface FiatAddressDetails {
  readonly accountNumber: string
  readonly routingNumber?: string
}

/**
 * Payment information included in a PaymentSetupDetails or by itself (in the
 * case of a GET request to the base path /).
 */
export interface PaymentInformation {
  readonly payId: string
  readonly addresses: Address[]
  readonly verifiedAddresses: VerifiedAddress[]
  readonly memo?: string
}

/**
 * Address information included inside of a PaymentInformation object.
 */
export interface Address {
  readonly paymentNetwork: string
  readonly environment?: string
  readonly addressDetailsType: AddressDetailsType
  readonly addressDetails: CryptoAddressDetails | FiatAddressDetails
}

/**
 * Object containing address information alongside signatures.
 */
export interface VerifiedAddress {
  readonly payload: string
  readonly signatures: readonly VerifiedAddressSignature[]
}

/**
 * JWS object for verification.
 */
export interface VerifiedAddressSignature {
  protected: string
  signature: string
}

export interface UnsignedVerifiedAddress {
  readonly payId: string
  readonly payIdAddress: Address
}

export interface SigningParams {
  readonly key: JWK
  readonly alg: string
  keyType: string
}

export interface ProtectedHeaders {
  name: string
  alg: string
  typ: 'JOSE+JSON'
  b64: false
  crit: ['b64', 'name']
  jwk: JWK
}
