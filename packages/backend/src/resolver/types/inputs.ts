export interface NewUser {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  birthPlace?: string;
  title?: string;
  address?: string;
  nearestLandmark?: string;
  state?: string;
  marriedStatus?: string;
  occupation?: string;
  identityIDType?: string;
  identityIDNumber?: string;
  issuance?: string;
  issuancePlace?: string;
  issuanceDate?: string;
  issuanceStatus?: string;
  expiringDate?: string;
  referralCode?: string;
}

export interface NewManualUser {
  name: string;
  email: string;
  phone: string;
}

export interface LoginInput {
  email?: string;
  phone?: string;
}

export interface VerifyInput {
  token?: string;
  phone?: string;
  code?: string;
}

export interface SendReferInput {
  token?: string;
  email?: string;
}
