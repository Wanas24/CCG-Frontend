export type TSimpleResultErrorCode = 1 | 2 | 3;

export type TSimpleResult<T = unknown> = {
  isSuccess: boolean;
  message: string;
  errorCode?: TSimpleResultErrorCode | null;
  data?: T;
};
