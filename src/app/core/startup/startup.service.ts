import { Injectable, Injector, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { _HttpClient, MenuService, SettingsService, TitleService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ACLService } from '@delon/acl';
import { environment } from '@env/environment.hmr';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { ApplicationModel } from '@core/startup/application.model';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
  constructor(
    private menuService: MenuService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    @Inject(DA_SERVICE_TOKEN)
    private tokenService: ITokenService,
    private httpClient: _HttpClient,
    private injector: Injector,
    private cookieService: CookieService,
  ) {
  }

  private viaHttp(resolve: any, reject: any) {
    this.httpClient.get(`./profile/app`)
      .subscribe((app: ApplicationModel) => {
          this.settingService.setApp(app);
          // 用户信息：包括姓名、头像、邮箱地址
          this.settingService.setUser({});
          // ACL：设置权限为全量
          this.aclService.setFull(true);
          // 初始化菜单
          this.menuService.add([]);
          // 设置页面标题的后缀
          this.titleService.suffix = app.name;
          resolve({});
        },
        (error) => {
          console.error(error);
          resolve({});
        }, () => {
          resolve({});
        });
  }

  private viaMock(resolve: any, reject: any) {
    // const tokenData = this.tokenService.get();
    // if (!tokenData.token) {
    //   this.injector.get(Router).navigateByUrl('/passport/login');
    //   resolve({});
    //   return;
    // }
    // mock
    const app: any = {
      name: `ng-alain`,
      description: `Ng-zorro admin panel front-end framework`
    };
    const user: any = {
      name: 'Admin',
      avatar: './assets/tmp/img/avatar.jpg',
      email: 'cipchk@qq.com',
      token: '123456789'
    };
    // 应用信息：包括站点名、描述、年份
    this.settingService.setApp(app);
    // 用户信息：包括姓名、头像、邮箱地址
    this.settingService.setUser(user);
    // ACL：设置权限为全量
    this.aclService.setFull(true);
    // 初始化菜单
    this.menuService.add([
      {
        text: '主导航',
        group: true,
        children: [
          {
            text: '仪表盘',
            link: '/dashboard',
            icon: 'anticon anticon-appstore-o'
          },
          {
            text: '快捷菜单',
            icon: 'anticon anticon-rocket',
            shortcut_root: true
          }
        ]
      }
    ]);
    // 设置页面标题的后缀
    this.titleService.suffix = app.name;

    resolve({});
  }

  load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    this.httpClient.get(`${environment.SERVER_URL}uaa/api/authenticate`)
      .subscribe((response: HttpResponse<string>) => {
          this.tokenService.set({
            token: this.cookieService.get('access_token'),
          });
        }, () => {
        },
        () => {
          this.cookieService.set('XSRF-TOKEN', '');
        });
    return new Promise((resolve, reject) => {
      // http
      this.viaHttp(resolve, reject);
      // mock：请勿在生产环境中这么使用，viaMock 单纯只是为了模拟一些数据使脚手架一开始能正常运行
      // this.viaMock(resolve, reject);
    });
  }
}
