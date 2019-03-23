import React, { Component } from "react";
import { ReactComponent as CalendarPreIcon } from "../../../assets/icons/prev.svg";
import { ReactComponent as CalendarNextIcon } from "../../../assets/icons/next.svg";
import { CalendarContextCosumner } from "../../context";
import { format } from "date-fns";

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
  render() {
    const { dates } = this.props;
    return (
      // eslint-disable-next-line react/no-string-refs
      <div className="col-10">
        {dates().map((v, i) => {
          return (
            <div
              className={v.show.month ? "col-1 col-1-left" : "col-1"}
              key={i}
              id={v.id}
            >
              {v.show.month ? (
                <p className="col-1-month">
                  {format(new Date(v.date), "MMM YYYY")}
                </p>
              ) : null}
              <p className="col-1-date">{v.dateTitle}</p>
            </div>
          );
        })}
      </div>
    );
  }
}
