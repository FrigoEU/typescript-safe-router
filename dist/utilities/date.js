"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toYyyymmdd(d) {
    var year = d.getFullYear();
    var month = pad((d.getMonth() + 1).toString(), 2, "0");
    var day = pad(d.getDate().toString(), 2, "0");
    return year + "-" + month + "-" + day;
}
exports.toYyyymmdd = toYyyymmdd;
;
function fromYyyymmdd(s) {
    var splitted = s.split("-");
    if (splitted.length !== 3) {
        return null;
    }
    return new Date(parseInt(splitted[0], 10), parseInt(splitted[1], 10) - 1, parseInt(splitted[2], 10));
}
exports.fromYyyymmdd = fromYyyymmdd;
;
function isValidDate(d) {
    return d instanceof Date && !isNaN(d.valueOf());
}
exports.isValidDate = isValidDate;
function pad(n, width, z) {
    z = z || "0";
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
