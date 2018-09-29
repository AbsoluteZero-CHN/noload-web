import { Injectable } from '@angular/core';
import { PrincipalModel } from '../model/principal.model';
import { environment } from '@env/environment.hmr';
import { Observable } from 'rxjs/internal/Observable';
import { CookieService } from 'ngx-cookie-service';
import { _HttpClient } from '@delon/theme/src/src/services/http/http.client';


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
    return this.http.post(`auth/login`, principal, {}, {
      headers: {
        'X-XSRF-TOKEN': this.cookieService.get('XSRF-TOKEN')
      }
    });
  }
}
