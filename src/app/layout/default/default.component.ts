import { Component, OnInit } from '@angular/core';
import {
  Router,
  NavigationEnd,
  RouteConfigLoadStart,
  NavigationError,
  NavigationCancel,
} from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { ScrollService, MenuService, SettingsService, _HttpClient } from '@delon/theme';
import { environment } from '@env/environment.hmr';
import { User } from '@shared/model/user.model';
import { ACLService } from '@delon/acl';

@Component({
  selector: 'layout-default',
  templateUrl: './default.component.html',
})
export class LayoutDefaultComponent implements OnInit{
  isFetching = false;

  constructor(
    router: Router,
    scroll: ScrollService,
    private _message: NzMessageService,
    public menuSrv: MenuService,
    public settings: SettingsService,
    private aclService: ACLService,
    private http: _HttpClient
  ) {
    // scroll to top in change page
    router.events.subscribe(evt => {
      if (!this.isFetching && evt instanceof RouteConfigLoadStart) {
        this.isFetching = true;
      }
      if (evt instanceof NavigationError || evt instanceof NavigationCancel) {
        this.isFetching = false;
        if (evt instanceof NavigationError) {
          _message.error(`无法加载${evt.url}路由`, { nzDuration: 1000 * 3 });
        }
        return;
      }
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      setTimeout(() => {
        scroll.scrollToTop();
        this.isFetching = false;
      }, 100);
    });
  }

  ngOnInit(): void {
    this.http.get(`${environment.SERVER_URL}uaa/api/account`)
      .subscribe((user: User) => {
        this.settings.setUser(user);
        this.aclService.set({
          role: user.authorities || [],
          mode: 'oneOf'
        });
      }, () => {
        this._message.error(`获取当前用户信息失败`);
      });
  }
}
