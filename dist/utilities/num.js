"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function safeParseInt(v) {
    var parsed = parseInt(v, 10);
    return isInteger(parsed) && !isNaN(parsed) ? parsed : null;
}
exports.safeParseInt = safeParseInt;
function safeParseNum(v) {
    var parsed = parseFloat(v);
    return isNumber(parsed) && !isNaN(parsed) ? parsed : null;
}
exports.safeParseNum = safeParseNum;
function isInteger(n) {
    return n === parseInt(n, 10);
}
function isNumber(obj) {
    return !isNaN(parseFloat(obj));
}
