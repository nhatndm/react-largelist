import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import "./index.scss";

export default class Drawer extends Component {
  static propTypes = {
    // Header Title
    title: PropTypes.string.isRequired,
    // Custom overlay class
    overlayClassName: PropTypes.string,
    // Custom drawer class
    drawerClassName: PropTypes.string,
    // Function Close Drawer
    handleClose: PropTypes.func,
    // Function that pass data to parent
    handleSave: PropTypes.func,
    // localization
    lang: PropTypes.any
  };

  static defaultProps = {
    title: "Draver header title here",
    overlayClassName: "",
    drawerClassName: ""
  };

  static contextTypes = {
    t: PropTypes.func
  };

  componentWillMount() {
    document.addEventListener("keydown", e => this.handleEscape(e));
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", e => this.handleEscape(e));
  }

  handleEscape(e) {
    if (e.key === "Escape") {
      this.props.handleClose();
    }
  }

  render() {
    return (
      <Fragment>
        <div className={`overlay ${this.props.overlayClassName}`}>
          <div className={`drawer ${this.props.drawerClassName}`}>
            <div className="drawer__header">
              <button onClick={() => this.props.handleClose()}>Close</button>
              <p className="title">{this.props.title}</p>
            </div>
            <div className="drawer__body">{this.props.children}</div>
            <div className="drawer__footer">
              <div className="left-content">
                {/* <p
                  className="drawer__footer__cancel"
                  onClick={() => this.props.handleClose()}
                >
                  {this.context.t("cancel")}
                </p> */}
                <button onClick={() => this.props.handleClose()}>Close</button>
              </div>
              <div className="right-content">
                <button onClick={() => this.props.handleSave()}>Save</button>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
