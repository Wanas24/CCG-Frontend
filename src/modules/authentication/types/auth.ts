export type TResetPasswordParams = {
  userId: string;
  token: string;
};

// Login Types
export type TLoginPayload = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type TLoginResponse = {
  isSuccess: boolean;
  message: string;
  data: any | null;
  errorCode: string | null;
};

export type TRegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  fullAddress: string;
  extraPhone: string;
  nationalId: string;
  dateOfBirth: string;
};
