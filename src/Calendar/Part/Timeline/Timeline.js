import React, { Component } from "react";
import { CalendarContextCosumner } from "../../context";
import { format } from "date-fns";
import { ScrollSyncPane } from "react-scroll-sync";
import { HorizontalVirtualize } from "../../../Virtualized";
import { connect } from "react-redux";
import { saveCurrentTimeStamp, fetchEventsData } from "../../../action";

export default class TimelineCalendar extends Component {
  render() {
    return (
      <CalendarContextCosumner>
        {({ changeTimeState, startDate, endDate, dates, addDays, subDays }) => (
          <div className="timeline-wrapper">
            <div className="timeline row">
              <div className="col-3">
                <span>Property</span>
                {/* <div
                  className="timeline-preicon"
                  onClick={() => {
                    changeTimeState(
                      subDays(startDate, 13),
                      subDays(startDate, 0)
                    );
                  }}
                >
                  <CalendarPreIcon />
                </div> */}
              </div>
              <TimeLineDataRedux dates={dates} />
              {/* <div
                className="timeline-nexicon"
                onClick={() => {
                  changeTimeState(addDays(endDate, 0), addDays(endDate, 13));
                }}
              >
                <CalendarNextIcon />
              </div> */}
            </div>
          </div>
        )}
      </CalendarContextCosumner>
    );
  }
}

class TimeLineData extends Component {
  constructor(props) {
    super(props);
    this.numsOfVisibleItems = 20;
    this.state = {
      data: []
    };

    this.renderRow = this.renderRow.bind(this);
    this.renderColWidth = this.renderColWidth.bind(this);
    this.reachedScrollStop = this.reachedScrollStop.bind(this);
  }

  async componentDidMount() {
    await this.setState({ data: this.props.dates() });
    if (this.state.data.length > 0) {
      const startDate = this.state.data[0];
      const endDate = this.state.data[this.numsOfVisibleItems];
      this.props.saveCurrentTimeStamp(startDate.date, endDate.date);
    }
  }

  renderRow({ index }) {
    return <Item key={index} item={this.state.data[index]} />;
  }

  renderColWidth({ index }) {
    return 50;
  }

  async reachedScrollStop({ startIndex, endIndex }) {
    const startTime = this.state.data[startIndex];
    const endTime = this.state.data[endIndex];

    await this.props.saveCurrentTimeStamp(startTime.date, endTime.date);
    await this.props.fetchEventsData(
      {
        startTime: startTime.date,
        endTime: endTime.date
      },
      this.props.units
    );
  }

  render() {
    return (
      // eslint-disable-next-line react/no-string-refs
      <div className="col-9">
        <div className="row-container">
          {this.state.data.length > 0 ? (
            <ScrollSyncPane>
              <HorizontalVirtualize
                colWidth={this.renderColWidth}
                dataLength={this.state.data.length}
                numsOfVisibleItems={this.numsOfVisibleItems}
                renderRow={this.renderRow}
                reachedScrollStop={this.reachedScrollStop}
                style={{
                  borderTopRightRadius: 10
                }}
              />
            </ScrollSyncPane>
          ) : null}
        </div>
      </div>
    );
  }
}

class Item extends Component {
  render() {
    const { item } = this.props;
    return (
      <div
        className={item.show.month ? "col-1 col-1-left" : "col-1"}
        id={item.id}
      >
        <div className="item-container">
          <div
            className={`col-1-month ${
              item.show.borderLeft ? "show-border-left" : ""
            }`}
          />
          {item.show.month ? (
            <p className="col-1-show-month">
              {format(new Date(item.date), "MMMM YYYY")}
            </p>
          ) : null}
          <div className="col-1-date-month">
            {format(item.date, "ddd").toLocaleUpperCase()}
          </div>
          <div className="col-1-date-day">{format(item.date, "DD")}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = rootState => {
  return {
    units: rootState.units
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveCurrentTimeStamp: (startTime, endTime) =>
      dispatch(saveCurrentTimeStamp(startTime, endTime)),
    fetchEventsData: (timeStamp, units) =>
      dispatch(fetchEventsData(timeStamp, units))
  };
};

const TimeLineDataRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeLineData);
