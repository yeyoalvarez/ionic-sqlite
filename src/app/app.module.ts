import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { IonicSelectableModule } from 'ionic-selectable';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Screenshot } from '@ionic-native/screenshot/ngx';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';

import { File } from '@awesome-cordova-plugins/file/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,IonicSelectableModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SQLite,AndroidPermissions,Ng2SearchPipeModule,FileOpener,File,
    PDFGenerator, Screenshot
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
