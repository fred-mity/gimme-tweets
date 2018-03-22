import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import * as moment from 'moment';

// Other services
import { BaseUrlService } from './base-url.service';
import { AuthenticationService } from './authentication.service';

// Settings
import { CONFIG } from '../app-config';

// RxJS
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class TwitterApiService {

  /**
   * Base url depending with prod/dev
   */
  private baseUrl: string;
  /**
   * Constructor: Inject services here
   *
   * @param  {Http} http
   * @param  {BaseUrlService} baseUrlService
   */
  constructor(
    private http: Http,
    private baseUrlService: BaseUrlService,
    private authenticationService: AuthenticationService
  ) {
    this.baseUrl = this.baseUrlService.getBaseUrl();
  }

  /**
   * Get last twitters
   *
   * @returns Promise
   */
  public getLastTweets(): Promise<any> {

    return this.authenticationService.getBearerToken()
      .then((response: any) => {

        // Headers
        const bearer = `Bearer ${response.access_token}`;
        const headers = new Headers();
        headers.append('Authorization', bearer);
        const options = new RequestOptions({
          headers: headers
        });

        // Build url
        const url = `${this.baseUrl}/1.1/statuses/user_timeline.json?count=${CONFIG.NB_OF_TWEETS}&screen_name=${CONFIG.SCREEN_NAME}`;

        // Request
        return this.http.get(url, options).toPromise();
      })
      .then(resp => this.formatTweets(resp.json()))
      .catch(this.handleError.bind(this));
  }

  /**
   * Format tweets
   *
   * @param  {} tweets
   * @returns Array
   */
  private formatTweets(tweets): Array<any> {
    return tweets.map((tweet: any) => {
      return {
        ...tweet,
        created_at: moment(tweet.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').format('MMM DD\'YY') //Format date
      };
    });
  }

  /**
   * Get a specific tweet
   *
   * @param  {string} id
   * @returns Promise
   */
  public getTweet(id: string): Promise<any> {

    return this.authenticationService.getBearerToken()
      .then((response: any) => {

        // Headers
        const bearer = `Bearer ${response.access_token}`;
        const headers = new Headers();
        headers.append('Authorization', bearer);
        const options = new RequestOptions({
          headers: headers
        });

        // Build url
        const url = `${this.baseUrl}/1.1/statuses/show.json?id=${id}&tweet_mode=extended`;

        // Request
        return this.http.get(url, options).toPromise();
      })
      .then(resp => this.formatTweet(resp.json()))
      .catch(this.handleError.bind(this));
  }

  /**
   * Format tweets
   *
   * @param  {} tweet
   * @returns any
   */
  private formatTweet(tweet): any {
    return {
      ...tweet,
      created_at: moment(tweet.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').format('MMMM Do YYYY, h:mm:ss a') //Format date
    };
  }

  /**
   * If an error happen, maybe the token is not valid
   *
   * @param  {any} reason
   */
  private handleError(reason: any): Promise<any> {
    console.log('Error: ', reason);

    if (reason._body) {
      const responseBody = JSON.parse(reason._body);
      // Check if token is invalid or expired
      if (responseBody.errors[0].code === 89) {
        this.authenticationService.cleanStorage();
        return Promise.reject({ isTokenExpired: true });
      }
    }
    return Promise.reject(reason);
  }
}
