/**
 * TeamsCollection.js
 * Robert Hameetman
 * 10/19/17
 *
 * My component module
 *
 * @module my/module
 * @see module:my/othermodule
 */

'use strict';
import YahooFantasy from "../index";

class TeamsCollection extends YahooFantasy {
    constructor(yf) {
        super(yf);
        this.yf = yf;
    }

    _userFetchCallback(callback, subresources, error, data) {
        if (error) return callback(error);

        // let games = teamHelper.parseGameCollection(data.fantasy_contents.users[0].user[1].games, subresources);
        // return callback(null, games);
    }

    _fetchCallback(callback, subresources, error, data) {
        if (error) return callback(error);

        // let teams = teamHelper.parseCollection(data.fantasy_contents.teams, subresources);
        // return callback(null, teams);
    }

    _leaguesCallback(callback, subresources, error, data) {
        if (error) return callback(error);

        // let teams = teamHelper.parseLeagueCollection(data.fantasy_contents.leagues, subresources);
        // return callback(null, leagues);
    }

    _gamesCallback(callback, subresources, error, data) {
        if (error) return callback(error);

        // let games = teamHelper.parseGameCollection(data.fantasy_contents.users[0].user[1].games, subresources);
        // return callback(null, games);
    }

    fetch() {
        let teamKeys = arguments[0];
        let subresources = (arguments.length > 2) ? arguments[1] : [];
        let callback = arguments[arguments.length - 1];

        let url = 'https://fantasysports.yahooapis.com/fantasy/v2/teams;team_keys=';

        if(typeof teamKeys === 'string') {
            teamKeys = teamKeys.split(',');
        }

        url += teamKeys.join(',');

        if (typeof subresources !== 'array' && subresources.length > 0) {
            if (typeof subresources === 'string') {
                subresources = [subresources];
            }

            url += ';out=' + subresources.join(',');
        }

        url += ';format=json';

        let apiCallback = this._fetchCallback.bind(this, callback, subresources);

        this.api(this.yf.GET, url, apiCallback);
    }

    userFetch() {
        let subresources = (arguments.length > 1) ? arguments[1] : [];
        let callback = arguments[arguments.length - 1];

        let url = 'https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/teams';

        if (typeof subresources !== 'array' && subresources.length > 0) {
            if (typeof subresources === 'string') {
                subresources = [subresources];
            }

            url += ';out=' + subresources.join(',');
        }

        url += ';format=json';

        let apiCallback = this._userFetchCallback.bind(this, callback, subresources);

        this.api(this.yf.GET, url, apiCallback);
    }

    leagues() {
        let leagueKeys = arguments[0];
        let subresources = (arguments.length > 2) ? arguments[1] : [];
        let callback = arguments[arguments.length - 1];

        let url = 'https://fantasysports.yahooapis.com/fantasy/v2/leagues;league_keys=';

        if (typeof leagueKeys === 'string') {
            leagueKeys = [leagueKeys];
        }

        url += leagueKeys.join(',');
        url += '/teams';

        if (typeof subresources !== 'array' && subresources.length > 0) {
            if (typeof subresources === 'string') {
                subresources = [subresources];
            }

            url += ';out=' + subresources.join(',');
        }

        url += ';format=json';

        let apiCallback = this._leaguesCallback.bind(this, callback, subresources);

        this.api(this.yf.GET, url, apiCallback);
    }

    games() {
        let gameKeys = arguments[0];
        let subresources = (arguments.length > 2) ? arguments[1] : [];
        let callback = arguments[arguments.length - 1];

        let url = 'https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=';

        if (typeof gameKeys === 'string') {
            gameKeys = [gameKeys];
        }

        url += gameKeys.join(',');
        url += '/teams';

        if (typeof subresources !== 'array' && subresources.length > 0) {
            if (typeof subresources === 'string') {
                subresources = [subresources];
            }

            url += ';out=' + subresources.join(',');

            url += ';format=json';

            let apiCallback = this._gamesCallback.bind(this, callback, subresources);

            this.api(this.yf.GET, url, apiCallback);
        }
    }
}

export default TeamsCollection;
