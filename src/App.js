import React, { Component } from "react";
import "./app.scss";
import Calendar from "./Calendar";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
// import { VerticalVirtualize, HorizontalVirtualize } from "./Virtualized";

// const data = new Array(10000).fill(null);

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
        <Calendar />
        <div className="row" style={{ margin: 0 }}>
          {/* This is for demo only */}
          {/* <VerticalVirtualize
            rowHeight={({ index }) => {
              // if (index % 2 === 0) {
              //   return 50;
              // }

              return 80;
            }}
            viewPortHeight={400}
            viewPortWidth={500}
            dataLength={data.length}
            numsOfVisibleItems={10}
            renderRow={this.renderRow}
          /> */}
          {/* <HorizontalVirtualize
            colWidth={({ index }) => {
              // if (index % 2 === 0) {
              //   return 50;
              // }

              return 80;
            }}
            viewPortHeight={200}
            // viewPortWidth={400}
            dataLength={data.length}
            numsOfVisibleItems={10}
            renderRow={this.renderRow}
          /> */}
          {/* This is for demo only */}
        </div>
      </div>
    );
  }
}

export default App;
