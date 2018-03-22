import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

// Pages
import { TweetsPage } from '../pages/tweets/tweets';
import { TweetDetailPage } from '../pages/tweet-detail/tweet-detail';

// Services
import { BaseUrlService } from '../services/base-url.service';
import { AuthenticationService } from '../services/authentication.service';
import { TwitterApiService } from '../services/twitter-api.service';

@NgModule({
  declarations: [
    MyApp,
    TweetsPage,
    TweetDetailPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TweetsPage,
    TweetDetailPage
  ],
  providers: [
    BaseUrlService,
    AuthenticationService,
    TwitterApiService,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
