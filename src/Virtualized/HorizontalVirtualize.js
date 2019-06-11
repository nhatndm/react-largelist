/* eslint-disable no-useless-constructor */
import React, { Component, createRef } from "react";
import "./index.scss";
import { last } from "lodash";

let currentScrollLeft = 0;
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

    let currentIndx = binarySearch(
      arrayLeft,
      currentScrollLeft,
      0,
      arrayLeft.length - 1
    );

    currentIndx =
      currentIndx - this.numVisibleItems >= dataLength
        ? currentIndx - this.numVisibleItems
        : currentIndx;

    let end =
      currentIndx + this.numVisibleItems >= dataLength
        ? dataLength - 1
        : currentIndx + this.numVisibleItems;

    let lastTotalHeight = last(arrayLeft) + colWidth({ index: dataLength - 1 });

    setTimeout(() => {
      if (this.viewPort.current) {
        this.viewPort.current.scrollLeft = currentScrollLeft;
      }
    });

    this.setState({
      width: lastTotalHeight,
      dataLength: dataLength,
      arrayLeft: arrayLeft,
      arrayWidth: arrayWidth,
      start: currentIndx,
      end: end
    });
  }

  scollPos() {
    const { dataLength, arrayLeft } = this.state;

    currentScrollLeft = this.viewPort.current.scrollLeft;

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

    let end =
      currentIndx + this.numVisibleItems >= dataLength
        ? dataLength - 1
        : currentIndx + this.numVisibleItems;

    if (currentIndx !== this.state.start) {
      if (this._timeout) {
        clearTimeout(this._timeout);
      }

      this._timeout = setTimeout(() => {
        if (scrollStatus) {
          this._timeout = null;
          scrollStatus = false;
          clearTimeout(this._timeout);
          if (this.props.reachedScrollStop) {
            this.props.reachedScrollStop();
          }
        }
      }, 1000);

      this.setState(
        {
          start: currentIndx,
          end: end
        },
        () => {
          scrollStatus = true;
        }
      );
    }
  }

  renderRows() {
    let result = [];
    const { start, end, arrayLeft } = this.state;
    const { colWidth, renderRow } = this.props;
    for (let i = start; i <= end; i++) {
      result.push(
        <div
          key={i}
          style={{
            width: colWidth({ index: i }),
            position: "absolute",
            left: arrayLeft[i],
            height: "100%"
          }}
        >
          {renderRow({ index: i })}
        </div>
      );
    }
    return result;
  }

  render() {
    const { viewPortHeight, viewPortWidth } = this.props;
    const { width } = this.state;

    return (
      <div
        ref={this.viewPort}
        style={{
          height: viewPortHeight ? viewPortHeight : "100%",
          overflowY: "hidden",
          overflowX: "scroll",
          position: "relative",
          width: viewPortWidth ? viewPortWidth : "100%"
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
    );
  }
}
