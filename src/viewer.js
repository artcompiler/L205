/* -*- Mode: js; js-indent-level: 2; indent-tabs-mode: nil; tab-width: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */
/* Copyright (c) 2015, Jeff Dyer, Art Compiler LLC */
import {assert, message, messages, reserveCodeRange} from "./assert.js";
import * as React from "react";
window.gcexports.viewer = (function () {
  function update(el, obj, src, pool) {
    var data = obj.data;
    var item = data[0];
    d3.json("/code/" + item, function(error, data) {
      if (error) return console.warn(error);
      d3.select(el).html(data[0].img);
      var g = d3.select("#graff-view svg g");
      var bbox = g[0][0].getBBox();
      d3.select(el).attr("height", (bbox.height + 20) + "px");
      return;
    });
    return;
  }
  function capture(el) {
  }
  return {
    update: update,
    capture: capture,
  };
})();
var ReactExample = React.createClass({
  propTypes: {
    lineNumbers: React.PropTypes.bool,
  },
  getDefaultProps: function() {
    return {
      lineNumbers: false,
    };
  },
  render: function() {
    return (
      <div style={this.props.style} className={this.props.className}>
        Hello, world!
      </div>
    );
  }
});

