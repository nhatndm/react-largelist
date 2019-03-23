import React, { Component } from "react";
import "./app.scss";
import Calendar from "./Calendar";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";

class App extends Component {
  render() {
    return (
      <div className="container">
        <p> Metroresidences Calendar</p>
        <Calendar />
      </div>
    );
  }
}

export default App;
