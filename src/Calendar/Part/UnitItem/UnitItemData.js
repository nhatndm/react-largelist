import React, { Component, Fragment } from "react";
import { forEach } from "lodash";
import {
  getArrayDatesForBlockingEvent,
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
import { saveCurrentTimeStamp } from "../../../action";

let itemClick = {
  firstItem: {},
  secondItem: {}
};

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
    const { timeLineWidth } = this.props;
    const dates = this.generateDates();
    this.setState({
      dates: dates,
      timeLineWidth: timeLineWidth
    });
  }

  originalDates() {
    const { startDate, endDate, propertyId, unitId } = this.props;
    return getArrayDatesForEvents(startDate, endDate, propertyId, unitId);
  }

  generateDates() {
    const arrayObjectDates = this.originalDates();

    return arrayObjectDates;
  }

  handleChangeArrayDate() {
    let time = {
      startDate: itemClick.firstItem.date,
      endDate: itemClick.secondItem.date
    };

    const dates = this.state.dates;

    if (moment(time.startDate).isSameOrAfter(moment(time.endDate))) {
      let tempVar;
      tempVar = time.startDate;
      time.startDate = time.endDate;
      time.endDate = tempVar;
    }

    const mappedArrayToCallApi = getArrayDatesForBlockingEvent(
      new Date(time.startDate),
      new Date(time.endDate),
      null
    );

    forEach(mappedArrayToCallApi, a => {
      const foundObject = dates.find(value => value.id === a.id);
      if (foundObject) {
        foundObject.status = type.BLOCKING;
      }
    });

    const DrawerAsync = AsyncComponent(() => import("../../../Drawer"));

    this.setState({
      dates: dates,
      startDate: moment(time.startDate),
      endDate: moment(time.endDate),
      Drawer: DrawerAsync,
      action: type.BLOCK_ACTION,
      actionFromDrawer: type.BLOCK_ACTION
    });
  }

  resetState() {
    itemClick = {
      firstItem: {},
      secondItem: {}
    };

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
        changeArrayDates={() => this.handleChangeArrayDate()}
        setArrayToUnblock={eventId => this.handleFindArrayToUnblock(eventId)}
      />
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
                colWidth={({ index }) => {
                  // if (index % 2 === 0) {
                  //   return 50;
                  // }

                  return 50;
                }}
                // viewPortHeight={200}
                // viewPortWidth={400}
                dataLength={dates.length}
                numsOfVisibleItems={30}
                renderRow={this.renderRow}
                reachedScrollStop={({ startIndex, endIndex }) => {
                  const startDate = this.state.dates[startIndex];
                  const endDate = this.state.dates[endIndex];
                  console.log(
                    `Will Call Api from ${startDate.date} to ${
                      endDate.date
                    } for units`
                  );
                  console.log(this.props.units);
                  this.props.saveCurrentTimeStamp(startDate.date, endDate.date);
                }}
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
    status: this.props.item.status
  };

  componentWillReceiveProps({ item }) {
    if (item.status !== this.state.status) {
      this.setState({ status: item.status });
    }
  }

  shouldComponentUpdate({ item }, { status }) {
    return (
      item.status !== this.props.item.status ||
      status !== this.state.status ||
      item.id !== this.props.item.id
    );
  }

  render() {
    const { status } = this.state;
    // const { item } = this.props;

    return (
      <div
        className={status === type.BLOCKING ? "col-1 blocking" : "col-1"}
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
      />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnitItemData);
