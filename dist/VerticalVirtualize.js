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
import { findScrollValue } from "./helper/dom";
import { last } from "lodash";
var scrollStatus = false;

var VerticalVirtualize =
/*#__PURE__*/
function (_Component) {
  _inherits(VerticalVirtualize, _Component);

  function VerticalVirtualize(props) {
    var _this;

    _classCallCheck(this, VerticalVirtualize);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VerticalVirtualize).call(this, props));
    _this.numVisibleItems = _this.props.numsOfVisibleItems;
    _this.viewPort = createRef();
    _this.state = {
      start: 0,
      end: _this.numVisibleItems,
      height: 100,
      dataLength: 0,
      arrayHeight: [],
      arrayTop: [0]
    };
    _this._timeout = null;
    _this.scollPos = _this.scollPos.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(VerticalVirtualize, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
          dataLength = _this$props.dataLength,
          rowHeight = _this$props.rowHeight;
      var _this$state = this.state,
          start = _this$state.start,
          arrayHeight = _this$state.arrayHeight,
          arrayTop = _this$state.arrayTop;

      for (var i = start; i <= dataLength - 1; i++) {
        arrayHeight.push(rowHeight({
          index: i
        }));
      }

      arrayHeight.reduce(function (total, num) {
        arrayTop.push(total);
        return total + num;
      });
      var height = last(arrayTop) + rowHeight({
        index: dataLength - 1
      });
      this.setState({
        height: height,
        dataLength: dataLength,
        arrayHeight: arrayHeight,
        arrayTop: arrayTop
      });
    }
  }, {
    key: "scollPos",
    value: function () {
      var _scollPos = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee() {
        var _this2 = this;

        var _this$state2, dataLength, arrayTop, start, end, _this$props2, onScrollStop, onScrollStart, scrollValue;

        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this$state2 = this.state, dataLength = _this$state2.dataLength, arrayTop = _this$state2.arrayTop, start = _this$state2.start, end = _this$state2.end;
                _this$props2 = this.props, onScrollStop = _this$props2.onScrollStop, onScrollStart = _this$props2.onScrollStart;
                scrollValue = findScrollValue(this.viewPort.current.scrollTop, this.numVisibleItems, dataLength, arrayTop);

                if (!(scrollValue.start !== start)) {
                  _context.next = 11;
                  break;
                }

                if (this._timeout) {
                  clearTimeout(this._timeout);
                }

                this._timeout = setTimeout(function () {
                  if (scrollStatus) {
                    _this2._timeout = null;
                    scrollStatus = false;
                    clearTimeout(_this2._timeout);

                    if (onScrollStop) {
                      onScrollStop({
                        startIndex: start,
                        endIndex: end
                      });
                    }
                  }
                }, 1000);

                if (scrollStatus) {
                  _context.next = 9;
                  break;
                }

                _context.next = 9;
                return onScrollStart({
                  startIndex: start,
                  endIndex: end
                });

              case 9:
                this.setState({
                  start: scrollValue.start,
                  end: scrollValue.end
                });
                scrollStatus = true;

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
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
          arrayTop = _this$state3.arrayTop;
      var _this$props3 = this.props,
          rowHeight = _this$props3.rowHeight,
          renderRow = _this$props3.renderRow,
          showLoading = _this$props3.showLoading;

      if (!showLoading) {
        for (var i = start; i <= end; i++) {
          result.push(React.createElement("div", {
            key: i,
            style: {
              height: rowHeight({
                index: i
              }),
              position: "absolute",
              top: arrayTop[i],
              width: "100%",
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
      var height = this.state.height;
      return React.createElement("div", {
        style: {
          height: viewPortHeight,
          width: viewPortWidth,
          position: "relative"
        }
      }, React.createElement("div", {
        ref: this.viewPort,
        style: _objectSpread({
          height: viewPortHeight ? viewPortHeight : "100vh",
          overflowY: "scroll",
          overflowX: "hidden",
          position: "relative",
          width: viewPortWidth ? viewPortWidth : "100%"
        }, style),
        onScroll: this.scollPos
      }, React.createElement("div", {
        style: {
          height: height,
          position: "relative",
          width: "100%"
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

  return VerticalVirtualize;
}(Component);

export { VerticalVirtualize as default };