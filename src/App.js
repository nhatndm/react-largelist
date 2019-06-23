import React, { Component } from "react";
import "./app.scss";
import Calendar from "./Calendar";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { MultiVirtualize } from "./Virtualized";

class App extends Component {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
  }

  renderRow({ index }) {
    return (
      <div
        style={{
          backgroundColor: "silver",
          border: "1px solid red",
          width: "100%",
          height: "100%"
        }}
      >{`testing${index}`}</div>
    );
  }

  render() {
    return (
      <div className="container">
        <p> Metroresidences Calendar Improvement</p>
        {/* <Calendar /> */}
        <MultiVirtualize
          colHeight={() => 70}
          colWidth={() => 50}
          numbersOfCol={2000}
          numbersOfRow={1000}
          // viewPortHeight={200}
          // viewPortWidth={500}
          renderRow={() => <div />}
          numsOfVisibleColItems={30}
          numsOfVisibleRowItems={20}
          onScrollStop={v => console.log(v)}
          onScrollStart={v => console.log(v)}
          showLoading
        />
      </div>
    );
  }
}

export default App;
