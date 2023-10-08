export enum ErrorCode {
  AuthNotExist = 1000,
  AuthExpired,
}

export abstract class AppError {
  abstract name: string;
  abstract code: ErrorCode;
  abstract message: string;
  reason?: any;
}

export class AuthNotExistError implements AppError {
  name = "AuthNotExist";
  code = ErrorCode.AuthNotExist;
  message = "未登录";
}
