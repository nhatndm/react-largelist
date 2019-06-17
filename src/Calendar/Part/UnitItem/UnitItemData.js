import React, { Component, Fragment } from "react";
import { find, flatten, map } from "lodash";
import {
  getArrayDatesForEventsWithType,
  getArrayDatesForEvents
} from "../../date";
import ReactDOM from "react-dom";
import AsyncComponent from "../../../AsyncComponent";
import { type } from "./UnitItem";
import { DateRangePicker } from "react-dates";
// import Radio from "component/Form/Radio";
import moment from "moment";
import { connect } from "react-redux";
import { HorizontalVirtualize } from "../../../Virtualized";
import { ScrollSyncPane } from "react-scroll-sync";
import { saveCurrentTimeStamp, fetchEventsData } from "../../../action";

class UnitItemData extends Component {
  state = {
    dates: [],
    action: "",
    startDate: moment(),
    endDate: moment(),
    focusedInput: "",
    actionFromDrawer: "",
    eventId: "",
    timeLineWidth: "",
    Drawer: null
  };

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.reachedScrollStop = this.reachedScrollStop.bind(this);
    this.renderColWidth = this.renderColWidth.bind(this);
    this.numsOfVisibleItems = 20;
  }

  componentDidMount() {
    const { timeLineWidth } = this.props;
    const dates = this.generateDates();
    this.setState({
      dates: dates,
      timeLineWidth: timeLineWidth
    });
  }

  componentWillReceiveProps(nextProps) {
    const events = nextProps.events;
    if (events) {
      // const blockingEvents = filter(events, v => v.type === "blocking");
      // const promotionEvents = filter(events, v => v.type === "promotion");
      // const promotionAndReservationEvents = filter(
      //   events,
      //   v => v.type === "promotion_reservation"
      // );
      const mappedArray = flatten(
        map(events, v =>
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
        dates: dates
      });
    }
  }

  originalDates() {
    const { startDate, endDate, propertyId, unitId } = this.props;
    return getArrayDatesForEvents(startDate, endDate, propertyId, unitId);
  }

  generateDates(events = []) {
    const arrayObjectDates =
      this.state.dates.length > 0 ? this.state.dates : this.originalDates();
    const eventsLength = events.length;
    if (eventsLength > 0) {
      for (let i = 0; i < eventsLength; i++) {
        const event = events[i];
        const foundObject = find(
          arrayObjectDates,
          value => value.id === event.id && value.unitId === event.unitId
        );
        if (foundObject) {
          foundObject.type = event.type;
          foundObject.eventId = event.eventId;
        }
      }
    }
    return arrayObjectDates;
  }

  resetState() {
    return this.setState({
      startDate: "",
      endDate: "",
      action: "",
      actionFromDrawer: "",
      eventId: ""
    });
  }

  handleCloseDrawer() {
    const dates = this.generateDates();
    ReactDOM.unstable_batchedUpdates(() => {
      this.setState({ dates: dates, Drawer: null });
      this.resetState();
    });
  }

  async handleSaveDrawer() {
    const { action, actionFromDrawer } = this.state;
    const { preventReRenderingFilterBar, fetchEvents } = this.props;

    if (
      action === type.UNBLOCK_ACTION &&
      actionFromDrawer === type.BLOCK_ACTION
    ) {
      await preventReRenderingFilterBar();
      console.log("Unblock action will be fired here");

      await fetchEvents();
    }

    if (action === type.BLOCK_ACTION && action === actionFromDrawer) {
      await preventReRenderingFilterBar();
      console.log("Block Action will be fired here");

      await fetchEvents();
    }

    if (action === type.UNBLOCK_ACTION && action === actionFromDrawer) {
      await preventReRenderingFilterBar();
      console.log("Unblock Action will be fired here");

      await fetchEvents();
    }

    this.resetState();
  }

  handleFindArrayToUnblock(eventId) {
    const DrawerAsync = AsyncComponent(() => import("../../../Drawer"));

    this.setState({
      startDate: moment(), // will receive date from Redux
      endDate: moment(), // will receive date from Redux
      Drawer: DrawerAsync,
      action: type.UNBLOCK_ACTION,
      actionFromDrawer: type.UNBLOCK_ACTION,
      eventId: eventId
    });
  }

  // renderEventItem() {
  //   const { sortedEventByStartDate } = this.state;
  //   return sortedEventByStartDate.map((event, i) => {
  //     if (event.refType === type.BLOCKING) {
  //       return (
  //         <EventCardBlock
  //           top={`${event.top}px`}
  //           startDate={new Date(event.startTime)}
  //           endDate={new Date(event.endTime)}
  //           currentWidth={this.state.timeLineWidth}
  //           content={`Blocking ${i + 1}`}
  //           event={event}
  //           key={i}
  //         />
  //       );
  //     }

  //     return (
  //       <EventCard
  //         top={`${event.top}px`}
  //         startDate={new Date(event.startTime)}
  //         endDate={new Date(event.endTime)}
  //         currentWidth={this.state.timeLineWidth}
  //         content={`Reservation ${i + 1}`}
  //         event={event}
  //         key={i}
  //       />
  //     );
  //   });
  // }

  renderRow({ index }) {
    return (
      <UnitItemDataCol1
        item={this.state.dates[index]}
        key={index}
        // changeArrayDates={() => this.handleChangeArrayDate()}
        setArrayToUnblock={eventId => this.handleFindArrayToUnblock(eventId)}
      />
    );
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

  render() {
    const {
      dates,
      startDate,
      endDate,
      focusedInput,
      action,
      actionFromDrawer,
      Drawer
    } = this.state;
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
              />
            </ScrollSyncPane>
          ) : null}
          {/* {this.renderEventItem()} */}
        </div>
        {Drawer && (
          <Drawer
            title={`${action} Property`}
            overlayClassName="unitItemCol12__overlay"
            drawerClassName="unitItemCol12__drawer"
            handleClose={() => this.handleCloseDrawer()}
            handleSave={async () => await this.handleSaveDrawer()}
          >
            <div>
              <DateRangePicker
                disabled={
                  actionFromDrawer === type.UNBLOCK_ACTION ? true : false
                }
                startDate={startDate}
                startDateId="startDateID"
                endDate={endDate}
                endDateId="endDateID"
                onDatesChange={({ startDate, endDate }) => {
                  this.setState({ startDate: startDate, endDate: endDate });
                }}
                focusedInput={focusedInput || null}
                onFocusChange={focusedInput => {
                  this.setState({ focusedInput: focusedInput });
                }}
                numberOfMonths={2}
                daySize={30}
                hideKeyboardShortcutsPanel={true}
                showDefaultInputIcon={true}
              />
            </div>
            <div>
              <h3>Availability</h3>
            </div>
            <div className="unitItemCol12__drawer__input_group row">
              <div className="col-3">
                {/* <Radio
                  isMutipleText={false}
                  name="staus"
                  id="available"
                  displayText="Available"
                  checked={
                    actionFromDrawer === type.UNBLOCK_ACTION ? true : false
                  }
                  onChange={() =>
                    this.setState({ actionFromDrawer: type.UNBLOCK_ACTION })
                  }
                /> */}
              </div>
              <div className="col-3">
                {/* <Radio
                  isMutipleText={false}
                  name="staus"
                  id="blocked"
                  displayText="Blocked"
                  checked={
                    actionFromDrawer === type.BLOCK_ACTION ? true : false
                  }
                  onChange={() =>
                    this.setState({ actionFromDrawer: type.BLOCK_ACTION })
                  }
                /> */}
              </div>
              <input placeholder="Block reason" />
            </div>
          </Drawer>
        )}
      </Fragment>
    );
  }
}

