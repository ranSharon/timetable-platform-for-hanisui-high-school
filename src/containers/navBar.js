import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Data from './data';
import BuildTimetable from './buildTimetable';
import DataOnTimetable from './dataOnTimetable';
import Guide from './guide';
import RegisterPage from './registerPage';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: 'text-secondary nav-link',
      buildTimetable: 'text-secondary nav-link',
      dataOnTimetable: 'text-secondary nav-link',
      guide: 'text-secondary nav-link',
      register: 'text-secondary nav-link',
      path: 'data'
    }
  }

  componentDidMount() {
    const path = window.location.pathname.substr(1);
    console.log(path);
    this.handleTabClick(path);
  }

  componentDidUpdate() {
    const path = window.location.pathname.substr(1);
    console.log(path);
    if (this.state.path !== path) {
      console.log(path.substr(1));
      // this.setState({path: path});
      this.handleTabClick(path);
    }
  }

  handleTabClick = (tab) => {
    switch (tab) {
      case 'data':
        this.setState({
          path: tab,
          data: 'text-secondary nav-link active',
          buildTimetable: 'text-secondary nav-link',
          dataOnTimetable: 'text-secondary nav-link',
          guide: 'text-secondary nav-link',
          register: 'text-secondary nav-link'
        });
        break;
      case 'buildTimetable':
        this.setState({
          path: tab,
          data: 'text-secondary nav-link',
          buildTimetable: 'text-secondary nav-link active',
          dataOnTimetable: 'text-secondary nav-link',
          guide: 'text-secondary nav-link',
          register: 'text-secondary nav-link'
        });
        break;
      case 'dataOnTimetable':
        this.setState({
          path: tab,
          data: 'text-secondary nav-link',
          buildTimetable: 'text-secondary nav-link',
          dataOnTimetable: 'text-secondary nav-link active',
          guide: 'text-secondary nav-link',
          register: 'text-secondary nav-link'
        });
        break;
      case 'guide':
        this.setState({
          path: tab,
          data: 'text-secondary nav-link',
          buildTimetable: 'text-secondary nav-link',
          dataOnTimetable: 'text-secondary nav-link',
          guide: 'text-secondary nav-link active',
          register: 'text-secondary nav-link'
        });
        break;
      case 'register':
        this.setState({
          path: tab,
          data: 'text-secondary nav-link',
          buildTimetable: 'text-secondary nav-link',
          dataOnTimetable: 'text-secondary nav-link',
          guide: 'text-secondary nav-link',
          register: 'text-secondary nav-link active'
        });
        break;
      default:
        this.setState({
          path: tab,
          data: 'text-secondary nav-link',
          buildTimetable: 'text-secondary nav-link',
          dataOnTimetable: 'text-secondary nav-link',
          guide: 'text-secondary nav-link',
          register: 'text-secondary nav-link'
        });
        break;
    }
  }

  render() {
    console.log(this.props.auth.currentUser.name);
    return (
      <Router>
        <div className="container-fluid">
          <ul className="nav nav-tabs">
            <li className="nav-item" onClick={() => this.handleTabClick('data')}>
              <Link to="/data" className={this.state.data}>הגדרת נתונים ושיעורים</Link>
            </li>
            <li className="nav-item" onClick={() => this.handleTabClick('buildTimetable')}>
              <Link to="/buildTimetable" className={this.state.buildTimetable} onClick={() => { console.log(this) }}>בניית מערכת שעות</Link>
            </li>
            <li className="nav-item" onClick={() => this.handleTabClick('dataOnTimetable')}>
              <Link to="/dataOnTimetable" className={this.state.dataOnTimetable}>הצגת נתונים על המערכת</Link>
            </li>
            <li className="nav-item" onClick={() => this.handleTabClick('guide')}>
              <Link to="/guide" className={this.state.guide}>מדריך משתמש</Link>
            </li>
            {this.props.auth.currentUser.name === 'administrator' ?
              <li className="nav-item" onClick={() => this.handleTabClick('register')}>
                <Link to="/register" className={this.state.register}>ניהול ורישום משתמשים</Link>
              </li> : null
            }
          </ul>
          <Route path="/data" component={Data} />
          <Route path="/buildTimetable" component={BuildTimetable} />
          <Route path="/dataOnTimetable" component={DataOnTimetable} />
          <Route path="/guide" component={Guide} />
          {this.props.auth.currentUser.name === 'administrator' ?
              <Route path="/register" component={RegisterPage} /> 
              : null
            }
        </div>
      </Router>

    );
  }
}

// export default NavBar;
NavBar.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, null)(NavBar);