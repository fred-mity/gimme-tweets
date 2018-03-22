import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { TwitterApiService } from '../../services/twitter-api.service';

@Component({
  selector: 'page-tweet-detail',
  templateUrl: 'tweet-detail.html'
})
export class TweetDetailPage {

  /**
   * Tweet object view
   */
  private tweet = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public twitterApiService: TwitterApiService,
    private loadingCtrl: LoadingController) { }


  /**
   * Once the view is loaded
   *
   * @returns void
   */
  ionViewDidLoad(): void {
    this.getTweet();
  }

  /**
   * Get a specific tweet
   *
   * @returns void
   */
  getTweet(): void {
    // create a loading while data is loading
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    const tweetId = this.navParams.get('tweetId');
    this.twitterApiService.getTweet(tweetId)
      .then(tweet => {
        // console.log(tweet);
        this.tweet = tweet;
        loading.dismiss();
      })
      .catch(reason => loading.dismiss());
  }

}
