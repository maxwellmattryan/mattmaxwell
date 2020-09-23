import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production || environment.staging) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .then(() => {
        if('serviceWorker' in navigator && (environment.production || environment.staging)) {
            navigator.serviceWorker.register('/ngsw-worker.js');
        }
    })
    .catch(err => console.error(err));
