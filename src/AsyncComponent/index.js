import React, { Component } from "react";

const asyncComponent = (getComponent) => {
  // return AsyncComponent class component
  return class AsyncComponent extends Component {
    mounted = false;
    static Component = null;
    state = {
      Component: AsyncComponent.Component // first time similar to static Component = null
    };

    componentWillMount() {
      this.mounted = true;
      if (!this.state.Component) {
        // if this.state.Component is true value then getComponent promise resolve with .then() method
        getComponent().then(({ default: Component }) => {
          AsyncComponent.Component = Component;
          this.setState({ Component }); // update this.state.Component
        });
      }
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    render() {
      const { Component } = this.state; // destructing Component from this.state
      if (Component) {
        // if Component is truthy value then return Component with props
        return <Component {...this.props} />;
      }
      return null;
    }
  };
};

export default asyncComponent;
