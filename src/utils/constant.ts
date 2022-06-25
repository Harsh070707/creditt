export const ResponseData = <T>(
  data: T,
  message?: string | '',
): { data: T; message: string } => {
  return {
    data,
    message: message || 'success',
  };
};

export interface jwtToken {
  id: number;
  email: string;
}

export type SuccessResponse = Record<string, unknown> | Array<unknown>;
export interface ResponseGlobalInterface<T> {
  data: T;
  message: string;
}

export type GlobalResponseType = Promise<
  ResponseGlobalInterface<SuccessResponse>
>;

export const DtoErrorMessage = {
  name: 'Name should not be greater than 50 character',
  empty_name: 'Name should not be empty',
  empty_email: 'Email Address should not be empty',
  empty_password: 'Password should not be empty',
  empty_confirm_password: 'Confirm Password should not be empty',
  password:
    'Password should contain a capital & small letter, number and a special character',
  charac_validation: 'Password should contain atleast 8 Character',
  confirm_charac_validation:
    'Confirm Password should contain atleast 8 Character',
  confirm_password:
    'Confirm Password should contain a capital & small letter, number and a special character',
  invalid_email: 'Please provide valid email address',
  invalid_password: 'Password and Confirm Password does not match',
};

export const Validation_Message = {
  email_registered: 'The email is already registered with the Organization',
};
