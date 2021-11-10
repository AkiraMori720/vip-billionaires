import React, { lazy } from 'react'

const WidgetsDropdown = lazy(() => import('../components/widgets/WidgetsDropdown.js'))
class Dashboard extends React.Component {

  render() {
    const random = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1) + min)
    }

    return (
      <>
        <WidgetsDropdown />
      </>
    );
  }
}

export default Dashboard
