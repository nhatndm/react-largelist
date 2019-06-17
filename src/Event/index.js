import React, { PureComponent, Fragment } from "react";
import moment from "moment-timezone";
import {
  convertToIdDate,
  calculateWidthBetweenDateForEvent
} from "../Calendar/date";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./index.scss";

class EventCard extends PureComponent {
  state = {
    width: "150px",
    left: "0px",
    showEvent: false,
    borderRadius: "15px"
  };

  static contextTypes = {
    t: PropTypes.func
  };

  componentDidMount() {
    this.getTimeRange(this.props.currentWidth);
  }

  componentWillReceiveProps(nextProps) {
    this.getTimeRange(nextProps.currentWidth);
  }

  calculatePoint(startDate, endDate, width) {
    const startElement = document.getElementById(
      convertToIdDate(startDate, this.props.viewMode)
    );
    const endElement = document.getElementById(
      convertToIdDate(endDate, this.props.viewMode)
    );
    const startElementParent = startElement
      ? startElement.parentElement.style.left
      : null;

    const endElementParent = endElement
      ? endElement.parentElement.style.left
      : null;

    const { event } = this.props;
    const startTime = moment(this.props.startDate).hour();
    const endTime = moment(this.props.endDate).hour();

    const startPoint = parseFloat((startTime / 24) * 50);

    const endPoint = parseFloat((endTime / 24) * 50);

    if (startElement && endElement) {
      return {
        width:
          parseInt(endElementParent.split("px")[0], 10) -
          parseInt(startElementParent.split("px")[0], 10) +
          50,
        left:
          event.type === "reservation"
            ? startElementParent + startPoint
            : startElementParent,
        borderRadius: "15px"
      };
    }

    if (startElement && !endElement) {
      return {
        width: width - parseInt(startElementParent.split("px")[0], 10) - 40,
        left:
          event.type === "reservation"
            ? startElementParent + startPoint
            : startElementParent,
        borderRadius: "15px 0px 0px 15px"
      };
    }

    if (!startElement && endElement) {
      return {
        width: parseInt(endElementParent.split("px")[0], 10) + 50,
        left: 0,
        borderRadius: "0px 15px 15px 0px"
      };
    }

    if (!startElement && !endElement) {
      return {
        width: width,
        left: 0,
        borderRadius: "0px"
      };
    }
  }

  getTimeRange(width) {
    const startDate = this.props.startDate;
    const endDate = this.props.endDate;
    const calculationPoint = this.calculatePoint(startDate, endDate, width);
    this.setState({
      width: calculationPoint.width,
      left: calculationPoint.left,
      showEvent: true,
      borderRadius: calculationPoint.borderRadius
    });
  }

  render() {
    const { top, style } = this.props;
    return (
      <Fragment>
        {this.state.showEvent ? (
          <Fragment>
            <div
              className="eventcard"
              style={{
                top: top,
                left: this.state.left,
                width: this.state.width,
                borderRadius: this.state.borderRadius,
                ...style
              }}
              onClick={async () => {
                await console.log("");
              }}
            >
              <div className="eventcard__content">{this.props.content}</div>
            </div>
          </Fragment>
        ) : null}
      </Fragment>
    );
  }
}

export default connect(
  null,
  null
)(EventCard);
