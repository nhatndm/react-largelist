/* eslint-disable no-useless-constructor */
import React, { Component, createRef } from "react";
import "./index.scss";
import { findScrollValue } from "../helper/dom";
import { last } from "lodash";

let scrollStatus = false;

export default class VerticalVirtualize extends Component {
  constructor(props) {
    super(props);
    this.numVisibleItems = this.props.numsOfVisibleItems;
    this.viewPort = createRef();
    this.state = {
      start: 0,
      end: this.numVisibleItems,
      height: 100,
      dataLength: 0,
      arrayHeight: [],
      arrayTop: [0]
    };
    this._timeout = null;
    this.scollPos = this.scollPos.bind(this);
  }

  componentDidMount() {
    const { dataLength, rowHeight } = this.props;
    const { start, arrayHeight, arrayTop } = this.state;
    for (let i = start; i <= dataLength - 1; i++) {
      arrayHeight.push(rowHeight({ index: i }));
    }

    arrayHeight.reduce((total, num) => {
      arrayTop.push(total);
      return total + num;
    });

    let height = last(arrayTop) + rowHeight({ index: dataLength - 1 });

    this.setState({
      height: height,
      dataLength: dataLength,
      arrayHeight: arrayHeight,
      arrayTop: arrayTop
    });
  }

  async scollPos() {
    const { dataLength, arrayTop, start, end } = this.state;
    const { onScrollStop, onScrollStart } = this.props;

    let scrollValue = findScrollValue(
      this.viewPort.current.scrollTop,
      this.numVisibleItems,
      dataLength,
      arrayTop
    );

    if (scrollValue.start !== start) {
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
              startIndex: start,
              endIndex: end
            });
          }
        }
      }, 1000);

      if (!scrollStatus) {
        await onScrollStart({
          startIndex: start,
          endIndex: end
        });
      }

      this.setState({
        start: scrollValue.start,
        end: scrollValue.end
      });

      scrollStatus = true;
    }
  }

  renderRows() {
    let result = [];
    const { start, end, arrayTop } = this.state;
    const { rowHeight, renderRow, showLoading } = this.props;

    if (!showLoading) {
      for (let i = start; i <= end; i++) {
        result.push(
          <div
            key={i}
            style={{
              height: rowHeight({ index: i }),
              position: "absolute",
              top: arrayTop[i],
              width: "100%",
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
    const { height } = this.state;
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
            height: viewPortHeight ? viewPortHeight : "100vh",
            overflowY: "scroll",
            overflowX: "hidden",
            position: "relative",
            width: viewPortWidth ? viewPortWidth : "100%",
            ...style
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
