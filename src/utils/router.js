import React from 'react';
import { Route, Switch, BrowserRouter, HashRouter } from 'react-router-dom';
import { PrivateRoute, NonSessionRoute } from './helper';

const ProjectCanvas = React.lazy(() => import('../../src/views/pages/project-canvas'));
const Dashboard = React.lazy(() => import('../../src/views/pages/dashboard'));
const Login = React.lazy(() => import('../../src/views/pages/login'));
const Home = React.lazy(() => import('../../src/views/pages/home'));

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)
// const routes = [
//     { path: '/', exact: true, name: 'Home' },
//     { path: '/project-canvas', exact: true, component: ProjectCanvas, name: 'Create project' },
// ];

// export default routes;

export const Routes = () => (
< BrowserRouter basename={`/crud-generator.beta.dimasnugroho673.github.io`}>
    <React.Suspense fallback={loading}>
      <Switch>
        {/* <Route exact path="/" name="Home" render={props => <Home {...props} />} /> */}
        <NonSessionRoute path="/auth/login" name="Login" component={Login} />
        <PrivateRoute path="/dashboard" name="Dashboard" component={Dashboard} />
        <PrivateRoute path="/project-canvas" name="Project canvas" component={ProjectCanvas} />
        <Route path="" render={props => <Home {...props} />} />
        {/* <Route path="/dashboard" name="Dashboard" render={props => <Dashboard {...props} />} /> */}
        {/* <Route path="/project-canvas" name="Project canvas" render={props => <ProjectCanvas {...props} />} /> */}
      </Switch>
    </React.Suspense>
  </BrowserRouter>
)