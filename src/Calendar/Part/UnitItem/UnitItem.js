/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { CalendarContextCosumner } from "../../context";
import UnitItemTitle from "../UnitItemTitle/UnitItemTitle";
import UnitItemData from "./UnitItemData";
import "./index.scss";

export const type = {
  BLOCK_ACTION: "Block",
  UNBLOCK_ACTION: "Unblock",
  BLOCKING: "blocking",
  RESERVATION: "reservation",
  AVAILABLE: "available",
  PROMOTION: "promotion",
  PROMOTION_RESERVATION: "promotion_reservation"
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
              title={item.unit}
              id={item.unitId}
              propertyItemName={item.propertyItemName}
              dailytPrice={item.dailyPrice}
            />
            <UnitItemData
              startDate={startDate}
              endDate={endDate}
              unitId={item.unitId}
              propertyId={item.id}
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
