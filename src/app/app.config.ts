import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import { firebaseConfig } from './core/constants/constants';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { FileManagerModule, FileManagerAllModule  } from '@syncfusion/ej2-angular-filemanager';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule } from '@angular/common/http';
import { IMAGE_CONFIG } from '@angular/common';
import { QuillModule , QuillConfigModule} from 'ngx-quill';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideToastr(),
    importProvidersFrom(
      AngularFireModule.initializeApp(firebaseConfig),
      AngularFireAuthModule,
      AngularFireDatabaseModule,
      AngularFirestoreModule,
      AngularFireStorageModule,
      BrowserAnimationsModule,
      FileManagerModule,
      FileManagerAllModule,
      HttpClientModule,
      AngularEditorModule,
      QuillModule.forRoot(),
      QuillConfigModule.forRoot({
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean'],
            ['link', 'image', 'video']
          ]
        }
      })
    ),
    provideAnimationsAsync(),
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true, // Tắt cảnh báo kích thước hình ảnh
        disableImageLazyLoadWarning: true // Tắt cảnh báo lazy loading nếu cần
      }
    }
  ]
};
