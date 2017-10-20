/**
 * wdis.js
 * Robert Hameetman
 * 10/18/17
 *
 * My component module
 *
 * @module my/module
 * @see module:my/othermodule
 */
'use strict';
import YahooFantasy from 'yfs';

async function main() {
    const CONSUMER_KEY = 'dj0yJmk9S0RhOWVNYmNQSjdNJmQ9WVdrOWEwZzFWMXBTTkcwbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD02OQ--';
    const CONSUMER_SECRET = '5c62ecf92391e487c86a230aa911b32ea76ae705';
    const REDIRECT_URI = 'http://127.0.0.1/callback';
    const STATE = '';
    const SCOPES = ['fspt-r'];

    const yfs = new YahooFantasy(CONSUMER_KEY, CONSUMER_SECRET, REDIRECT_URI, STATE, SCOPES);

    yfs._mountRedirectToAuthUri();
    yfs._mountAccessTokenCallback();
    yfs.listen();
    yfs.getAccessToken();

    // const yf = new YahooFantasy(wdis.credentials.clientId, wdis.credentials.clientSecret);
    //
    // yf.setUserToken();
    // console.log(yf);
}

main();

