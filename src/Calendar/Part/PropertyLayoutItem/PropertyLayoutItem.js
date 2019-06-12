import React, { Component } from "react";
import { ReactComponent as BuildingIcon } from "../../../assets/icons/building.svg";
// import { ReactComponent as CollapedIcon } from "../../../assets/icons/arrow-twirl-up.svg";
import UnitItem from "../UnitItem/UnitItem";
import { connect } from "react-redux";
import { name, random } from "faker";
import { VerticalVirtualize } from "../../../Virtualized";
import { saveCurrentUnits } from "../../../action";

// const data = new Array(200).fill(null).map((v, i) => {
//   return {
//     id: random.uuid(),
//     name: name.title(),
//     propertyId: random.uuid()
//   };
// });

class PropertyLayoutItem extends Component {
  state = {
    collapedLayout: false
  };

  constructor(props) {
    super(props);
    this.numsOfVisibleItems = 20;
    this.renderRow = this.renderRow.bind(this);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return (
  //     parseInt(nextProps.item.id, 10) !== parseInt(this.props.item.id, 10) ||
  //     nextState.collapedLayout !== this.state.collapedLayout
  //   );
  // }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.length > 0) {
      const units = [];
      for (let i = 0; i <= this.numsOfVisibleItems; i++) {
        units.push(nextProps.data[i].unitId);
      }
      this.props.saveCurrentUnits(units);
    }
  }

  renderRow({ index }) {
    const data = this.props.data;
    const item = data[index];
    if (item.showPropertyName) {
      return <PropertyLayoutItemTitle propertyName={item.propertyName} />;
    }

    return (
      <UnitItem
        key={index}
        item={data[index]}
        unitIDChanged={parseInt(this.props.unitIDChanged, 10)}
      />
    );
  }

  render() {
    const data = this.props.data;
    return (
      <div className="property-layout-item">
        <div className="property-layout-wrapper">
          {data.length > 0 ? (
            <VerticalVirtualize
              rowHeight={({ index }) => {
                // if (index % 2 === 0) {
                //   return 50;
                // }

                if (data[index].showPropertyName) {
                  return 48;
                }

                return 90;
              }}
              // viewPortHeight={400}
              // viewPortWidth={500}
              dataLength={data.length}
              numsOfVisibleItems={this.numsOfVisibleItems}
              renderRow={this.renderRow}
              reachedScrollStop={({ startIndex, endIndex }) => {
                const units = [];

                for (let i = startIndex; i <= endIndex; i++) {
                  units.push(this.props.data[i].unitId);
                }

                console.log(
                  `Will Call Api from ${this.props.timeStamp.startTime} to ${
                    this.props.timeStamp.endTime
                  } for units: `
                );
                console.log(units);
                this.props.saveCurrentUnits(units);
              }}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

const PropertyLayoutItemTitle = props => {
  return (
    <div className="property-layout-item-title">
      <BuildingIcon style={{ width: 24 }} />
      <p className="title">{props.propertyName}</p>
    </div>
  );
};

const mapStateToProps = rootState => {
  return {
    data: rootState.data,
    timeStamp: rootState.timeStamp
  };
};

const mapDispatchToProps = dispatch => {
  return {
    saveCurrentUnits: units => dispatch(saveCurrentUnits(units))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyLayoutItem);
