import React, { PureComponent } from "react";
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

  render() {
    const { top, style, left, width, borderRadius } = this.props;
    return (
      <div
        className="eventcard"
        style={{
          top: top,
          left: left,
          width: width,
          borderRadius: borderRadius,
          ...style
        }}
        onClick={async () => {
          await console.log("Will Fetch API Event Detail");
        }}
      >
        <div className="eventcard__content">{this.props.content}</div>
      </div>
    );
  }
}

export default connect(
  null,
  null
)(EventCard);
