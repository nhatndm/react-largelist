/* eslint-disable no-useless-constructor */
import React, { Component, createRef } from "react";
import "./index.scss";
import { last } from "lodash";

let arrayWidth = [];
let arrayLeft = [0];

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
      dataLength: 0
    };
    this.scollPos = this.scollPos.bind(this);
  }

  componentDidMount() {
    const { dataLength, colWidth } = this.props;
    const { start } = this.state;
    for (let i = start; i <= dataLength - 1; i++) {
      arrayWidth.push(colWidth({ index: i }));
    }

    arrayWidth.reduce((total, num) => {
      arrayLeft.push(total);
      return total + num;
    });

    let lastTotalHeight = last(arrayLeft) + colWidth({ index: dataLength - 1 });
    this.setState({ width: lastTotalHeight, dataLength: dataLength });
  }

  scollPos() {
    const { dataLength } = this.state;
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
      this.setState({
        start: currentIndx,
        end: end
      });
    }
  }

  renderRows() {
    let result = [];
    const { start, end } = this.state;
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
