import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import './App.css';
import './utils/router';
import { PrivateRoute } from './utils/helper';

const ProjectCanvas = React.lazy(() => import('../src/views/pages/project-canvas'));
const Dashboard = React.lazy(() => import('../src/views/pages/dashboard'));

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

function App() {
  return (
    <BrowserRouter>
    <React.Suspense fallback={loading}>
      <Switch>
        <PrivateRoute path="/dashboard" name="Dashboard"  component={Dashboard}/>
        {/* <Route path="/dashboard" name="Dashboard" render={props => <Dashboard {...props} />} /> */}
        <Route path="/project-canvas" name="Project canvas" render={props => <ProjectCanvas {...props} />} />
      </Switch>
    </React.Suspense>
  </BrowserRouter>
  )
}

export default App;
