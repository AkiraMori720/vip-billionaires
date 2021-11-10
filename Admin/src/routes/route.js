import React from "react";
import { Route, Redirect } from "react-router-dom";
import {connect} from "react-redux";
import PropTypes from "prop-types";

const AppRoute = ({
  component: Component,
  layout: Layout,
  isStatic,
  isAuthProtected,
  user,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {

      if (isAuthProtected && !user && !isStatic) {
        return (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        );
      } else if(!isAuthProtected && user && !isStatic){
        return (
          <Redirect
            to={{ pathname: "/dashboard", state: { from: props.location } }}
          />
        );
      }

      return (
        <Layout>
          <Component {...props} />
        </Layout>
      );
    }}
  />
);

AppRoute.propTypes = {
  component: PropTypes.any,
  layout: PropTypes.any,
  isStatic: PropTypes.bool,
  isAuthProtected: PropTypes.bool,
  location: PropTypes.object,
  user: PropTypes.object,
}


const mapStateToProps = state => {
  return {
    user: state.Login.user
  };
};


export default connect(mapStateToProps, null)(AppRoute);
