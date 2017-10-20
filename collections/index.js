/**
 * index.js
 * Robert Hameetman
 * 10/20/17
 *
 * My component module
 *
 * @module my/module
 * @see module:my/othermodule
 */

'use strict';
import YahooFantasy from "../yfs";

class Collection extends YahooFantasy {
    constructor(yfs) {
        super(yfs);
        this.yfs = yfs;
    }
}

export default Collection;