import React from 'react'
import { AppSidebar, AppFooter, AppHeader } from '../components/index'
import PropTypes from "prop-types";

const DefaultLayout = ({children}) => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          {children}
        </div>
      </div>
    </div>
  )
}

DefaultLayout.propTypes = {
  children: PropTypes.node,
}

export default DefaultLayout
