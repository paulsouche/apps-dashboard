import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { mode } from './env';
import './main.scss';

if (mode === 'production') {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
