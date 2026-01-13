
/* eslint-disable @typescript-eslint/no-explicit-any */
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { preloaderFinished } from './app/core/utils/preload-finish';

preloaderFinished();

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(() => {

  })
  // eslint-disable-next-line no-console
  .catch((err) => console.error(err.message));
  