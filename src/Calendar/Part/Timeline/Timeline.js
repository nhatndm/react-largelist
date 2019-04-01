import React, { Component } from "react";
import { ReactComponent as CalendarPreIcon } from "../../../assets/icons/prev.svg";
import { ReactComponent as CalendarNextIcon } from "../../../assets/icons/next.svg";
import { CalendarContextCosumner } from "../../context";
import { format } from "date-fns";
import { ScrollSyncPane } from "react-scroll-sync";

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
    this.numVisibleItems = 12;
    this.state = {
      start: 0,
      end: this.numVisibleItems,
      data: []
    };
    this.containerStyle = { width: this.props.dates().length * 93 };

    this.scollPos = this.scollPos.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    this.setState({ data: this.props.dates() });
  }

  scollPos() {
    const { data } = this.state;

    let currentIndx = Math.trunc(this.refs.viewport.scrollLeft / 93);
    currentIndx =
      currentIndx - this.numVisibleItems >= data.length
        ? currentIndx - this.numVisibleItems
        : currentIndx;
    if (currentIndx !== this.state.start) {
      this.setState({
        start: currentIndx,
        end:
          currentIndx + this.numVisibleItems >= data.length
            ? data.length - 1
            : currentIndx + this.numVisibleItems
      });
    }
  }

  renderItem() {
    const { data, start, end } = this.state;
    let result = [];
    if (data.length > 0) {
      for (let i = start; i <= end; i++) {
        let item = data[i];
        result.push(<Item key={i} item={item} left={i * 93} />);
      }
    }
    return result;
  }

  render() {
    return (
      // eslint-disable-next-line react/no-string-refs
      <ScrollSyncPane>
        <div
          ref="viewport"
          className="col-10 viewport"
          onScroll={this.scollPos}
        >
          <div className="row-container" style={this.containerStyle}>
            {this.renderItem()}
          </div>
        </div>
      </ScrollSyncPane>
    );
  }
}

class Item extends Component {
  render() {
    const { item, left } = this.props;
    return (
      <div
        className={item.show.month ? "col-1 col-1-left" : "col-1"}
        id={item.id}
        style={{ left: left }}
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
