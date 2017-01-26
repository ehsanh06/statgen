'use strict';

var config = require('./config');

function project() {
    console.log(config());
}

module.exports = project;