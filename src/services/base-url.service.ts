import { Injectable, isDevMode } from '@angular/core';

@Injectable()
export class BaseUrlService {

  private DEV_SERVER_BASE_URL = '/api';
  private PROD_SERVER_BASE_URL = 'https://api.twitter.com/';

  /**
   * If the server is in developpment mode, we use the proxy define in ionic.config.json
   * Else we use the standard twitter url in prod mode.
   *
   * We use this trick to avoid CORS error when requesting twitter api with the developpement server
  */
  getBaseUrl(): string {
    return isDevMode() ? this.DEV_SERVER_BASE_URL : this.PROD_SERVER_BASE_URL;
  }
}
