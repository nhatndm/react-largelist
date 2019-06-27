import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import React, { Component, createRef } from "react";
import { last } from "lodash";
import { findScrollValue } from "../helper/dom";
var scrollStatus = false;

var MultiplyVirtualize =
/*#__PURE__*/
function (_Component) {
  _inherits(MultiplyVirtualize, _Component);

  function MultiplyVirtualize(props) {
    var _this;

    _classCallCheck(this, MultiplyVirtualize);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MultiplyVirtualize).call(this, props));
    _this.numVisibleItemsX = _this.props.numsOfVisibleColItems;
    _this.numVisibleItemsY = _this.props.numsOfVisibleRowItems;
    _this.viewPort = createRef();
    _this.state = {
      startX: 0,
      endX: _this.numVisibleItemsX,
      startY: 0,
      endY: _this.numVisibleItemsY,
      width: 100,
      height: 100,
      numbersOfCol: 0,
      numbersOfRow: 0,
      arrayWidth: [],
      arrayHeight: [],
      arrayLeft: [0],
      arrayTop: [0]
    };
    _this._timeout = null;
    _this.scollPos = _this.scollPos.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this._timeoutLoading = null;
    return _this;
  }

  _createClass(MultiplyVirtualize, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
          numbersOfCol = _this$props.numbersOfCol,
          numbersOfRow = _this$props.numbersOfRow,
          colWidth = _this$props.colWidth,
          colHeight = _this$props.colHeight;
      var _this$state = this.state,
          startX = _this$state.startX,
          startY = _this$state.startY,
          arrayWidth = _this$state.arrayWidth,
          arrayHeight = _this$state.arrayHeight,
          arrayLeft = _this$state.arrayLeft,
          arrayTop = _this$state.arrayTop;

      for (var i = startX; i <= numbersOfCol - 1; i++) {
        arrayWidth.push(colWidth({
          index: i
        }));
      }

      arrayWidth.reduce(function (total, num) {
        arrayLeft.push(total);
        return total + num;
      });

      for (var _i = startY; _i <= numbersOfRow - 1; _i++) {
        arrayHeight.push(colHeight({
          index: _i
        }));
      }

      arrayHeight.reduce(function (total, num) {
        arrayTop.push(total);
        return total + num;
      });
      var width = last(arrayLeft) + colWidth({
        index: numbersOfCol - 1
      });
      var height = last(arrayTop) + colHeight({
        index: numbersOfRow - 1
      });
      this.setState({
        width: width,
        height: height,
        numbersOfCol: numbersOfCol,
        numbersOfRow: numbersOfRow,
        arrayLeft: arrayLeft,
        arrayTop: arrayTop,
        arrayHeight: arrayHeight,
        arrayWidth: arrayWidth
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      clearTimeout(this._timeoutLoading);
    }
  }, {
    key: "scollPos",
    value: function () {
      var _scollPos = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee() {
        var _this2 = this;

        var _this$state2, numbersOfCol, numbersOfRow, arrayLeft, arrayTop, startX, startY, endX, endY, _this$props2, onScrollStop, onScrollStart, scrollYValue, scrollXValue;

        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this$state2 = this.state, numbersOfCol = _this$state2.numbersOfCol, numbersOfRow = _this$state2.numbersOfRow, arrayLeft = _this$state2.arrayLeft, arrayTop = _this$state2.arrayTop, startX = _this$state2.startX, startY = _this$state2.startY, endX = _this$state2.endX, endY = _this$state2.endY;
                _this$props2 = this.props, onScrollStop = _this$props2.onScrollStop, onScrollStart = _this$props2.onScrollStart;
                scrollYValue = findScrollValue(this.viewPort.current.scrollTop, this.numVisibleItemsY, numbersOfRow, arrayTop);
                scrollXValue = findScrollValue(this.viewPort.current.scrollLeft, this.numVisibleItemsX, numbersOfCol, arrayLeft);

                if (!(scrollXValue.start !== startX || scrollYValue.start !== startY)) {
                  _context.next = 13;
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
                        startX: startX,
                        endX: endX,
                        startY: startY,
                        endY: endY
                      });
                    }
                  }
                }, 1000);

                if (!(!scrollStatus && onScrollStart)) {
                  _context.next = 10;
                  break;
                }

                _context.next = 10;
                return onScrollStart({
                  startX: startX,
                  endX: endX,
                  startY: startY,
                  endY: endY
                });

              case 10:
                _context.next = 12;
                return this.setState({
                  startX: scrollXValue.start,
                  endX: scrollXValue.end,
                  startY: scrollYValue.start,
                  endY: scrollYValue.end
                });

              case 12:
                scrollStatus = true;

              case 13:
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
          startX = _this$state3.startX,
          endX = _this$state3.endX,
          startY = _this$state3.startY,
          endY = _this$state3.endY,
          arrayTop = _this$state3.arrayTop,
          arrayLeft = _this$state3.arrayLeft;
      var _this$props3 = this.props,
          colWidth = _this$props3.colWidth,
          colHeight = _this$props3.colHeight,
          renderRow = _this$props3.renderRow,
          showLoading = _this$props3.showLoading;

      if (!showLoading) {
        for (var i = startY; i <= endY; i++) {
          for (var j = startX; j <= endX; j++) {
            result.push(React.createElement("div", {
              key: "".concat(i).concat(j, "-").concat(Math.floor(Math.random() * Math.floor(100000))),
              style: {
                width: colWidth({
                  index: j
                }),
                position: "absolute",
                left: arrayLeft[j],
                top: arrayTop[i],
                border: "1px solid #e6e6e6",
                height: colHeight({
                  index: i
                })
              }
            }, renderRow({
              indexX: j,
              indexY: i
            })));
          }
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
      var _this$state4 = this.state,
          width = _this$state4.width,
          height = _this$state4.height;
      return React.createElement("div", {
        style: {
          height: viewPortHeight,
          width: viewPortWidth,
          position: "relative"
        }
      }, React.createElement("div", {
        ref: this.viewPort,
        style: _objectSpread({
          height: viewPortHeight,
          overflow: "scroll",
          position: "relative",
          width: viewPortWidth
        }, style),
        onScroll: this.scollPos
      }, React.createElement("div", {
        style: {
          width: width,
          position: "relative",
          height: height
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

  return MultiplyVirtualize;
}(Component);

export { MultiplyVirtualize as default };