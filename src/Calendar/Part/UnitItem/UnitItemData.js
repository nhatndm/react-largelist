import React, { Component, Fragment, PureComponent } from "react";
import { find, flatten, map, filter } from "lodash";
import {
  getArrayDatesForEventsWithType,
  getArrayDatesForEvents,
  convertToIdDate
} from "../../date";
import { type } from "./UnitItem";
import Event from "../../../Event";
import moment from "moment";
import { connect } from "react-redux";
import { HorizontalVirtualize } from "../../../Virtualized";
import { ScrollSyncPane } from "react-scroll-sync";
import { saveCurrentTimeStamp, fetchEventsData } from "../../../action";

class UnitItemData extends Component {
  state = {
    dates: [],
    eventsByUnitId: [],
    startScrossing: false
  };

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.reachedScrollStop = this.reachedScrollStop.bind(this);
    this.renderColWidth = this.renderColWidth.bind(this);
    this.renderEvent = this.renderEvent.bind(this);
    this.reachedScrollStart = this.reachedScrollStart.bind(this);
    this.numsOfVisibleItems = 30;
  }

  componentDidMount() {
    const dates = this.generateDates();
    this.setState({
      dates: dates
    });
  }

  componentWillReceiveProps(nextProps) {
    const events = nextProps.events;
    if (events) {
      const eventsByUnitId = filter(
        events,
        v => v.unitId === this.props.unitId
      );
      const mappedArray = flatten(
        map(eventsByUnitId, v =>
          getArrayDatesForEventsWithType(
            moment(v.startTime),
            moment(v.endTime),
            v.id,
            v.type,
            v.unitId
          )
        )
      );

      const dates = this.generateDates(mappedArray);

      this.setState({
        dates: dates,
        eventsByUnitId: eventsByUnitId,
        startScrossing: false
      });
    }

    this.setState({
      startScrossing: false
    });
  }

  originalDates() {
    const { startDate, endDate, propertyId, unitId } = this.props;
    return getArrayDatesForEvents(startDate, endDate, propertyId, unitId);
  }

  generateDates(events = []) {
    const arrayObjectDates = this.originalDates();
    const eventsLength = events.length;
    if (eventsLength > 0) {
      for (let i = 0; i < eventsLength; i++) {
        const event = events[i];
        const foundObject = find(
          arrayObjectDates,
          value => value.id === event.id
        );
        if (foundObject) {
          foundObject.type = event.type;
          foundObject.eventId = event.eventId;
        }
      }
    }
    return arrayObjectDates;
  }

  renderRow({ index }) {
    const { startScrossing } = this.state;
    if (!startScrossing) {
      return (
        <UnitItemDataCol1
          item={this.state.dates[index]}
          key={index}
          // changeArrayDates={() => this.handleChangeArrayDate()}
          // setArrayToUnblock={eventId => this.handleFindArrayToUnblock(eventId)}
        />
      );
    }

    return null;
  }

  renderColWidth({ index }) {
    return 50;
  }

  async reachedScrollStop({ startIndex, endIndex }) {
    const startTime = this.state.dates[startIndex];
    const endTime = this.state.dates[endIndex];
    await this.props.saveCurrentTimeStamp(startTime.date, endTime.date);
    await this.props.fetchEventsData(
      { startTime: startTime.date, endTime: endTime.date },
      this.props.units
    );
  }

  async reachedScrollStart() {
    await this.setState({ eventsByUnitId: [], startScrossing: true });
  }

  calculateEventPosition(startLeftItem, endLeftItem, event) {
    const startElement = document.getElementById(
      convertToIdDate(event.startTime)
    );
    const endElement = document.getElementById(convertToIdDate(event.endTime));
    if (startElement && endElement) {
      return {
        width:
          parseInt(endElement.parentElement.style.left.split("px")[0], 10) -
          parseInt(startElement.parentElement.style.left.split("px")[0], 10) +
          50,
        left: parseInt(
          startElement.parentElement.style.left.split("px")[0],
          10
        ),
        borderRadius: "15px"
      };
    }

    if (startElement && !endElement) {
      return {
        width:
          endLeftItem -
          parseInt(startElement.parentElement.style.left.split("px")[0], 10) +
          50,
        left: parseInt(
          startElement.parentElement.style.left.split("px")[0],
          10
        ),
        borderRadius: "15px 0px 0px 15px"
      };
    }
  }

  renderEvent({ startLeftItem, endLeftItem }) {
    const { eventsByUnitId, startScrossing } = this.state;
    if (!startScrossing) {
      return eventsByUnitId.map((event, i) => {
        const position = this.calculateEventPosition(
          startLeftItem,
          endLeftItem,
          event
        );
        if (event.type === type.BLOCKING) {
          return (
            <Event
              top={25}
              startDate={new Date(event.startTime)}
              endDate={new Date(event.endTime)}
              left={position.left}
              width={position.width}
              borderRadius={position.borderRadius}
              content={`B`}
              event={event}
              key={i}
              style={{ backgroundColor: "#424242" }}
            />
          );
        }

        if (event.type === type.PROMOTION_RESERVATION) {
          return (
            <Event
              top={25}
              startDate={new Date(event.startTime)}
              endDate={new Date(event.endTime)}
              left={position.left}
              width={position.width}
              borderRadius={position.borderRadius}
              content={`P&R`}
              event={event}
              key={i}
              style={{ backgroundColor: "#ef4a81" }}
            />
          );
        }

        if (event.type === type.RESERVATION) {
          return (
            <Event
              top={25}
              startDate={new Date(event.startTime)}
              endDate={new Date(event.endTime)}
              left={position.left}
              width={position.width}
              borderRadius={position.borderRadius}
              content={`R`}
              event={event}
              key={i}
              style={{ backgroundColor: "#2bb6d6" }}
            />
          );
        }

        return null;
      });
    }
  }

  render() {
    const { dates, startScrossing } = this.state;
    return (
      <Fragment>
        <div className="col-9">
          {dates.length > 0 ? (
            <ScrollSyncPane>
              <HorizontalVirtualize
                colWidth={this.renderColWidth}
                dataLength={dates.length}
                numsOfVisibleItems={this.numsOfVisibleItems}
                renderRow={this.renderRow}
                reachedScrollStop={this.reachedScrollStop}
                reachedScrollStart={this.reachedScrollStart}
                renderEvent={this.renderEvent}
                startScrossing={startScrossing}
                calendarData
              />
            </ScrollSyncPane>
          ) : null}
        </div>
        )}
      </Fragment>
    );
  }
}

class UnitItemDataCol1 extends PureComponent {
  state = {
    itemType: this.props.item.type
  };

  componentWillReceiveProps({ item }) {
    if (item.type !== this.state.itemType) {
      this.setState({ itemType: item.type });
    }
  }

  render() {
    const { itemType } = this.state;

    return (
      <div
        className={
          itemType === type.BLOCKING
            ? "col-1 blocking"
            : itemType === type.PROMOTION ||
              itemType === type.PROMOTION_RESERVATION
            ? "col-1 promotion"
            : "col-1 available"
        }
      >
        {itemType === type.PROMOTION ||
        itemType === type.PROMOTION_RESERVATION ? (
          <div
            style={{ backgroundColor: "white", width: "100%", height: "100%" }}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = rootState => {
  return {
    units: rootState.units,
    events: rootState.events
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnitItemData);
