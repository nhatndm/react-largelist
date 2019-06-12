import React, { Component } from "react";

export default class UnitItemTitle extends Component {
  shouldComponentUpdate(nextProps) {
    return parseInt(nextProps.id, 10) !== parseInt(this.props.id, 10);
  }

  render() {
    const { title, propertyItemName, dailytPrice } = this.props;
    return (
      <div className="col-3">
        <div className="unit-item-title">
          <p className="property-item-name">{propertyItemName}</p>
          <p className="unit-name">Unit: {title}</p>
          <p className="unit-price">Daily: {dailytPrice}</p>
        </div>
      </div>
    );
  }
}
