import { Component, OnInit } from '@angular/core';
import { NasDownloaderService } from '../service/downloader.service';
import { SFSchema } from '@delon/form/src/src/schema';
import { DatePipe } from '@angular/common';
import { Page } from '@shared/model/page.model';
import { DownloaderTaskModel } from './downloader-task.model';
import { SimpleTableColumn } from '@delon/abc';


@Component({
  templateUrl: `./offline-downloader.component.html`,
})
export class NasOfflineDownloaderComponent implements OnInit {

  page: Page<DownloaderTaskModel> = new Page<DownloaderTaskModel>();

  searchFormSchema: SFSchema = {
    properties: {
      range: {
        type: 'string',
        title: '创建时间',
        ui: {
          widget: 'date',
          mode: 'range',
        },
      },
    },
  };

  columns: SimpleTableColumn[] = [
    { title: '下载地址', index: 'url' },
    { title: '创建时间', index: 'createTime' },
    { title: '是否定时任务', index: 'timing', format: (record: DownloaderTaskModel) => record.timing ? '是' : '否' },
    {
      title: '任务状态', index: 'state', type: 'badge', badge: {
        0: { text: '任务已完成', color: 'success' },
        1: { text: '下载中', color: 'processing' },
        2: { text: '任务暂停', color: 'warning' },
        3: { text: '任务失败', color: 'error' },
        4: { text: '任务已取消', color: 'default' },
        5: { text: '任务等待中', color: 'warning' }
      },
    },
  ];

  searchFormData: any = {
    range: (() => {
      let today = new Date();
      return [this.datePipe.transform(today, `yyyy-MM-dd`), this.datePipe.transform(today, `yyyy-MM-dd`)];
    })(),
  };

  constructor(
    private service: NasDownloaderService,
    public datePipe: DatePipe,
  ) {
  }

  ngOnInit(): void {
  }

  resetSearchForm(): void {
  }

  query() {
  }
}
