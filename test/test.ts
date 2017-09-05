import * as Router from "./../src/index";
import * as jsc from "jsverify";
import * as assert from "assert";
import * as _ from "lodash";

describe("Router", function(){

  // PROPERTY BASED TESTS
  it("should work with string parameters, disregarding casing", function(){
    const prop = jsc.forall(jsc.string, function(str){
      const params = {astring: str.toLowerCase()};

      const route = Router.makeRoute("myroute", {astring: "string"});

      const builtUrl = route.buildUrl(params);
      const matchedParams = route.matchUrl(builtUrl);

      return _.isEqual(matchedParams, params);
    });

    jsc.assert(prop);
  });

  it("should work with string | null parameters, disregarding casing", function(){
    const prop = jsc.forall(jsc.string, function(str){
      const params = {astring: str.toLowerCase()};

      const route = Router.makeRoute("myroute", {astring: "string | null"});

      const builtUrl = route.buildUrl(params);
      const matchedParams = route.matchUrl(builtUrl);

      return _.isEqual(matchedParams, params);
    });

    jsc.assert(prop);
  });

  it("should work with number parameters", function(){
    const prop = jsc.forall(jsc.number, function(i){
      const params = {mynum: i};

      const route = Router.makeRoute("myroute", {mynum: "number"});

      const builtUrl = route.buildUrl(params);
      const matchedParams = route.matchUrl(builtUrl);

      return _.isEqual(matchedParams, params);
    });

    jsc.assert(prop);
  });

  it("should work with number | null parameters", function(){
    const prop = jsc.forall(jsc.number, function(i){
      const params = {mynum: i};

      const route = Router.makeRoute("myroute", {mynum: "number | null"});

      const builtUrl = route.buildUrl(params);
      const matchedParams = route.matchUrl(builtUrl);

      return _.isEqual(matchedParams, params);
    });

    jsc.assert(prop);
  });

  it("should work with date parameters, disregarding hour/minute/second/ms components", function(){
    const prop = jsc.forall(jsc.datetime, function(dt){
      const params = {mydate: new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())};

      const route = Router.makeRoute("myroute", {mydate: "date"});

      const builtUrl = route.buildUrl(params);
      const matchedParams = route.matchUrl(builtUrl);

      return _.isEqual(matchedParams, params);
    });

    jsc.assert(prop);
  });

  it("should work with date | null parameters, disregarding hour/minute/second/ms components", function(){
    const prop = jsc.forall(jsc.datetime, function(dt){
      const params = {mydate: new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())};

      const route = Router.makeRoute("myroute", {mydate: "date | null"});

      const builtUrl = route.buildUrl(params);
      const matchedParams = route.matchUrl(builtUrl);

      return _.isEqual(matchedParams, params);
    });

    jsc.assert(prop);
  });

  it("should work with boolean parameters", function(){
    const prop = jsc.forall(jsc.bool, function(b){
      const params = {abool: b};

      const route = Router.makeRoute("myroute", {abool: "boolean"});

      const builtUrl = route.buildUrl(params);
      const matchedParams = route.matchUrl(builtUrl);

      return _.isEqual(matchedParams, params);
    });

    jsc.assert(prop);
  });

  it("should work with boolean | null parameters", function(){
    const prop = jsc.forall(jsc.bool, function(b){
      const params = {abool: b};

      const route = Router.makeRoute("myroute", {abool: "boolean | null"});

      const builtUrl = route.buildUrl(params);
      const matchedParams = route.matchUrl(builtUrl);

      return _.isEqual(matchedParams, params);
    });

    jsc.assert(prop);
  });

  it("should work with multiple parameters", function(){
    const prop = jsc.forall(jsc.string, jsc.number, function(str, num){
      const params = {astring: str.toLowerCase(), anum: num};

      const route = Router.makeRoute("myroute", {astring: "string", anum: "number"});

      const builtUrl = route.buildUrl(params);
      const matchedParams = route.matchUrl(builtUrl);

      return _.isEqual(matchedParams, params);
    });

    jsc.assert(prop);
  });

  // UNIT TESTS
  it("should work with empty string", function(){
    const planningRoute = Router.makeRoute("planning", {astring: "string"});

    const builtUrl = planningRoute.buildUrl({astring: ""});
    const matchedParams = planningRoute.matchUrl(builtUrl);

    assert.deepStrictEqual(matchedParams, {astring: ""});
  });

  it("should work with string '/'", function(){
    const planningRoute = Router.makeRoute("planning", {astring: "string"});

    const builtUrl = planningRoute.buildUrl({astring: "/"});
    const matchedParams = planningRoute.matchUrl(builtUrl);

    assert.deepStrictEqual(matchedParams, {astring: "/"});
  });

  it("should allow matching and building routes from a route specification", function(){
    const planningRoute = Router.makeRoute("planning", {dateFrom: "date"});
    const date = new Date(2015, 5, 1, 0, 0, 0);

    const builtUrl = planningRoute.buildUrl({dateFrom: date});
    assert.deepStrictEqual(builtUrl, "#/planning/datefrom/2015-06-01");

    const matchedParams = planningRoute.matchUrl(builtUrl);
    assert.deepStrictEqual(matchedParams, {dateFrom: date});
  });

  it("should allow matching and building routes from a route specification with nullable types", function(){
    const myRoute = Router.makeRoute("myroute", {
      mystring: "string | null",
      mydate: "date | null",
      mynumber: "number | null",
      myboolean: "boolean | null"
    });

    const params1 = {
      mystring: "bla",
      mydate: new Date(2015, 5, 1, 0, 0, 0),
      mynumber: 2,
      myboolean: true
    };
    const builtUrl1 = myRoute.buildUrl(params1);
    assert.deepStrictEqual(builtUrl1, "#/myroute/mystring/bla/mydate/2015-06-01/mynumber/2/myboolean/true");

    const matchedParams1 = myRoute.matchUrl(builtUrl1);
    assert.deepStrictEqual(matchedParams1, params1);

    const params2 = {
      mystring: null,
      mydate: null,
      mynumber: null,
      myboolean: null
    };
    const builtUrl2 = myRoute.buildUrl(params2);
    assert.deepStrictEqual(builtUrl2, "#/myroute");

    const matchedParams2 = myRoute.matchUrl(builtUrl2);
    assert.deepStrictEqual(matchedParams2, params2);
  });
});
