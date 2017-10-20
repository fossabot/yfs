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
import ClientOAuth2 from 'client-oauth2';
import express from 'express';
import webdriver from 'selenium-webdriver';
import prompt from 'prompt';
import rp from 'request-promise';

// import TeamsCollection from './collections/TeamsCollection'

const by = webdriver.By;
const until = webdriver.until;

class YahooFantasy {
    constructor(consumerKey, consumerSecret, redirectUri='http://127.0.0.1/callback', state='', scopes=[]) {
        this.GET = 'GET';
        this.POST = 'POST';

        this.credentials = {
            clientId: consumerKey,
            clientSecret: consumerSecret,
            accessTokenUri: 'https://api.login.yahoo.com/oauth2/get_token',
            authorizationUri: 'https://api.login.yahoo.com/oauth2/request_auth',
            redirectUri: redirectUri,
            state: state,
            scopes: scopes
        };

        // this.teams = new TeamsCollection(this);

        this.auth = new ClientOAuth2(this.credentials);
        this.server = express();
    }

    _mountRedirectToAuthUri() {
        console.log('WDIS._mountRedirectToAuthUri()');

        this.server.get('/', (req, res) => {
            console.log('server.get(\'/\')');
            res.redirect(this.auth.code.getUri() + '&language=en-us');
            console.log(this.auth.code.getUri()  + '&language=en-us');
            console.log('res.redirect(this.auth.code.getUri())');
        })
    }

    _mountAccessTokenCallback() {
        console.log('WDIS._mountAccessTokenCallback()');

        this.server.get('/callback', async (req, res) => {
            console.log('server.get(\'/callback\')');
            console.log(req.originalUrl);

            const token = await this.auth.code.getToken(req.originalUrl);
            console.log(token);

            await token.refresh();
            console.log('token.refresh()');

            token.sign({
                method: 'get',
                url: 'http://127.0.0.1'
            });
            console.log('token.sign()');

            res.send(token.accessToken);
            console.log('res.send(token.accessToken)');
            return token.accessToken;
        });
    }

    _initHeadlessChrome() {
        try {

            const chromeCapabilities = webdriver.Capabilities.chrome();
            chromeCapabilities.set('chromeOptions', {args: ['--headless']});

            this.driver = new webdriver.Builder()
                .forBrowser('chrome')
                .withCapabilities(chromeCapabilities)
                .build();
        } catch (error) {
            console.error(error);
        }
    }

    async _login() {
        console.log('WDIS._login()');

        const username = {
            name: 'username',
            required: true,
            default: 'pork_kyd'
        };

        const code = {
            name: 'code',
            validator: /^[a-zA-Z0-9]{4}\s[a-zA-Z0-9]{4}$/,
            message: '',
            required: true
        };

        prompt.start();

        await prompt.get(username, async (error, input) => {
            if (error) console.log(error);
            console.log(input.username);
            await this.driver.findElement(by.name('username')).sendKeys(input.username);
            await this.driver.findElement(by.name('signin')).click();
            // await this.driver.manage().timeouts().pageLoadTimeout(10);
            await this.driver.executeAsyncScript(() => {
                var callback = arguments[arguments.length - 1];
                window.addEventListener('load', function onload() {
                    window.removeEventListener('load', onload);
                    callback();
                });
            }, () => { // THIS WONT WORK
                if (this.driver.findElement(by.name('code')) !== null) {
                    prompt.get(code, async (error, input) => {
                        if (error) console.log(error);
                        console.log(input.username);
                        await this.driver.findElement(by.name('username')).sendKeys(input.username);
                        await this.driver.findElement(by.name('signin')).click();
                    });
                }
            });
        });
    }

    listen(port=80) {
        this._mountRedirectToAuthUri();
        this._mountAccessTokenCallback();

        this.server.listen(port, '127.0.0.1', err => {
            if (err) console.error(err);
            console.log('Listening on 127.0.0.1');
        });
    }

    async getAccessToken() {
        try {
            this._initHeadlessChrome();
            await this.driver.get('http://127.0.0.1/');
            console.log('GET http://127.0.0.1/');

            let title = await this.driver.getTitle();
            console.log(title);

            if (title === 'Yahoo - login') {
                console.log('Oops, you need to login');
                await this._login()
            }

            this.driver.wait(until.elementLocated(by.name('agree')));

            await this.driver.findElement(by.name('agree')).click();
        } catch (error) {
            console.error(error);
        }
    }

    setAccessToken(token) {
        this.accessToken = token;
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
