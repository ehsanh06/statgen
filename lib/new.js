'use strict';

var config = require('./config');

function hello() {
    console.log(config);
}
hello();

function project() {
    console.log('A project is created');
}

module.exports = project;