/* eslint-disable no-useless-constructor */
import React, { Component, createRef } from "react";
import "./index.scss";
import { last } from "lodash";

let arrayHeight = [];
let arrayTop = [0];

let binarySearch = function(arr, x, start, end) {
  if (start > end) return false;

  let mid = Math.floor((start + end) / 2);

  if (arr[mid] <= x && x < arr[mid + 1]) return mid;

  if (arr[mid] > x) return binarySearch(arr, x, start, mid - 1);
  else return binarySearch(arr, x, mid + 1, end);
};

export default class VerticalVirtualize extends Component {
  constructor(props) {
    super(props);
    this.numVisibleItems = this.props.numsOfVisibleItems;
    this.viewPort = createRef();
    this.state = {
      start: 0,
      end: this.numVisibleItems,
      height: 100,
      dataLength: 0
    };
    this.scollPos = this.scollPos.bind(this);
  }

  componentDidMount() {
    const { dataLength, rowHeight } = this.props;
    const { start } = this.state;
    for (let i = start; i <= dataLength - 1; i++) {
      arrayHeight.push(rowHeight({ index: i }));
    }

    arrayHeight.reduce((total, num) => {
      arrayTop.push(total);
      return total + num;
    });

    let lastTotalHeight = last(arrayTop) + rowHeight({ index: dataLength - 1 });
    this.setState({ height: lastTotalHeight, dataLength: dataLength });
  }

  scollPos() {
    const { dataLength } = this.state;
    let currentIndx = binarySearch(
      arrayTop,
      this.viewPort.current.scrollTop,
      0,
      arrayTop.length - 1
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
      this.setState({
        start: currentIndx,
        end: end
      });
    }
  }

  renderRows() {
    let result = [];
    const { start, end } = this.state;
    const { rowHeight, renderRow } = this.props;
    for (let i = start; i <= end; i++) {
      result.push(
        <div
          key={i}
          style={{
            height: rowHeight({ index: i }),
            position: "absolute",
            top: arrayTop[i],
            width: "100%"
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
    const { height } = this.state;
    return (
      <div
        ref={this.viewPort}
        style={{
          height: viewPortHeight,
          overflowY: "scroll",
          overflowX: "hidden",
          position: "relative",
          width: viewPortWidth ? viewPortWidth : "100%"
        }}
        onScroll={this.scollPos}
      >
        <div
          style={{
            height: height,
            position: "relative",
            width: "100%"
          }}
        >
          {this.renderRows()}
        </div>
      </div>
    );
  }
}
