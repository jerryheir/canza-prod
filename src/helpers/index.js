"use strict";
exports.__esModule = true;
exports.generateRandomHash = exports.API_VERSION = void 0;
exports.API_VERSION = "api/v1/";
var generateRandomHash = function (length) {
    var randomHash = '';
    var possible = 'ABCDE3@FGHIJ_@KLMN@_PQ5RSTU__2VWXY7Zabcde0_fghijklmnopqrst_@uvwxyz0123456_@789';
    for (var i = 0; i < length; i++) {
        randomHash += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return randomHash;
};
exports.generateRandomHash = generateRandomHash;