class UnitItemDataCol1 extends Component {
  state = {
    itemType: this.props.item.type
  };

  componentWillReceiveProps({ item }) {
    if (item.type !== this.state.itemType) {
      this.setState({ itemType: item.type });
    }
  }

  // shouldComponentUpdate({ item }, { status }) {
  //   return (
  //     item.status !== this.props.item.status ||
  //     status !== this.state.status ||
  //     item.id !== this.props.item.id
  //   );
  // }

  render() {
    const { itemType } = this.state;
    // const { item } = this.props;

    return (
      <div
        className={
          itemType === type.BLOCKING
            ? "col-1 blocking"
            : itemType === type.PROMOTION
            ? "col-1 promotion"
            : "col-1 available"
        }
        onClick={() => {
          // Object.keys(itemClick.firstItem).length > 0
          //   ? (itemClick.secondItem = item)
          //   : (itemClick.firstItem = item);

          // if (
          //   status === type.AVAILABLE &&
          //   (Object.keys(itemClick.firstItem).length === 0 ||
          //     Object.keys(itemClick.secondItem).length === 0)
          // ) {
          //   return this.setState({ status: type.BLOCKING });
          // }

          // if (itemClick.firstItem.status === type.BLOCKING) {
          //   return this.props.setArrayToUnblock(item.eventId);
          // }

          // return this.props.changeArrayDates();
          return;
        }}
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
