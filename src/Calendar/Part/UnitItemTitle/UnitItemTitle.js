import React, { Component } from "react";
import { ReactComponent as ActionIcon } from "../../../assets/icons/card-menu.svg";

export default class UnitItemTitle extends Component {
  shouldComponentUpdate(nextProps) {
    return parseInt(nextProps.id, 10) !== parseInt(this.props.id, 10);
  }

  render() {
    const { title, propertyItemName, dailytPrice, id } = this.props;
    return (
      <div className="col-3">
        <ActionIcon />
        <div className="unit-item-title">
          <p className="property-item-name">{propertyItemName}</p>
          <p className="unit-name">Unit: {id}</p>
          <p className="unit-price">Daily: {dailytPrice}</p>
        </div>
      </div>
    );
  }
}
