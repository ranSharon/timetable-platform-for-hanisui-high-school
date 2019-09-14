import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import TimetableStructure from './dataContainers/timetableStructure';
import Grades from './dataContainers/grades';
import StudySubjects from './dataContainers/studySubjects';
import Teachers from './dataContainers/teachers';
import ClassRooms from './dataContainers/classRooms';
import Constraints from './dataContainers/constraints';

class Data extends Component {
    render() {
        return (
            <Router>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="collpase navbar-collapse">
                        <ul className="navbar-nav ml-auto">
                            <li className="navbar-item">
                                <Link to="/data/structure" className="nav-link">שלד המערכת</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/data/grades" className="nav-link">שכבות וכיתות</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/data/classes" className="nav-link">חדרי לימוד</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/data/studySubjects" className="nav-link">מקצועות</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/data/teachers" className="nav-link">מורים</Link>
                            </li>
                            <li className="navbar-item">
                                <Link to="/data/constraints" className="nav-link">הגדרת שיעורים</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
                <Route path="/data/structure" component={TimetableStructure} />
                <Route path="/data/grades" component={Grades} />
                <Route path="/data/studySubjects" component={StudySubjects} />
                <Route path="/data/teachers" component={Teachers} />
                <Route path="/data/classes" component={ClassRooms} />
                <Route path="/data/constraints" component={Constraints} />
            </Router>
        );
    }
}

export default Data;