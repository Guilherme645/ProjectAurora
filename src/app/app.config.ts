import { AppRoutingModule } from './app-routing.module';
import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideAnimations} from "@angular/platform-browser/animations";
import { routes } from './app-routing.module';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {Overlay} from "@angular/cdk/overlay";
import {DIALOG_SCROLL_STRATEGY} from "@angular/cdk/dialog";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: LoadingInterceptor,
    //   multi: true
    // }

  ]
};
