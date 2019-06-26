import React, { Component, createRef } from "react";
import { last } from "lodash";
import { findScrollValue } from "../helper/dom";

let scrollStatus = false;

export default class MultiplyVirtualize extends Component {
  constructor(props) {
    super(props);
    this.numVisibleItemsX = this.props.numsOfVisibleColItems;
    this.numVisibleItemsY = this.props.numsOfVisibleRowItems;
    this.viewPort = createRef();
    this.state = {
      startX: 0,
      endX: this.numVisibleItemsX,
      startY: 0,
      endY: this.numVisibleItemsY,
      width: 100,
      height: 100,
      numbersOfCol: 0,
      numbersOfRow: 0,
      arrayWidth: [],
      arrayHeight: [],
      arrayLeft: [0],
      arrayTop: [0]
    };
    this._timeout = null;
    this.scollPos = this.scollPos.bind(this);
    this._timeoutLoading = null;
  }

  componentDidMount() {
    const { numbersOfCol, numbersOfRow, colWidth, colHeight } = this.props;
    const {
      startX,
      startY,
      arrayWidth,
      arrayHeight,
      arrayLeft,
      arrayTop
    } = this.state;
    for (let i = startX; i <= numbersOfCol - 1; i++) {
      arrayWidth.push(colWidth({ index: i }));
    }

    arrayWidth.reduce((total, num) => {
      arrayLeft.push(total);
      return total + num;
    });

    for (let i = startY; i <= numbersOfRow - 1; i++) {
      arrayHeight.push(colHeight({ index: i }));
    }

    arrayHeight.reduce((total, num) => {
      arrayTop.push(total);
      return total + num;
    });

    let width = last(arrayLeft) + colWidth({ index: numbersOfCol - 1 });
    let height = last(arrayTop) + colHeight({ index: numbersOfRow - 1 });

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

  componentWillUnmount() {
    clearTimeout(this._timeoutLoading);
  }

  async scollPos() {
    const {
      numbersOfCol,
      numbersOfRow,
      arrayLeft,
      arrayTop,
      startX,
      startY,
      endX,
      endY
    } = this.state;
    const { onScrollStop, onScrollStart } = this.props;

    let scrollYValue = findScrollValue(
      this.viewPort.current.scrollTop,
      this.numVisibleItemsY,
      numbersOfRow,
      arrayTop
    );
    let scrollXValue = findScrollValue(
      this.viewPort.current.scrollLeft,
      this.numVisibleItemsX,
      numbersOfCol,
      arrayLeft
    );

    if (scrollXValue.start !== startX || scrollYValue.start !== startY) {
      if (this._timeout) {
        clearTimeout(this._timeout);
      }

      this._timeout = setTimeout(() => {
        if (scrollStatus) {
          this._timeout = null;
          scrollStatus = false;
          clearTimeout(this._timeout);
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

      if (!scrollStatus && onScrollStart) {
        await onScrollStart({
          startX: startX,
          endX: endX,
          startY: startY,
          endY: endY
        });
      }

      await this.setState({
        startX: scrollXValue.start,
        endX: scrollXValue.end,
        startY: scrollYValue.start,
        endY: scrollYValue.end
      });

      scrollStatus = true;
    }
  }

  renderRows() {
    let result = [];
    const { startX, endX, startY, endY, arrayTop, arrayLeft } = this.state;
    const { colWidth, colHeight, renderRow, showLoading } = this.props;

    if (!showLoading) {
      for (let i = startY; i <= endY; i++) {
        for (let j = startX; j <= endX; j++) {
          result.push(
            <div
              key={`${i}${j}-${Math.floor(Math.random() * Math.floor(100000))}`}
              style={{
                width: colWidth({ index: j }),
                position: "absolute",
                left: arrayLeft[j],
                top: arrayTop[i],
                border: "1px solid #e6e6e6",
                height: colHeight({ index: i })
              }}
            >
              {renderRow({ indexX: j, indexY: i })}
            </div>
          );
        }
      }

      return result;
    }

    return null;
  }

  render() {
    let {
      viewPortHeight,
      viewPortWidth,
      style,
      showLoading,
      customLoading
    } = this.props;
    const { width, height } = this.state;

    return (
      <div
        style={{
          height: viewPortHeight,
          width: viewPortWidth,
          position: "relative"
        }}
      >
        <div
          ref={this.viewPort}
          style={{
            height: viewPortHeight,
            overflow: "scroll",
            position: "relative",
            width: viewPortWidth,
            ...style
          }}
          onScroll={this.scollPos}
        >
          <div
            style={{
              width: width,
              position: "relative",
              height: height
            }}
          >
            {this.renderRows()}
          </div>
        </div>

        {showLoading ? (
          <div className="animate_loading">
            {customLoading ? (
              customLoading()
            ) : (
              <div className="lds-roller">
                {new Array(8).fill(null).map((v, i) => (
                  <div key={i} />
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    );
  }
}
