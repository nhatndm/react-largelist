/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { CalendarContextCosumner } from "../../context";
import UnitItemTitle from "../UnitItemTitle/UnitItemTitle";
import UnitItemCol10 from "./UnitItemCol10";
import "./index.scss";

export const type = {
  BLOCK_ACTION: "Block",
  UNBLOCK_ACTION: "Unblock",
  BLOCKING: "blocking",
  RESERVATION: "reservation",
  AVAILABLE: "available"
};

export default class UnitItem extends Component {
  shouldComponentUpdate(nextProps) {
    const unitIDChanged = parseInt(nextProps.unitIDChanged, 10);
    if (unitIDChanged === 0) {
      return true;
    } else {
      return unitIDChanged === parseInt(this.props.item.id, 10);
    }
  }

  render() {
    const { item } = this.props;
    return (
      <CalendarContextCosumner>
        {({
          startDate,
          endDate,
          changeDataState,
          fetchEvents,
          timeLineWidth
        }) => (
          <div className="unit-item row">
            <UnitItemTitle
              title={item.name ? item.name : `${item.id}`}
              id={item.id}
            />
            <UnitItemCol10
              startDate={startDate}
              endDate={endDate}
              unitId={item.id}
              propertyId={item.propertyId}
              timeLineWidth={timeLineWidth}
              fetchEvents={() => fetchEvents()}
              preventReRenderingFilterBar={() =>
                changeDataState({ reRenderFilterBar: false })
              }
            />
          </div>
        )}
      </CalendarContextCosumner>
    );
  }
}
