export enum UserScopes {
  Unverified = "UNVERIFIED",
  Admin = "ADMIN",
  Researcher = "RESEARCHER",
}

export interface IUser {
  id: string;
  email: string;
  // no password
  name: string;
  role: UserScopes;
}
