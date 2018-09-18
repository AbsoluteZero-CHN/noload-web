export class PrincipalModel {
  public username?: string;
  public password?: string;
  public rememberMe?: boolean;


  constructor(
    username: string,
    password: string
  ) {
    this.rememberMe = true;
    this.username = username;
    this.password = password;
  }
}
