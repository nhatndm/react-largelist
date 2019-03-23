import React, { Component } from "react";

export default class UnitItemTitle extends Component {
  shouldComponentUpdate(nextProps) {
    return parseInt(nextProps.id, 10) !== parseInt(this.props.id, 10);
  }

  render() {
    return (
      <div className="col-2">
        <div className="unit-item-title">{this.props.title}</div>
      </div>
    );
  }
}
