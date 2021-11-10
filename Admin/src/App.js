import React, { Component } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import './scss/style.scss'
import AppRoute from "./routes/route";
import {authProtectedRoutes, publicRoutes} from "./routes";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"/>
  </div>
)

// Containers
const NonAuthLayout = React.lazy(() => import("./layout/NonAuthLayout"))
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

class App extends Component {
  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading}>
          <Switch>
            {publicRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={NonAuthLayout}
                component={route.component}
                key={idx}
                isStatic={route.isStatic}
                isAuthProtected={false}
              />
            ))}

            {authProtectedRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={DefaultLayout}
                component={route.component}
                key={idx}
                isStatic={route.isStatic}
                isAuthProtected={true}
              />
            ))}
          </Switch>
        </React.Suspense>
      </HashRouter>
    )
  }
}

export default App
