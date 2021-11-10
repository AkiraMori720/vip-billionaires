import React, { Component } from 'react';
import PropTypes from "prop-types";

class NonAuthLayout extends Component {
    render() {
        return <React.Fragment>
            {this.props.children}
        </React.Fragment>;
    }
}

NonAuthLayout.propTypes = {
  children: PropTypes.node,
}

export default NonAuthLayout;
