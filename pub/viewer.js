(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; indent-tabs-mode: nil; tab-width: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */
/*
 * Copyright 2013 Art Compiler LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
  ASSERTS AND MESSAGES

  We use the 'assert()' function to trap invalid states of all kinds. External
  messages are distinguished from internal messages by a numeric prefix that
  indicates the error code associated with the message. For example, the
  following two asserts implement an internal and external assert, respectively.

     assert(false, "This code is broken.");
     assert(false, "1001: Invalid user input.");

  To aid in the writing of external messages, we keep them in a single global
  table named 'messages'. Each module adds to this table its own messages
  with an expression such as

     messages[1001] = "Invalid user input.";

  These messages are accessed with the 'message' function as such

     message(1001);

  Calling 'assert' with 'message' looks like

     assert(x != y, message(1001));

  ALLOCATING ERROR CODES

  In order to avoid error code conflicts, each module claims a range of values
  that is not already taken by the modules in the same system. A module claims
  a range of codes by calling the function reserveCodeRange() like this:

     reserveCodeRange(1000, 1999, "mymodule");

  If the requested code range has any values that are already reserved, then
  an assertion is raised.

  USAGE

  In general, only allocate message codes for external asserts. For internal
  asserts, it is sufficient to simply inline the message text in the assert
  expression.

  It is good to write an assert for every undefined state, regardless of whether
  it is the result of external input or not. Asserts can then be externalized if
  and when they it is clear that they are the result of external input.

  A client module can override the messages provided by the libraries it uses by
  simply redefining those messages after the defining library is loaded. That is,
  the client can copy and past the statements of the form

     messages[1001] = "Invalid user input.";

  and provide new text for the message.

     messages[1001] = "Syntax error.";

  In the same way different sets of messages can be overridden for the purpose
  of localization.

*/

var location = "";
var messages = {};
var reservedCodes = [];
var ASSERT = true;
var assert = (function () {
  return !ASSERT ? function () {} : function (val, str) {
    if (str === void 0) {
      str = "failed!";
    }
    if (!val) {
      var err = new Error(str);
      err.location = location;
      throw err;
    }
  };
})();

var message = function message(errorCode, args) {
  var str = messages[errorCode];
  if (args) {
    args.forEach(function (arg, i) {
      str = str.replace("%" + (i + 1), arg);
    });
  }
  return errorCode + ": " + str;
};

var reserveCodeRange = function reserveCodeRange(first, last, moduleName) {
  assert(first <= last, "Invalid code range");
  var noConflict = reservedCodes.every(function (range) {
    return last < range.first || first > range.last;
  });
  assert(noConflict, "Conflicting request for error code range");
  reservedCodes.push({ first: first, last: last, name: moduleName });
};

var setLocation = function setLocation(location) {
  //assert(location, "Empty location");
  location = loc;
};

var clearLocation = function clearLocation() {
  location = null;
};

var setCounter = function setCounter(n, message) {
  count = n;
  countMessage = message ? message : "ERROR count exceeded";
};

var checkCounter = function checkCounter() {
  if (typeof count !== "number" || isNaN(count)) {
    assert(false, "ERROR counter not set");
    return;
  }
  assert(count--, countMessage);
};

exports.assert = assert;
exports.message = message;
exports.messages = messages;
exports.reserveCodeRange = reserveCodeRange;

},{}],2:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; indent-tabs-mode: nil; tab-width: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */
/* Copyright (c) 2015, Jeff Dyer, Art Compiler LLC */
"use strict";

var _assertJs = require("./assert.js");

window.exports.viewer = (function () {
  function update(el, obj, src, pool) {
    var data = JSON.parse(obj).data;
    var item = data[0];
    d3.json("/code/" + item, function (error, data) {
      if (error) return console.warn(error);
      d3.select(el).html(data[0].img);
      var g = d3.select("#graff-view svg g");
      var bbox = g[0][0].getBBox();
      d3.select(el).attr("height", bbox.height + 20 + "px");
      return;
    });
    return;
  }
  function capture(el) {}
  return {
    update: update,
    capture: capture };
})();

},{"./assert.js":1}]},{},[2]);
