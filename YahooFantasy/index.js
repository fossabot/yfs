/**
 * index.js
 * Robert Hameetman
 * 10/19/17
 *
 * My component module
 *
 * @module my/module
 * @see module:my/othermodule
 */

'use strict';
import rp from 'request-promise';

// import TeamsCollection from './collections/TeamsCollection'

class YahooFantasy {
    constructor(consumerKey, consumerSecret) {
        this.GET = 'GET';
        this.POST = 'POST';

        this.consumerKey = consumerKey;
        this.consumerSecret = consumerSecret;

        // this.teams = new TeamsCollection(this);
    }

    setUserToken(token) {
        this.yahooUserToken = token;
    }

    api(method, url, postData, callback) {
        if (arguments.length == 3) {
            callback = postData;
            postData = null;
        }

        let cb = this.apiCallback.bind(this, method, url, postData, callback);
        const options = {
            url: url,
            method: method,
            json: true,
            auth: {
                'bearer': this.yahooUserToken
            }
        };

        rp(options, cb);
    }

    apiCallback(method, url, postData, callback, error, response, data) {
        if (error) {
            return callback(error);
        } else {
            if (data.error) {
                return callback(data.error);
            }

            return callback(null, data);
        }
    }
}

export default YahooFantasy;
