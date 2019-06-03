import React, { Component } from "react";
import { ReactComponent as CalendarPreIcon } from "../../../assets/icons/prev.svg";
import { ReactComponent as CalendarNextIcon } from "../../../assets/icons/next.svg";
import { CalendarContextCosumner } from "../../context";
import { format } from "date-fns";
import { ScrollSyncPane } from "react-scroll-sync";
import { HorizontalVirtualize } from "../../../Virtualized";
export default class TimelineCalendar extends Component {
  render() {
    return (
      <CalendarContextCosumner>
        {({ changeTimeState, startDate, endDate, dates, addDays, subDays }) => (
          <div className="timeline-wrapper">
            <div className="timeline row">
              <div className="col-2">
                <span>Property</span>
                <div
                  className="timeline-preicon"
                  onClick={() => {
                    changeTimeState(
                      subDays(startDate, 13),
                      subDays(startDate, 0)
                    );
                  }}
                >
                  <CalendarPreIcon />
                </div>
              </div>
              <TimeLineCol10 dates={dates} />
              <div
                className="timeline-nexicon"
                onClick={() => {
                  changeTimeState(addDays(endDate, 0), addDays(endDate, 13));
                }}
              >
                <CalendarNextIcon />
              </div>
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
    this.state = {
      data: []
    };

    this.renderRow = this.renderRow.bind(this);
  }

  componentDidMount() {
    this.setState({ data: this.props.dates() });
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

                  return 93;
                }}
                // viewPortHeight={200}
                // viewPortWidth={400}
                dataLength={this.state.data.length}
                numsOfVisibleItems={12}
                renderRow={this.renderRow}
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
          {item.show.month ? (
            <p className="col-1-month">
              {format(new Date(item.date), "MMM YYYY")}
            </p>
          ) : null}
          <p className="col-1-date">{item.dateTitle}</p>
        </div>
      </div>
    );
  }
}
