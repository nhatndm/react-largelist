import React, { Component } from "react";
import "./app.scss";
import Calendar from "./Calendar";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

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
      </div>
    );
  }
}

export default App;
