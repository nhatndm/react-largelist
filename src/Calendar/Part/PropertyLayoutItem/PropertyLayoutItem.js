import React, { PureComponent } from "react";
import { ReactComponent as BuildingIcon } from "../../../assets/icons/building.svg";
import UnitItem from "../UnitItem/UnitItem";
import { connect } from "react-redux";
import { VerticalVirtualize } from "../../../Virtualized";
import { saveCurrentUnits, fetchEventsData } from "../../../action";

class PropertyLayoutItem extends PureComponent {
  state = {
    collapedLayout: false
  };

  constructor(props) {
    super(props);
    this.numsOfVisibleItems = 10;
    this.renderRow = this.renderRow.bind(this);
    this.renderHeight = this.renderHeight.bind(this);
    this.reachedScrollStop = this.reachedScrollStop.bind(this);
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

  renderHeight({ index }) {
    const data = this.props.data;
    if (data[index].showPropertyName) {
      return 48;
    }

    return 90;
  }

  async reachedScrollStop({ startIndex, endIndex }) {
    const units = [];

    for (let i = startIndex; i <= endIndex; i++) {
      units.push(this.props.data[i].unitId);
    }

    await this.props.saveCurrentUnits(units);
    await this.props.fetchEventsData(this.props.timeStamp, units);
  }

  render() {
    const data = this.props.data;
    return (
      <div className="property-layout-item">
        <div className="property-layout-wrapper">
          {data.length > 0 ? (
            <VerticalVirtualize
              rowHeight={this.renderHeight}
              dataLength={data.length}
              numsOfVisibleItems={this.numsOfVisibleItems}
              renderRow={this.renderRow}
              reachedScrollStop={this.reachedScrollStop}
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
      <BuildingIcon style={{ width: 24, height: 24 }} />
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
    saveCurrentUnits: units => dispatch(saveCurrentUnits(units)),
    fetchEventsData: (timeStamp, units) =>
      dispatch(fetchEventsData(timeStamp, units))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PropertyLayoutItem);
