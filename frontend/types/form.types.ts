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

export type TAuthErrorResponse = {
  message: string;
  statusCode: number;
  errors: { fieldName: keyof TSignupCredentials; message: string }[];
};
