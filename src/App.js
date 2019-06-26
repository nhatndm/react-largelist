import React, { Component } from "react";
import "./app.scss";
import Calendar from "./Calendar";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import {
  MultiVirtualize,
  HorizontalVirtualize,
  VerticalVirtualize
} from "./Virtualized";

class App extends Component {
  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
    this.state = {
      fakeAPICall: false
    };
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
          viewPortHeight={500}
          // viewPortWidth={500}
          renderRow={() => <div />}
          numsOfVisibleColItems={30}
          numsOfVisibleRowItems={20}
          onScrollStart={() => this.setState({ fakeAPICall: true })}
          onScrollStop={() =>
            setTimeout(() => this.setState({ fakeAPICall: false }), 5000)
          }
          showLoading={this.state.fakeAPICall}
        />
        {/* <HorizontalVirtualize
          colWidth={() => 50}
          viewPortHeight={200}
          dataLength={200}
          numsOfVisibleItems={30}
          renderRow={() => <div />}
          onScrollStart={() => this.setState({ fakeAPICall: true })}
          onScrollStop={() =>
            setTimeout(() => this.setState({ fakeAPICall: false }), 5000)
          }
          showLoading={this.state.fakeAPICall}
        /> */}

        {/* <VerticalVirtualize
          rowHeight={() => 50}
          viewPortHeight={200}
          dataLength={200}
          numsOfVisibleItems={30}
          renderRow={() => <div />}
          onScrollStart={() => this.setState({ fakeAPICall: true })}
          onScrollStop={() =>
            setTimeout(() => this.setState({ fakeAPICall: false }), 5000)
          }
          showLoading={this.state.fakeAPICall}
        /> */}
      </div>
    );
  }
}

export default App;
