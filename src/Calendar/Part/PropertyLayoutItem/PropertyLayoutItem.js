import React, { Component } from "react";
// import { ReactComponent as ExpandIcon } from "../../../assets/icons/arrow-twirl-down.svg";
// import { ReactComponent as CollapedIcon } from "../../../assets/icons/arrow-twirl-up.svg";
import UnitItem from "../UnitItem/UnitItem";
import { connect } from "react-redux";
import { name, random } from "faker";
import { VerticalVirtualize } from "../../../Virtualized";

const data = new Array(200).fill(null).map((v, i) => {
  return {
    id: random.uuid(),
    name: name.title(),
    propertyId: random.uuid()
  };
});

class PropertyLayoutItem extends Component {
  state = {
    collapedLayout: false
  };

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      parseInt(nextProps.item.id, 10) !== parseInt(this.props.item.id, 10) ||
      nextState.collapedLayout !== this.state.collapedLayout
    );
  }

  renderRow({ index }) {
    return (
      <UnitItem
        key={index}
        item={data[index]}
        unitIDChanged={parseInt(this.props.unitIDChanged, 10)}
      />
    );
  }

  render() {
    return (
      <div className="property-layout-item">
        <div className="property-layout-wrapper">
          <div className="scrollbar-right" />
          {/* {new Array(5).fill(null).map((v, i) => {
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
          })} */}
          {data.length > 0 ? (
            <VerticalVirtualize
              rowHeight={({ index }) => {
                // if (index % 2 === 0) {
                //   return 50;
                // }

                return 90;
              }}
              // viewPortHeight={400}
              // viewPortWidth={500}
              dataLength={data.length}
              numsOfVisibleItems={10}
              renderRow={this.renderRow}
              reachedScrollStop={() =>
                console.log("The verticall scroll is done, Will call api")
              }
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  null
)(PropertyLayoutItem);
