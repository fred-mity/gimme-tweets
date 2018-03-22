import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';

import { BaseUrlService } from './base-url.service';

// Settings
import { CONFIG } from '../app-config';

// RxJS
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {

  /**
   * Base url depending with prod/dev
   */
  private baseUrl: string;

  /**
   * Storage key
   */
  private STORAGE_KEY = 'bearer-token';

  /**
   * Constructor: Inject services here
   *
   * @param  {Http} http
   * @param  {Storage} storage
   * @param  {BaseUrlService} baseUrlService
   */
  constructor(private http: Http, private storage: Storage, private baseUrlService: BaseUrlService) {
    this.baseUrl = this.baseUrlService.getBaseUrl();
  }

  /**
   * Check if the token is already stored in storage,
   * Else send authorization request to twitter
   *
   * @returns Promise
   */
  public getBearerToken(): Promise<any> {
    return this.storage.get(this.STORAGE_KEY)
      .then((tokenObject) => {
        if (tokenObject) { // If token is in storage get it and resolve promise
          return Promise.resolve(tokenObject);
        } else { // else send authorization request
          return Promise.reject('Token is null');
        }
      })
      .catch(this.sendAuthorizationRequest.bind(this));
  }

  /**
   * Clean the storage if Bearer is corrupted
   *
   * @returns void
   */
  public cleanStorage(): void {
    this.storage.remove(this.STORAGE_KEY);
  }

  /**
   * Get the key:secret from config file
   * And encode the concatened string to base 64
   *
   * @returns string
   */
  private encodeBearerTokenCredentialsToBase64(): string {
    const bearerTokenCredentials = `${CONFIG.CONSUMER_KEY}:${CONFIG.CONSUMER_SECRET}`;
    const bearerTokenCredentialsEncoded = btoa(bearerTokenCredentials);
    return `Basic ${bearerTokenCredentialsEncoded}`;
  }

  /**
   * Create the request to twitter API
   * OAuth2 authentication
   *
   * @returns Promise
   */
  private sendAuthorizationRequest(): Promise<any> {
    // Headers
    const headers = new Headers();
    headers.append('Authorization', this.encodeBearerTokenCredentialsToBase64());
    headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    const options = new RequestOptions({
      headers: headers
    });

    // Build url
    const url = `${this.baseUrl}/oauth2/token`;
    const body = 'grant_type=client_credentials';

    // Request
    return this.http.post(url, body, options)
      .toPromise()
      .then(response => {
        const bearerToken = response.json();
        this.storage.set(this.STORAGE_KEY, bearerToken); // store in storage
        return bearerToken;
      })
      .catch(error => console.log('Error when requesting bearer token'));
  }

  /**
   * TODELETE: For test purpose
   */
  public revokeToken(): Promise<any> {
    return this.storage.get(this.STORAGE_KEY)
      .then((tokenObject) => {
        // Headers
        const headers = new Headers();
        headers.append('Authorization', this.encodeBearerTokenCredentialsToBase64());
        headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
        const options = new RequestOptions({
          headers: headers
        });

        // Build url
        const url = `${this.baseUrl}/oauth2/invalidate_token`;
        const body = `access_token=${tokenObject.access_token}`;

        // Request
        return this.http.post(url, body, options)
          .toPromise()
          .then(response => {
            const bearerToken = response.json();
            this.storage.set(this.STORAGE_KEY, bearerToken); // store in localstorage
            return bearerToken;
          })
          .catch(error => console.log('Error when requesting bearer token'));
      });
  }
}
