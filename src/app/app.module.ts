import { NgModule, LOCALE_ID, APP_INITIALIZER, Injector, InjectionToken } from '@angular/core';
import { HttpClient, HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DelonModule } from './delon.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { RoutesModule } from './routes/routes.module';
import { LayoutModule } from './layout/layout.module';
import { StartupService } from '@core/startup/startup.service';
import { DefaultInterceptor } from '@core/net/default.interceptor';
import { SimpleInterceptor } from '@delon/auth';
import localeZh from '@angular/common/locales/zh';

// angular i18n
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeZh);

// @delon/form: JSON Schema form
import { JsonSchemaModule } from '@shared/json-schema/json-schema.module';
import { LoginService } from './routes/passport/login/service/login.service';
import { CookieService } from 'ngx-cookie-service';
import { NasModule } from './routes/nas/nas.module';
import { DelonACLModule } from '@delon/acl';

export function StartupServiceFactory(startupService: StartupService): Function {
  return () => startupService.load();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DelonModule.forRoot(),
    // 添加 ACL 权限控制
    DelonACLModule.forRoot(),
    CoreModule,
    SharedModule,
    LayoutModule,
    RoutesModule,
    NasModule,
    // JSON-Schema form
    JsonSchemaModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'zh-Hans' },
    CookieService,
    LoginService,
    { provide: HTTP_INTERCEPTORS, useClass: SimpleInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true},
    StartupService,
    {
      provide: APP_INITIALIZER,
      useFactory: StartupServiceFactory,
      deps: [StartupService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
