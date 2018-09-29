import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { SettingsService } from '@delon/theme';
import { User } from '@shared/model/user.model';

@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {

  avatar: string;
  avatarText: string;

  constructor(
    public settings: SettingsService,
    public msgSrv: NzMessageService) {
  }

  ngOnInit(): void {
    const user: User = this.settings.user;
    if(user.imageUrl) {
      this.avatar = user.imageUrl;
    } else {
      this.avatarText = user.name.substr(0, 1);
    }
  }
}
