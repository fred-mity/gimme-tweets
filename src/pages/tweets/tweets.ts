import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';

import { TweetDetailPage } from '../tweet-detail/tweet-detail';

import { TwitterApiService } from '../../services/twitter-api.service';
import { AuthenticationService } from '../../services/authentication.service';
import { CONFIG } from '../../app-config';

@Component({
  selector: 'page-tweets',
  templateUrl: 'tweets.html'
})
export class TweetsPage implements OnInit {

  /**
   * Tweets list view
   */
  tweets = new Array<any>();

  /**
   * Application settings variable
   */
  title = CONFIG.SCREEN_NAME;
  nbTweets = CONFIG.NB_OF_TWEETS;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private twitterApiService: TwitterApiService,
    private authenticationService: AuthenticationService,
    private loadingCtrl: LoadingController) { }


  /**
   * Angular lifecycle hook, when view is loaded
   *
   * @returns void
   */
  ngOnInit(): void {
    this.getLastTweets();

    let count = 0;
    document.querySelector("#eggBtn").addEventListener('click', function () {
      count+=1;
      if (count==5) {
        this.eggMe();
        count = 0;
      }
    }.bind(this));
  }


  /**
   * Go to the detail view of a tweet
   *
   * @param  {string} tweetId
   * @returns void
   */
  showDetail(tweetId: string): void {
    this.navCtrl.push(TweetDetailPage, { tweetId: tweetId });
  }

  /**
   * Get last tweets, the number depends on CONFIG.NB_OF_TWEETS
   *
   * @returns void
   */
  getLastTweets(): void {
    // create a loading while data is loading
    const loading = this.loadingCtrl.create({ content: 'Please wait...' });
    loading.present();

    this.twitterApiService.getLastTweets()
      .then((tweets: Array<any>) => {
        this.tweets = tweets;
        // console.log(this.tweets);
        loading.dismiss();
      })
      .catch(err => {
        // If token is invalid or expired, re-ask
        if (err.isTokenExpired) {
          this.getLastTweets();
        }
        loading.dismiss();
      });
  }


  /**
   * TODELETE
   * Only for test purpose: revoke the token on the server to invalidate session
   *
   * @returns void
   */
  revokeToken(): void {
    this.authenticationService.revokeToken();
  }

  /**
   * Easter egg #godmod
   *
   * @memberof TweetsPage
   * @returns void
   */
  eggMe(): void {
    const egg = document.querySelector("#egg");
    egg.setAttribute("style", "display:block;");
    setTimeout(function() {
      egg.setAttribute("style", "display:none;");
    }, 3000);
  }
}
