import { Inject, Injectable } from '@angular/core';
import { PrincipalModel } from '../model/principal.model';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment.hmr';
import { TokenModel } from '../model/token.model';
import { Observable } from 'rxjs/internal/Observable';
import { CookieService } from 'ngx-cookie-service';


@Injectable()
export class LoginService {


  constructor(
    private http: _HttpClient,
    private cookieService: CookieService
  ) {
  }

  /**
   * 登录验证
   * */
  login(
    principal: PrincipalModel
  ): Observable<any> {
    return this.http.post(`${environment.SERVER_URL}auth/login`, principal, {}, {
      headers: {
        'X-XSRF-TOKEN': this.cookieService.get('XSRF-TOKEN')
      }
    });
  }
}
