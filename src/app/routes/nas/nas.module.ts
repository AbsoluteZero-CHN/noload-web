import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { NasRoutingModule } from './nas.routing.module';
import { NasOfflineDownloaderComponent } from './downloader/offline-downloader.component';
import { NasDownloaderService } from './service/downloader.service';

const COMPONENTS = [
  NasOfflineDownloaderComponent,
];

const COMPONENTS_NOROUNT = [

];

@NgModule({
  imports: [
    SharedModule,
    NasRoutingModule,
  ],
  declarations: [
    NasOfflineDownloaderComponent,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT,
  providers: [
    NasDownloaderService
  ]
})
export class NasModule {}
