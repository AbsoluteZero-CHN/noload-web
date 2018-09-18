
export class TokenModel {
  public access_token?: string;
  public token_type?: string;
  public refresh_token?: string;
  public expires_in?: number;
  public scope?: string;
  public iat?: number;
  public jti?: string;
}
