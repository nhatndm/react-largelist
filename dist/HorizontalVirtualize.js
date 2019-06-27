import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";

/* eslint-disable no-useless-constructor */
import React, { Component, createRef } from "react";
import "./index.scss";
import { last } from "lodash";
import { findScrollValue } from "../helper/dom";
var scrollStatus = false;

var HorizontalVirtualize =
/*#__PURE__*/
function (_Component) {
  _inherits(HorizontalVirtualize, _Component);

  function HorizontalVirtualize(props) {
    var _this;

    _classCallCheck(this, HorizontalVirtualize);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(HorizontalVirtualize).call(this, props));
    _this.numVisibleItems = _this.props.numsOfVisibleItems;
    _this.viewPort = createRef();
    _this.state = {
      start: 0,
      end: _this.numVisibleItems,
      width: 100,
      dataLength: 0,
      arrayWidth: [],
      arrayLeft: [0]
    };
    _this._timeout = null;
    _this.scollPos = _this.scollPos.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.renderRows = _this.renderRows.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(HorizontalVirtualize, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
          dataLength = _this$props.dataLength,
          colWidth = _this$props.colWidth;
      var _this$state = this.state,
          start = _this$state.start,
          arrayWidth = _this$state.arrayWidth,
          arrayLeft = _this$state.arrayLeft;

      for (var i = start; i <= dataLength - 1; i++) {
        arrayWidth.push(colWidth({
          index: i
        }));
      }

      arrayWidth.reduce(function (total, num) {
        arrayLeft.push(total);
        return total + num;
      });
      var lastTotalWidth = last(arrayLeft) + colWidth({
        index: dataLength - 1
      });
      this.setState({
        width: lastTotalWidth,
        dataLength: dataLength,
        arrayLeft: arrayLeft,
        arrayWidth: arrayWidth
      });
    }
  }, {
    key: "scollPos",
    value: function () {
      var _scollPos = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2() {
        var _this2 = this;

        var _this$state2, dataLength, arrayLeft, start, end, _this$props2, onScrollStop, onScrollStart, scrollValue;

        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this$state2 = this.state, dataLength = _this$state2.dataLength, arrayLeft = _this$state2.arrayLeft, start = _this$state2.start, end = _this$state2.end;
                _this$props2 = this.props, onScrollStop = _this$props2.onScrollStop, onScrollStart = _this$props2.onScrollStart;
                scrollValue = findScrollValue(this.viewPort.current.scrollLeft, this.numVisibleItems, dataLength, arrayLeft);

                if (!(scrollValue.start !== start)) {
                  _context2.next = 12;
                  break;
                }

                if (this._timeout) {
                  clearTimeout(this._timeout);
                }

                this._timeout = setTimeout(
                /*#__PURE__*/
                _asyncToGenerator(
                /*#__PURE__*/
                _regeneratorRuntime.mark(function _callee() {
                  return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          if (!scrollStatus) {
                            _context.next = 7;
                            break;
                          }

                          _this2._timeout = null;
                          scrollStatus = false;
                          clearTimeout(_this2._timeout);

                          if (!onScrollStop) {
                            _context.next = 7;
                            break;
                          }

                          _context.next = 7;
                          return onScrollStop({
                            startIndex: start,
                            endIndex: end
                          });

                        case 7:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                })), 1000);

                if (!(!scrollStatus && onScrollStart)) {
                  _context2.next = 9;
                  break;
                }

                _context2.next = 9;
                return onScrollStart({
                  startIndex: start,
                  endIndex: end
                });

              case 9:
                _context2.next = 11;
                return this.setState({
                  start: scrollValue.start,
                  end: scrollValue.end
                });

              case 11:
                scrollStatus = true;

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function scollPos() {
        return _scollPos.apply(this, arguments);
      }

      return scollPos;
    }()
  }, {
    key: "renderRows",
    value: function renderRows() {
      var result = [];
      var _this$state3 = this.state,
          start = _this$state3.start,
          end = _this$state3.end,
          arrayLeft = _this$state3.arrayLeft;
      var _this$props3 = this.props,
          colWidth = _this$props3.colWidth,
          renderRow = _this$props3.renderRow,
          showLoading = _this$props3.showLoading;

      if (!showLoading) {
        for (var i = start; i <= end; i++) {
          result.push(React.createElement("div", {
            key: i,
            style: {
              width: colWidth({
                index: i
              }),
              position: "absolute",
              left: arrayLeft[i],
              height: "100%",
              border: "1px solid #e6e6e6"
            }
          }, renderRow({
            index: i
          })));
        }

        return result;
      }

      return null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          viewPortHeight = _this$props4.viewPortHeight,
          viewPortWidth = _this$props4.viewPortWidth,
          style = _this$props4.style,
          showLoading = _this$props4.showLoading,
          customLoading = _this$props4.customLoading;
      var width = this.state.width;
      return React.createElement("div", {
        style: {
          height: viewPortHeight,
          width: viewPortWidth,
          position: "relative"
        }
      }, React.createElement("div", {
        ref: this.viewPort,
        style: _objectSpread({
          height: viewPortHeight ? viewPortHeight : "100%",
          overflowY: "hidden",
          overflowX: "scroll",
          position: "relative",
          width: viewPortWidth ? viewPortWidth : "100%"
        }, style),
        onScroll: this.scollPos
      }, React.createElement("div", {
        style: {
          width: width,
          position: "relative",
          height: "100%"
        }
      }, this.renderRows())), showLoading ? React.createElement("div", {
        className: "animate_loading"
      }, customLoading ? customLoading() : React.createElement("div", {
        className: "lds-roller"
      }, new Array(8).fill(null).map(function (v, i) {
        return React.createElement("div", {
          key: i
        });
      }))) : null);
    }
  }]);

  return HorizontalVirtualize;
}(Component);

export { HorizontalVirtualize as default };