export interface AuthErrors {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const EMPTY_AUTH_ERRORS = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
