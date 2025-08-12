export enum UserScopes {
  Unverified = "UNVERIFIED",
  Admin = "ADMIN",
  Researcher = "RESEARCHER",
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  role: UserScopes;
  isVerified: boolean;
  createdAt: Date;
}

export function readableScope(role: UserScopes) {
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}
