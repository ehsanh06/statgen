'use strict';

var fs = require('fs');
var mkdirp = require('mkdirp');
var argv = require('yargs').argv;

function project() {
    console.log('A project is created');
}

module.exports = project;