import React, { Component } from "react";
import PropertyLayoutItem from "../PropertyLayoutItem/PropertyLayoutItem";
import { name, random } from "faker";

export default class PropertyLayout extends Component {
  render() {
    return (
      <div className="property-layout">
        {new Array(20).fill(null).map((v, i) => {
          const object = { id: random.uuid, name: name.title };
          return <PropertyLayoutItem key={i} item={object} />;
        })}
      </div>
    );
  }
}
