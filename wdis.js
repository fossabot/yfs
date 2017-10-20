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
import express from 'express';
import webdriver from 'selenium-webdriver';
import chromedriver from 'chromedriver';
import { Options as ChromeOptions } from 'selenium-webdriver/chrome';
import prompt from 'prompt';

import { template } from './template';
import ClientOAuth2 from 'client-oauth2';
import rp from 'request-promise';

import YahooFantasy from './YahooFantasy';

const by = webdriver.By;
const until = webdriver.until;

class WDIS {
    constructor(Auth) {
        this.credentials = {
            clientId: 'dj0yJmk9S0RhOWVNYmNQSjdNJmQ9WVdrOWEwZzFWMXBTTkcwbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD02OQ--',
            clientSecret: '5c62ecf92391e487c86a230aa911b32ea76ae705',
            accessTokenUri: 'https://api.login.yahoo.com/oauth2/get_token',
            authorizationUri: 'https://api.login.yahoo.com/oauth2/request_auth',
            redirectUri: 'http://127.0.0.1/callback',
            state: 'success',
            scopes: ['fspt-r']
        };

        this.auth = new Auth(this.credentials);
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
}

function get_request_options(token) {
    return {
        method: 'GET',
        uri: 'https://fantasysports.yahooapis.com/fantasy/v2/team/f1.l.309887.t.6',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        json: true
    };
}


async function get_access_token(auth)  {
    console.log('get_access_token()');

    server.get('/callback', async (req, res) => {
        console.log('server.get(\'lvh.me/callback\')');

        const token = await auth.code.getToken();
        console.log(token);

        await token.refresh();
        console.log('token.refresh()');

        token.sign({
            method: 'get',
            url: 'lvh.me'
        });
        console.log('token.sign()');

        res.send(token.accessToken);
        console.log('res.send(token.accessToken)');
        return token.accessToken;
    });
    // const options = {
    //     method: 'POST',
    //     uri: auth.code.getUri(),
    //     resolveWithFullResponse: true
    // };
    // console.log(options.uri);
    // // const res = await rp(options);
    // const res = await rp('lvh.me/callback');
    // // const token = auth.code.getToken(auth.code.getUri());
    // const token = rp({
    //     method: 'POST',
    //     uri: 'https://api.login.yahoo.com/oauth2/get_token?client_id=dj0yJmk9ZXpZN0FnM3FyVlhEJmQ9WVdrOU5IbHZiMlE1TTJVbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD05ZQ--&client_secret=826dde427ca1c8f84003984f83b757fc537d1ed2&redirect_uri=oob&grant_type=authorization_code',
    //     headers: {
    //         'Authorization': 'Basic ZGoweUptazlaWHBaTjBGbk0zRnlWbGhFSm1ROVdWZHJPVTVJYkhaaU1sRTFUVEpWYldOSGJ6bE5RUzB0Sm5NOVkyOXVjM1Z0WlhKelpXTnlaWFFtZUQwNVpRLS06ODI2ZGRlNDI3Y2ExYzhmODQwMDM5ODRmODNiNzU3ZmM1MzdkMWVkMg==',
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //     }
    // });
    // console.log(token);
}

async function main() {
    const wdis = new WDIS(ClientOAuth2);

    wdis._mountRedirectToAuthUri();
    wdis._mountAccessTokenCallback();
    wdis.listen();
    wdis.getAccessToken();

    // const yf = new YahooFantasy(wdis.credentials.clientId, wdis.credentials.clientSecret);
    //
    // yf.setUserToken();
    // console.log(yf);
}

main();

