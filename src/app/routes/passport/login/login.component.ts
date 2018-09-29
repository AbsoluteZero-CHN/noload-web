import { SettingsService } from '@delon/theme';
import { Component, OnDestroy, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import {
  SocialService,
  SocialOpenType,
  DA_SERVICE_TOKEN, ITokenService,
} from '@delon/auth';
import { ReuseTabService } from '@delon/abc';
import { environment } from '@env/environment';
import { StartupService } from '@core/startup/startup.service';
import { LoginService } from './service/login.service';
import { TokenModel } from './model/token.model';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService],
})
export class UserLoginComponent implements OnDestroy {
  form: FormGroup;
  error = '';
  type = 0;
  loading = false;

  constructor(
    fb: FormBuilder,
    private router: Router,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private settingsService: SettingsService,
    private socialService: SocialService,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN)
    private tokenService: ITokenService,
    private startupSrv: StartupService,
    private loginService: LoginService,
  ) {
    this.form = fb.group({
      userName: [null, [Validators.required, Validators.minLength(4)]],
      password: [null, Validators.required],
      mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      captcha: [null, [Validators.required]],
      remember: [true],
    });
    modalSrv.closeAll();
  }

  // region: fields

  get userName() {
    return this.form.controls.userName;
  }

  get password() {
    return this.form.controls.password;
  }

  get mobile() {
    return this.form.controls.mobile;
  }

  get captcha() {
    return this.form.controls.captcha;
  }

  // endregion

  switch(ret: any) {
    this.type = ret.index;
  }

  // region: get captcha

  count = 0;
  interval$: any;

  getCaptcha() {
    this.count = 59;
    this.interval$ = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0) clearInterval(this.interval$);
    }, 1000);
  }

  // endregion

  submit() {
    this.error = '';
    if (this.type === 0) {
      this.userName.markAsDirty();
      this.userName.updateValueAndValidity();
      this.password.markAsDirty();
      this.password.updateValueAndValidity();
      if (this.userName.invalid || this.password.invalid) return;
    } else {
      this.mobile.markAsDirty();
      this.mobile.updateValueAndValidity();
      this.captcha.markAsDirty();
      this.captcha.updateValueAndValidity();
      if (this.mobile.invalid || this.captcha.invalid) return;
    }

    this.loading = true;
    this.loginService.login({
      username: this.userName.value,
      password: this.password.value
    })
      .subscribe((token: TokenModel) => {
          this.reuseTabService.clear();
          this.tokenService.set({
            token: token.access_token
          });
          this.router.navigate(['/']);
        }, (error) => {
          this.error = `账户或密码错误`;
          this.loading = false;
        }, () => {
        this.loading = false;
      });

    // **注：** DEMO中使用 `setTimeout` 来模拟 http
    // 默认配置中对所有HTTP请求都会强制[校验](https://ng-alain.com/auth/getting-started) 用户 Token
    // 然一般来说登录请求不需要校验，因此可以在请求URL加上：`/login?_allow_anonymous=true` 表示不触发用户 Token 校验
    /*this.loading = true;
    setTimeout(() => {
      this.loading = false;
      if (this.type === 0) {
        if (
          this.userName.value !== 'admin' ||
          this.password.value !== '888888'
        ) {
          this.error = `账户或密码错误`;
          return;
        }
      }

      // 清空路由复用信息
      this.reuseTabService.clear();
      // 设置Token信息
      this.tokenService.set({
        token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJzeXN0ZW0iLCJzY29wZSI6WyJvcGVuaWQiXSwiZXhwIjoxNTM2OTk4NTgyLCJpYXQiOjE1MzY5OTgyODIsImF1dGhvcml0aWVzIjpbIlJPTEVfQURNSU4iLCJST0xFX1VTRVIiXSwianRpIjoiOWZlMTg0YmItYjZlNC00MzRlLWE4MDktNGU0NjkxNmI3MWRkIiwiY2xpZW50X2lkIjoid2ViX2FwcCJ9.DWWBKZLdSzR1A4PjvuJUT0IWcmL8yDXtiOAho_ZsAOua5XxcvUz3mQ3qims1KRdEveESEZXoTKT98jCCo6PbPW3Mg09z0o2D9CO7h7KWgSaYm0D8TTSlFbc6LaAALyhStq89jJq_uHQBNytWUcX0h5-6avzGqbvXsaaMlX1ESjHrinS7ZO_tOtUgt3WaRhmC6OK_iQ1N47g0b5oPe8Zqja4YgEdywvoLO2-YBDVmHiwy9Dfdr_q6X0effOcshebmuBK7tHmJgkewwUXcMxDCb98J0aGZhZ8bPhsca0c2kr0SVUOSgcv-DXqxGv6VLGqp3zEdZ8ZLYMw4D3H4mNMDDA',
        name: this.userName.value,
        email: `cipchk@qq.com`,
        id: 10000,
        time: +new Date(),
      });
      // 重新获取 StartupService 内容，若其包括 User 有关的信息的话
      // this.startupSrv.load().then(() => this.router.navigate(['/']));
      // 否则直接跳转
      this.router.navigate(['/']);
    }, 1000);*/
  }

  // region: social

  open(type: string, openType: SocialOpenType = 'href') {
    let url = ``;
    let callback = ``;
    if (environment.production)
      callback = 'https://cipchk.github.io/ng-alain/callback/' + type;
    else callback = 'http://localhost:4200/callback/' + type;
    switch (type) {
      case 'auth0':
        url = `//cipchk.auth0.com/login?client=8gcNydIDzGBYxzqV0Vm1CX_RXH-wsWo5&redirect_uri=${decodeURIComponent(
          callback,
        )}`;
        break;
      case 'github':
        url = `//github.com/login/oauth/authorize?client_id=9d6baae4b04a23fcafa2&response_type=code&redirect_uri=${decodeURIComponent(
          callback,
        )}`;
        break;
      case 'weibo':
        url = `https://api.weibo.com/oauth2/authorize?client_id=1239507802&response_type=code&redirect_uri=${decodeURIComponent(
          callback,
        )}`;
        break;
    }
    if (openType === 'window') {
      this.socialService
        .login(url, '/', {
          type: 'window',
        })
        .subscribe(res => {
          if (res) {
            this.settingsService.setUser(res);
            this.router.navigateByUrl('/');
          }
        });
    } else {
      this.socialService.login(url, '/', {
        type: 'href',
      });
    }
  }

  // endregion

  ngOnDestroy(): void {
    if (this.interval$) clearInterval(this.interval$);
  }
}
