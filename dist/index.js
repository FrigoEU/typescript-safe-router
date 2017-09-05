"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var date_1 = require("./utilities/date");
var num_1 = require("./utilities/num");
function isNullable(t) {
    if (t === "string | null" || t === "number | null" || t === "date | null" || t === "boolean | null") {
        return true;
    }
    else {
        return false;
    }
}
/** Internal function for serializing URL parts based on Route definitions */
function serializeRouteParam(t, val) {
    // Stupid casts... But typescript analysis can't figure out SerializableTypeNameToType[P] correctly inside the if statement
    if (t === "string" || t === "string | null") {
        return val;
    }
    else if (t === "number" || t === "number | null") {
        return val.toString();
    }
    else if (t === "date" || t === "date | null") {
        return date_1.toYyyymmdd(val);
    }
    else if (t === "boolean" || t === "boolean | null") {
        return (val ? "true" : "false");
    }
    else {
        throw new Error("There is a case statement missing in serializeRouteParam for type " + t);
    }
}
/** Internal function for deserializing URL parts based on Route definitions */
function deserializeRouteParam(t, val) {
    // Nulls should NEVER come into this function
    if (t === "string" || t === "string | null") {
        return val;
    }
    else if (t === "number" || t === "number | null") {
        return num_1.safeParseNum(val);
    }
    else if (t === "date" || t === "date | null") {
        return date_1.fromYyyymmdd(val);
    }
    else if (t === "boolean" || t === "boolean | null") {
        return val === "true" ? true : (val === "false" ? false : null);
    }
    else {
        throw new Error("There is a case statement missing in deserializeRouteParam for type " + t);
    }
}
/** Make a Route from a name and a specification of its properties */
function makeRoute(routeName, routeParams) {
    return {
        matchUrl: function (hash) {
            var startStr = "#/" + routeName;
            if (!startsWith(hash, startStr)) {
                return null;
            }
            var params = {};
            Object.keys(routeParams).forEach(function (key) {
                var val = routeParams[key];
                var found = findInHash(hash, key);
                if (found === null) {
                    if (isNullable(val)) {
                        params[key] = null;
                        return;
                    }
                    else {
                        throw new Error("Parsing route " + routeName + ": Couldn't find route param " + key);
                    }
                }
                else {
                    var deser = deserializeRouteParam(val, decodeURIComponent(found));
                    if (deser === null) {
                        throw new Error("Parsing route " + routeName + ": Couldn't deserialize route param " + key + " from value: " + found);
                    }
                    else {
                        params[key] = deser;
                    }
                }
            });
            return params; // Can this cast be avoided?
        },
        buildUrl: function (params) {
            return "#/" + routeName + Object.keys(params).reduce(function (acc, key) {
                var val = params[key];
                // Nullable types -> Don't add the key nor the value to the URL
                if (val === null) {
                    return acc;
                }
                else {
                    return acc
                        + "/" + key.toLowerCase()
                        + "/" + encodeURIComponent(serializeRouteParam(routeParams[key], val));
                }
            }, "");
        }
    };
}
exports.makeRoute = makeRoute;
/* TODO newRouter vs mkNextRouter contains some duplication.
 *      + newrouter vs registerRoute is a bit of a stupid API
 *   Can this be done better while keeping the T in Router<T> typesafe?
 */
function makeRouter(matcher, handler) {
    return {
        match: function (hash) {
            var matchedParams = matcher.matchUrl(hash);
            return matchedParams === null ? null : handler(matchedParams);
        },
        registerRoute: function (matcher, handler) {
            return mkNextRouter(this, matcher, handler);
        }
    };
}
exports.makeRouter = makeRouter;
/* TODO Never return null from a handler!
 *   Is this an issue of using null in Route.matchUrl instead of Maybe<X>?
 */
function mkNextRouter(prevRouter, matcher, handler) {
    return {
        match: function (hash) {
            var resultOfPrevious = prevRouter.match(hash);
            if (resultOfPrevious === null) {
                var matchedParams = matcher.matchUrl(hash);
                return matchedParams === null ? null : handler(matchedParams);
            }
            else {
                return resultOfPrevious;
            }
        },
        registerRoute: function (matcher, handler) {
            return mkNextRouter(this, matcher, handler);
        }
    };
}
/* Helper function for parsing URL's */
/* TODO make more robust. Breaks eg when parameter name is substring of route name */
function findInHash(_hash, _key) {
    var hash = _hash.toLowerCase();
    var key = _key.toLowerCase();
    var startIndexOfString = hash.indexOf(key);
    if (startIndexOfString === -1) {
        return null;
    }
    var rest = hash.substring(startIndexOfString + key.length + 1); // + 1 to account for slash after key
    var strippedRest = rest.indexOf("/") > -1 ? rest.substr(0, rest.indexOf("/")) : rest;
    return strippedRest;
}
function startsWith(big, small) {
    return big.substr(0, small.length) === small;
}
