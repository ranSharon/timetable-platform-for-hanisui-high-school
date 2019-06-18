import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Data from './containers/data';
import BuildTimetable from './containers/buildTimetable';
import DataOnTimetable from './containers/dataOnTimetable';
import General from './containers/general';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="collpase navbar-collapse">
              <ul className="navbar-nav ml-auto">
                <li className="navbar-item">
                  <Link to="/data" className="nav-link">הגדרת נתונים ושיעורים</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/buildTimetable" className="nav-link">בניית מערכת שעות</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/dataOnTimetable" className="nav-link">הצגת נתונים על המערכת</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/general" className="nav-link">מדריך משתמש</Link>
                </li>
              </ul>
            </div>
          </nav>
          <Route path="/data" component={Data} />
          <Route path="/buildTimetable" component={BuildTimetable} />
          <Route path="/dataOnTimetable" component={DataOnTimetable} />
          <Route path="/general" component={General} />
        </div>
      </Router>

    );
  }
}

export default App;
// export default DragDropContext(HTML5Backend)(App);
