"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compiler = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /* -*- Mode: js; js-indent-level: 2; indent-tabs-mode: nil; tab-width: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */
/* Copyright (c) 2015, Art Compiler LLC */

var _assert = require("./assert.js");

var _https = require("https");

var https = _interopRequireWildcard(_https);

var _querystring = require("querystring");

var querystring = _interopRequireWildcard(_querystring);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

(0, _assert.reserveCodeRange)(1000, 1999, "compile");
_assert.messages[1001] = "Node ID %1 not found in pool.";
_assert.messages[1002] = "Invalid tag in node with Node ID %1.";
_assert.messages[1003] = "No async callback provided.";
_assert.messages[1004] = "No visitor method defined for '%1'.";

function getGCHost() {
  var port = global.port;
  if (port === 5205) {
    return "localhost";
  } else {
    return "www.graffiticode.com";
  }
}
function getGCPort() {
  var port = global.port;
  if (port === 5205) {
    return "3000";
  } else {
    return "443";
  }
}
var translate = function () {
  var nodePool = void 0;
  function translate(pool, resume) {
    nodePool = pool;
    return visit(pool.root, {}, resume);
  }
  function error(str, nid) {
    return {
      str: str,
      nid: nid
    };
  }
  function visit(nid, options, resume) {
    (0, _assert.assert)(typeof resume === "function", (0, _assert.message)(1003));
    // Get the node from the pool of nodes.
    var node = void 0;
    if ((typeof nid === "undefined" ? "undefined" : _typeof(nid)) === "object") {
      node = nid;
    } else {
      node = nodePool[nid];
    }
    (0, _assert.assert)(node, (0, _assert.message)(1001, [nid]));
    (0, _assert.assert)(node.tag, (0, _assert.message)(1001, [nid]));
    (0, _assert.assert)(typeof table[node.tag] === "function", (0, _assert.message)(1004, [JSON.stringify(node.tag)]));
    return table[node.tag](node, options, resume);
  }
  // BEGIN VISITOR METHODS
  var edgesNode = void 0;
  function str(node, options, resume) {
    var val = node.elts[0];
    resume([], {
      value: val
    });
  }
  function num(node, options, resume) {
    var val = node.elts[0];
    resume([], {
      value: val
    });
  }
  function ident(node, options, resume) {
    var val = node.elts[0];
    resume([], [val]);
  }
  function bool(node, options, resume) {
    var val = node.elts[0];
    resume([], [val]);
  }
  function add(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      val1 = +val1.value;
      if (isNaN(val1)) {
        err1 = err1.concat(error("Argument must be a number.", node.elts[0]));
      }
      visit(node.elts[1], options, function (err2, val2) {
        val2 = +val2.value;
        if (isNaN(val2)) {
          err2 = err2.concat(error("Argument must be a number.", node.elts[1]));
        }
        resume([].concat(err1).concat(err2), val1 + val2);
      });
    });
  };
  function style(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      visit(node.elts[1], options, function (err2, val2) {
        resume([].concat(err1).concat(err2), {
          value: val1,
          style: val2
        });
      });
    });
  };
  function list(node, options, resume) {
    if (node.elts && node.elts.length > 1) {
      visit(node.elts[0], options, function (err1, val1) {
        node.elts.shift();
        list(node, options, function (err2, val2) {
          resume([].concat(err1).concat(err2), [].concat(val1).concat(val2));
        });
      });
    } else if (node.elts && node.elts.length === 0) {
      visit(node.elts[0], options, function (err1, val1) {
        resume([].concat(err1), [].concat(val1));
      });
    } else {
      resume([], []);
    }
  };
  function binding(node, options, resume) {
    visit(node.elts[0], options, function (err1, val1) {
      visit(node.elts[1], options, function (err2, val2) {
        resume([].concat(err1).concat(err2), { key: val1, val: val2 });
      });
    });
  };
  function record(node, options, resume) {
    if (node.elts && node.elts.length > 1) {
      visit(node.elts[0], options, function (err1, val1) {
        node.elts.shift();
        record(node, options, function (err2, val2) {
          resume([].concat(err1).concat(err2), [].concat(val1).concat(val2));
        });
      });
    } else if (node.elts && node.elts.length > 0) {
      visit(node.elts[0], options, function (err1, val1) {
        resume([].concat(err1), [].concat(val1));
      });
    } else {
      resume([], []);
    }
  };
  function exprs(node, options, resume) {
    if (node.elts && node.elts.length > 1) {
      visit(node.elts[0], options, function (err1, val1) {
        node.elts.shift();
        exprs(node, options, function (err2, val2) {
          resume([].concat(err1).concat(err2), [].concat(val1).concat(val2));
        });
      });
    } else if (node.elts && node.elts.length > 0) {
      visit(node.elts[0], options, function (err1, val1) {
        resume([].concat(err1), [].concat(val1));
      });
    } else {
      resume([], []);
    }
  };
  function program(node, options, resume) {
    if (!options) {
      options = {};
    }
    visit(node.elts[0], options, function (err, val) {
      resume(err, val);
    });
  }
  function get(path, data, resume) {
    if (data) {
      path += "?" + querystring.stringify(data);
    }
    path = path.trim().replace(/ /g, "+");
    var options = {
      method: "GET",
      host: getGCHost(),
      port: getGCPort(),
      path: path
    };
    var req = https.get(options, function (res) {
      var data = "";
      res.on('data', function (chunk) {
        data += chunk;
      }).on('end', function () {
        try {
          resume([], JSON.parse(data));
        } catch (e) {
          console.log("parse error: " + e.stack);
        }
      }).on("error", function () {
        console.log("error() status=" + res.statusCode + " data=" + data);
      });
    });
  }
  function data(node, options, resume) {
    visit(node.elts[0], options, function (err, val) {
      var indexStr = val.value;
      get("/pieces/L106?q=" + val.value, null, function (err, val) {
        var list = [];
        for (var i = 0; i < val.length; i++) {
          list[i] = val[i].id;
        }
        resume([], list);
        return;
      });
    });
  }
  var table = {
    "PROG": program,
    "EXPRS": exprs,
    "STR": str,
    "NUM": num,
    "IDENT": ident,
    "BOOL": bool,
    "LIST": list,
    "RECORD": record,
    "BINDING": binding,
    "ADD": add,
    "STYLE": style,
    "DATA": data
  };
  return translate;
}();
var render = function () {
  function escapeXML(str) {
    return String(str).replace(/&(?!\w+;)/g, "&amp;").replace(/\n/g, " ").replace(/\\/g, "\\\\").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function render(val, resume) {
    resume([], val);
  }
  return render;
}();
var compiler = exports.compiler = function () {
  exports.compile = function compile(pool, resume) {
    // Compiler takes an AST in the form of a node pool and translates it into
    // an object to be rendered on the client by the viewer for this language.
    try {
      translate(pool, function (err, val) {
        if (err.length) {
          resume(err, val);
        } else {
          render(val, function (err, val) {
            if (val instanceof Array && val.length === 1) {
              val = val[0];
            }
            resume(err, val);
          });
        }
      });
    } catch (x) {
      console.log("ERROR with code");
      console.log(x.stack);
      resume("Compiler error", {
        score: 0
      });
    }
  };
}();
