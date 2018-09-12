import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';
import { enableProdMode } from '@angular/core';


/*
This code to be uncommented before apk generation for deployement
*///
enableProdMode();


platformBrowserDynamic().bootstrapModule(AppModule);
