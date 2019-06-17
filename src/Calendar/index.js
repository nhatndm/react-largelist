import React, { Component } from "react";
import "./index.scss";
import CalendarTable from "./calendar-table";
import { connect } from "react-redux";
import { addDays, subDays, format } from "date-fns";
import { CalendarContextProvider } from "./context";
import { getArrayDates, convertToIdDate } from "./date";
import { WEEKLY } from "./type";
import {
  fetchPropertyData,
  savePropertyData,
  saveCurrentUnits,
  fetchEventsData
} from "../action";

class Calendar extends Component {
  state = {
    startDate: subDays(new Date(), 0),
    endDate: addDays(new Date(), 700),
    reRenderFilterBar: false,
    viewMode: WEEKLY,
    timeLineWidth: ""
  };

  async componentDidMount() {
    const data = await fetchPropertyData();
    const startTime = format(this.state.startDate, "YYYY-MM-DD");
    const endTime = format(addDays(this.state.startDate, 30), "YYYY-MM-DD");
    const datesLength = getArrayDates(this.state.startDate, this.state.endDate)
      .length;
    const units = [];
    for (let i = 0; i <= 10; i++) {
      units.push(data[i].unitId);
    }

    await this.props.savePropertyData(data);
    await this.props.saveCurrentUnits(units);
    await this.props.fetchEventsData(
      { startTime: startTime, endTime: endTime },
      units
    );
    // 50 is the width of each element at timeline
    await this.setState({ timeLineWidth: datesLength * 50 });
  }

  render() {
    return (
      <div className="main">
        <CalendarContextProvider
          value={{
            ...this.state,
            dates: () => {
              return getArrayDates(this.state.startDate, this.state.endDate);
            },
            changeTimeState: async (startDate, endDate) => {
              await this.setState({
                startDate: startDate,
                endDate: endDate,
                reRenderFilterBar: false
              });

              console.log("Fetching event");

              const startDiv = document.getElementById(
                convertToIdDate(this.state.startDate)
              );
              const endDiv = document.getElementById(
                convertToIdDate(this.state.endDate)
              );

              await this.setState({
                timeLineWidth: `${endDiv.offsetLeft - startDiv.offsetLeft}px`
              });
            },
            changeDataState: async data => {
              await this.setState({ ...data });
            },
            fetchEvents: () => {
              console.log("fetching event");
            },
            addDays: (date, total) => addDays(date, total),
            subDays: (date, total) => subDays(date, total)
          }}
        >
          <div className="calendar-new-main container">
            {this.props.children}
            <CalendarTable />
          </div>
        </CalendarContextProvider>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    savePropertyData: data => dispatch(savePropertyData(data)),
    saveCurrentUnits: units => dispatch(saveCurrentUnits(units)),
    fetchEventsData: (timeStamp, units) =>
      dispatch(fetchEventsData(timeStamp, units))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Calendar);
