export interface UserRequest {
  email?: string;
  password?: string;
}

export interface UserRequestErrors extends UserRequest {
  [key: string]: string | undefined;
}
