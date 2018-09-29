import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NasOfflineDownloaderComponent } from './downloader/offline-downloader.component';


const routes: Routes = [
  {
    path: 'nas',
    canActivateChild: [],
    children: [
      {
        path: 'offline-download',
        component: NasOfflineDownloaderComponent,
        data: { title: '离线下载列表', titleI18n: 'offline download list' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NasRoutingModule {

}
