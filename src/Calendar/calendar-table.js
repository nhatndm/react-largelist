import React, { Component, Fragment } from "react";
import TimelineCalendar from "./Part/Timeline/Timeline";
import PropertyLayout from "./Part/PropertyLayout/PropertyLayout";
import { ScrollSync } from "react-scroll-sync";

export default class CalendarTable extends Component {
  state = {};

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <ScrollSync>
        <Fragment>
          <TimelineCalendar />
          <PropertyLayout />
        </Fragment>
      </ScrollSync>
    );
  }
}
