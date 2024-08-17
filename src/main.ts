import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {registerLicense} from '@syncfusion/ej2-base';

registerLicense("Ngo9BigBOggjHTQxAR8/V1NCaF1cWWhBYVJxWmFZfVpgcF9DY1ZVQWYuP1ZhSXxXdk1iWX9adXdRQ2hZU0M=");
import 'zone.js';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
