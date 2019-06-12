import React, { Component } from "react";
import "./index.scss";
import CalendarTable from "./calendar-table";
import { connect } from "react-redux";
import { addDays, subDays } from "date-fns";
import { CalendarContextProvider } from "./context";
import { getArrayDates, convertToIdDate } from "./date";
import { WEEKLY } from "./type";
import { fetchPropertyData } from "../action";

class Calendar extends Component {
  state = {
    startDate: subDays(new Date(), 0),
    endDate: addDays(new Date(), 700),
    reRenderFilterBar: false,
    viewMode: WEEKLY,
    timeLineWidth: ""
  };

  componentDidMount() {
    this.props.fetchPropertyData();
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
    fetchPropertyData: () => dispatch(fetchPropertyData())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Calendar);
