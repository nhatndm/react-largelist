import React, { Component, createRef } from "react";
import { last } from "lodash";

let scrollStatus = false;

let binarySearch = function(arr, x, start, end) {
  if (start > end) return false;

  let mid = Math.floor((start + end) / 2);

  if (arr[mid] <= x && x < arr[mid + 1]) return mid;

  if (arr[mid] > x) return binarySearch(arr, x, start, mid - 1);
  else return binarySearch(arr, x, mid + 1, end);
};
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
      arrayTop: [0],
      isStartedScroll: false
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

  findScrollValue(scrollValue, numberOfVisibleItem, dataLength, arrayValueDim) {
    let currentIndex = binarySearch(
      arrayValueDim,
      scrollValue,
      0,
      arrayValueDim.length - 1
    );

    currentIndex =
      currentIndex - numberOfVisibleItem >= dataLength
        ? currentIndex - numberOfVisibleItem
        : currentIndex;

    let end =
      currentIndex + numberOfVisibleItem >= dataLength
        ? dataLength - 1
        : currentIndex + numberOfVisibleItem;

    return {
      start: currentIndex,
      end: end
    };
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
      endY,
      isStartedScroll
    } = this.state;
    const { onScrollStop, onScrollStart } = this.props;

    scrollStatus = true;

    let scrollYValue = this.findScrollValue(
      this.viewPort.current.scrollTop,
      this.numVisibleItemsY,
      numbersOfRow,
      arrayTop
    );
    let scrollXValue = this.findScrollValue(
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
            this.setState({ isStartedScroll: false });
          }
        }
      }, 1000);

      if (onScrollStart && !isStartedScroll) {
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
        endY: scrollYValue.end,
        isStartedScroll: true
      });
    }
  }

  renderRows() {
    let result = [];
    const {
      startX,
      endX,
      startY,
      endY,
      arrayTop,
      arrayLeft,
      isStartedScroll
    } = this.state;
    const { colWidth, colHeight, renderRow, showLoading } = this.props;

    if (!isStartedScroll || !showLoading) {
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
      renderLoading
    } = this.props;
    const { width, height, isStartedScroll } = this.state;

    viewPortHeight = viewPortHeight ? viewPortHeight : window.innerHeight - 150;
    viewPortWidth = viewPortWidth ? viewPortWidth : "100%";

    return (
      <div
        style={{
          height: viewPortHeight,
          width: viewPortWidth
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

        {isStartedScroll && showLoading ? (
          <div
            style={{
              position: "relative",
              top: -viewPortHeight,
              left: 0
            }}
          >
            {renderLoading ? renderLoading() : "Loading...."}
          </div>
        ) : null}
      </div>
    );
  }
}
