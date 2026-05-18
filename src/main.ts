import { bootstrapApplication } from '@angular/platform-browser';
import { defineCustomElements as defineJeepSqliteCustomElements } from 'jeep-sqlite/loader';
import { appConfig } from './app/app.config';
import { App } from './app/app';

defineJeepSqliteCustomElements(window);

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
