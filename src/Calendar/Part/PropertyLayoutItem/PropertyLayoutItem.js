import React, { Component } from "react";
import { ReactComponent as ExpandIcon } from "../../../assets/icons/arrow-twirl-down.svg";
import { ReactComponent as CollapedIcon } from "../../../assets/icons/arrow-twirl-up.svg";
import UnitItem from "../UnitItem/UnitItem";
import { connect } from "react-redux";
import { name, random } from "faker";

class PropertyLayoutItem extends Component {
  state = {
    collapedLayout: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      parseInt(nextProps.item.id(), 10) !==
        parseInt(this.props.item.id(), 10) ||
      nextState.collapedLayout !== this.state.collapedLayout
    );
  }

  render() {
    const { item } = this.props;
    return (
      <div className="property-layout-item">
        <div
          className="property-layout-item-group"
          onClick={() =>
            this.setState({ collapedLayout: !this.state.collapedLayout })
          }
        >
          {this.state.collapedLayout ? <CollapedIcon /> : <ExpandIcon />}
          {item.name()}
        </div>
        {!this.state.collapedLayout ? (
          <div className="property-layout-wrapper">
            <div className="scrollbar-right" />
            {new Array(5).fill(null).map((v, i) => {
              const unit = {
                id: random.uuid(),
                name: name.title(),
                propertyId: random.uuid()
              };
              return (
                <UnitItem
                  key={i}
                  item={unit}
                  unitIDChanged={parseInt(this.props.unitIDChanged, 10)}
                />
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }
}

export default connect(
  null,
  null
)(PropertyLayoutItem);
