import React, { Component } from "react";
import { CalendarContextCosumner } from "../../context";
import { format } from "date-fns";
import { ScrollSyncPane } from "react-scroll-sync";
import { HorizontalVirtualize } from "../../../Virtualized";
import { connect } from "react-redux";
import { saveCurrentTimeStamp } from "../../../action";

export default class TimelineCalendar extends Component {
  render() {
    return (
      <CalendarContextCosumner>
        {({ changeTimeState, startDate, endDate, dates, addDays, subDays }) => (
          <div className="timeline-wrapper">
            <div className="timeline row">
              <div className="col-2">
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
              <TimeLineCol10Redux dates={dates} />
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

class TimeLineCol10 extends Component {
  constructor(props) {
    super(props);
    this.numsOfVisibleItems = 30;
    this.state = {
      data: []
    };

    this.renderRow = this.renderRow.bind(this);
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

  render() {
    return (
      // eslint-disable-next-line react/no-string-refs
      <div className="col-10">
        <div className="row-container">
          {this.state.data.length > 0 ? (
            <ScrollSyncPane>
              <HorizontalVirtualize
                colWidth={({ index }) => {
                  // if (index % 2 === 0) {
                  //   return 50;
                  // }

                  return 50;
                }}
                // viewPortHeight={200}
                // viewPortWidth={400}
                dataLength={this.state.data.length}
                numsOfVisibleItems={this.numsOfVisibleItems}
                renderRow={this.renderRow}
                reachedScrollStop={({ startIndex, endIndex }) => {
                  const startDate = this.state.data[startIndex];
                  const endDate = this.state.data[endIndex];
                  console.log(
                    `Will Call Api from ${startDate.date} to ${
                      endDate.date
                    } for units`
                  );
                  console.log(this.props.units);
                  this.props.saveCurrentTimeStamp(startDate.date, endDate.date);
                }}
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
      dispatch(saveCurrentTimeStamp(startTime, endTime))
  };
};

const TimeLineCol10Redux = connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeLineCol10);
