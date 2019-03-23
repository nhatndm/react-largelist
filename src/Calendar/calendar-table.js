import React, { Component, Fragment } from "react";
import TimelineCalendar from "./Part/Timeline/Timeline";
import PropertyLayout from "./Part/PropertyLayout/PropertyLayout";

export default class CalendarTable extends Component {
  state = {};

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <Fragment>
        <TimelineCalendar />
        <PropertyLayout />
      </Fragment>
    );
  }
}
