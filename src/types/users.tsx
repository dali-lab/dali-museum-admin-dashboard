export enum UserScopes {
  Unverified = "UNVERIFIED",
  Admin = "ADMIN",
}

export interface IUser {
  id: string;
  email: string;
  // no password
  name: string;
  role: UserScopes;
}
