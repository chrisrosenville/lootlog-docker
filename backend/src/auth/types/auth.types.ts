export type TLoginCredentials = {
  email: string;
  password: string;
};

export type TSignupCredentials = {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  repeatPassword: string;
};

export type TSignupErrorReturnObject = {
  statusCode: number;
  errors: Partial<TSignupCredentials>[];
};

export interface IUserToken {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}
