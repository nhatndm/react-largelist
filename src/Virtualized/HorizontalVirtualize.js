/* eslint-disable no-useless-constructor */
import React, { Component, createRef } from "react";
import "./index.scss";
import { last } from "lodash";

let scrollStatus = false;

let binarySearch = function(arr, x, start, end) {
  if (start > end) return false;

  let mid = Math.floor((start + end) / 2);

  if (arr[mid] <= x && x < arr[mid + 1]) return mid;

  if (arr[mid] > x) return binarySearch(arr, x, start, mid - 1);
  else return binarySearch(arr, x, mid + 1, end);
};

export default class HorizontalVirtualize extends Component {
  constructor(props) {
    super(props);
    this.numVisibleItems = this.props.numsOfVisibleItems;
    this.viewPort = createRef();
    this.state = {
      start: 0,
      end: this.numVisibleItems,
      width: 100,
      dataLength: 0,
      arrayWidth: [],
      arrayLeft: [0]
    };
    this._timeout = null;
    this.scollPos = this.scollPos.bind(this);
    this.renderRows = this.renderRows.bind(this);
  }

  componentDidMount() {
    const { dataLength, colWidth } = this.props;
    const { start, arrayWidth, arrayLeft } = this.state;
    for (let i = start; i <= dataLength - 1; i++) {
      arrayWidth.push(colWidth({ index: i }));
    }

    arrayWidth.reduce((total, num) => {
      arrayLeft.push(total);
      return total + num;
    });

    let lastTotalWidth = last(arrayLeft) + colWidth({ index: dataLength - 1 });

    this.setState({
      width: lastTotalWidth,
      dataLength: dataLength,
      arrayLeft: arrayLeft,
      arrayWidth: arrayWidth
    });
  }

  async scollPos() {
    const { dataLength, arrayLeft, start, end } = this.state;
    const { onScrollStop, onScrollStart } = this.props;

    let currentIndx = binarySearch(
      arrayLeft,
      this.viewPort.current.scrollLeft,
      0,
      arrayLeft.length - 1
    );

    currentIndx =
      currentIndx - this.numVisibleItems >= dataLength
        ? currentIndx - this.numVisibleItems
        : currentIndx;

    let endIndex =
      currentIndx + this.numVisibleItems >= dataLength
        ? dataLength - 1
        : currentIndx + this.numVisibleItems;

    if (currentIndx !== start) {
      if (this._timeout) {
        clearTimeout(this._timeout);
      }

      this._timeout = setTimeout(async () => {
        if (scrollStatus) {
          this._timeout = null;
          scrollStatus = false;
          clearTimeout(this._timeout);
          if (onScrollStop) {
            await onScrollStop({
              startIndex: start,
              endIndex: end
            });
          }
        }
      }, 1000);

      if (!scrollStatus && onScrollStart) {
        await onScrollStart({
          startIndex: start,
          endIndex: end
        });
      }

      await this.setState({
        start: currentIndx,
        end: endIndex
      });

      scrollStatus = true;
    }
  }

  renderRows() {
    let result = [];
    const { start, end, arrayLeft } = this.state;
    const { colWidth, renderRow, showLoading } = this.props;

    if (!showLoading) {
      for (let i = start; i <= end; i++) {
        result.push(
          <div
            key={i}
            style={{
              width: colWidth({ index: i }),
              position: "absolute",
              left: arrayLeft[i],
              height: "100%",
              border: "1px solid #e6e6e6"
            }}
          >
            {renderRow({ index: i })}
          </div>
        );
      }

      return result;
    }

    return null;
  }

  render() {
    const {
      viewPortHeight,
      viewPortWidth,
      style,
      showLoading,
      customLoading
    } = this.props;
    const { width } = this.state;
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
            height: viewPortHeight ? viewPortHeight : "100%",
            overflowY: "hidden",
            overflowX: "scroll",
            position: "relative",
            width: viewPortWidth ? viewPortWidth : "100%",
            ...style
          }}
          onScroll={this.scollPos}
        >
          <div
            style={{
              width: width,
              position: "relative",
              height: "100%"
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
