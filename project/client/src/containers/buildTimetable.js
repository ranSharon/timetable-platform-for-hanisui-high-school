import React, { Component } from 'react';
import axios from 'axios';
import HourBox from './buildTimetableContainers/hourBox';
import ClassRoomBox from './buildTimetableContainers/classRoomBox';
import ConstraintBox from './buildTimetableContainers/constraintBox';

class BuildTimetable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentClass: '',
            classConstraints: [],
            constraints: [],

            tableViewForClass: {
                classNumber: '',
                day: {
                    dayName: '',
                    dayLessons: {
                        time:{
                            time: '',
                            lessons: []
                        }
                    }
                }
            },

            timeTable: [],

            days: [],
            classRooms: [],
            grades: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:4000/data/getConstraints')
            .then(response => {
                this.setState({ constraints: [...response.data] });
                console.log('constraints:')
                console.log(this.state.constraints);

            })
            .catch(function (error) {
                console.log(error);
            });
        axios.get('http://localhost:4000/data/getDays')
            .then(response => {
                this.setState({ days: [...response.data] });
                console.log('days:')
                console.log(this.state.days);
            })
            .catch(function (error) {
                console.log(error);
            });
        axios.get('http://localhost:4000/data/getGrades')
            .then(response => {
                this.setState({ grades: [...response.data.sort(this.compareGrade)] });
                console.log('grades:')
                console.log(this.state.grades);
            })
            .catch(function (error) {
                console.log(error);
            });
        axios.get('http://localhost:4000/data/getClassRooms')
            .then(response => {
                this.setState({ classRooms: [...response.data] });
                console.log('classRooms:')
                console.log(this.state.classRooms);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    compareGrade(a, b) {
        const gradeA = a.grade;
        const gradeB = b.grade;

        let comparison = 0;
        if (gradeA > gradeB) {
            comparison = 1;
        } else if (gradeA < gradeB) {
            comparison = -1;
        }
        return comparison;
    }

    compareDay(a, b) {
        const dayA = a.day;
        const dayB = b.day;

        let comparison = 0;
        if (dayA > dayB) {
            comparison = 1;
        } else if (dayA < dayB) {
            comparison = -1;
        }
        return comparison;
    }

    setNavbar() {
        let grades = [...this.state.grades];
        let navBar = [];
        let key = 0;
        for (let i = 0; i <= grades.length - 1; i++) {
            for (let j = 1; j <= parseInt(grades[i].numOfClasses); j++) {
                navBar = [...navBar,
                <li key={key} className="navbar-item w-aotu">
                    <div
                        className="nav-link"
                        // value={grades[i].grade + j}
                        value={grades[i].grade + j}
                        onClick={() => { this.handleClassClick(grades[i].grade + j) }}
                        style={{ "cursor": "pointer" }}>
                        {grades[i].grade + j}
                    </div>
                </li>
                ];
                key++;
            }
        }

        return navBar;
    }

    handleClassClick(classNumber) {
        this.setState({ currentClass: classNumber });
        console.log(classNumber);
        let classConstraints = [];
        let constraints = [...this.state.constraints]
        for (let i = 0; i <= constraints.length - 1; i++) {
            for (let j = 0; j <= constraints[i].classNumber.length; j++) {
                if (classNumber === constraints[i].classNumber[j]) {
                    classConstraints = [...classConstraints, constraints[i]];
                }
            }
        }
        console.log(classConstraints);
        this.setState({ classConstraints: [...classConstraints] });
    }

    createBoxesForDay(day) {
        let days = [...this.state.days];
        let numOfHours = 0;
        let hoursBoxes = [];
        let startTime = 7;
        let endTime = 20;
        for (let i = 0; i <= days.length - 1; i++) {
            if (days[i].day === day) {
                startTime = parseInt(days[i].startTime);
                endTime = parseInt(days[i].endTime);
                numOfHours = endTime - startTime;
                break;
            }
        }
        for (let i = 1; i <= numOfHours; i++) {
            startTime++;
            hoursBoxes = [...hoursBoxes,
            <HourBox
                key={i}
                startTime={startTime}
                endTime={endTime}
            ></HourBox>
            ];

        }
        return hoursBoxes;
    }

    createTimeTableView() {
        return (
            <div className="row m-0">
                <div className="col col-1 border border-dark text-center" value='שעות'>שעות
                    <div className="row  border-top border-dark text-center" style={{ "height": "50px" }}>8:00-7:00</div>
                    <div className="row  border-top border-dark text-center" style={{ "height": "50px" }}>9:00-8:00</div>
                    <div className="row  border-top border-dark text-center" style={{ "height": "50px" }}>10:00-9:00</div>
                    <div className="row  border-top border-dark text-center" style={{ "height": "50px" }}>11:00-10:00</div>
                    <div className="row  border-top border-dark text-center" style={{ "height": "50px" }}>12:00-11:00</div>
                    <div className="row  border-top border-dark text-center" style={{ "height": "50px" }}>13:00-12:00</div>
                    <div className="row  border-top border-dark text-center" style={{ "height": "50px" }}>14:00-13:00</div>
                    <div className="row  border-top border-dark text-center" style={{ "height": "50px" }}>15:00-14:00</div>
                    <div className="row  border-top border-dark text-center" style={{ "height": "50px" }}>16:00-15:00</div>
                    <div className="row  border-top border-dark text-center" style={{ "height": "50px" }}>17:00-16:00</div>
                    <div className="row  border-top border-dark text-center" style={{ "height": "50px" }}>18:00-17:00</div>
                    <div className="row  border-top border-dark text-center" style={{ "height": "50px" }}>19:00-18:00</div>
                    <div className="row  border-top border-dark text-center" style={{ "height": "50px" }}>20:00-19:00</div>
                </div>
                <div className="col-11 row">
                    <div className="col col-2 border border-dark text-center" value='ראשון'>ראשון
                        {this.createBoxesForDay('ראשון')}
                    </div>
                    <div className="col-2 border border-dark text-center" value='שני'>שני
                        {this.createBoxesForDay('שני')}
                    </div>
                    <div className="col-2 border border-dark text-center" value='שלישי'>שלישי
                        {this.createBoxesForDay('שלישי')}
                    </div>
                    <div className="col-2 border border-dark text-center" value='רביעי'>רביעי
                        {this.createBoxesForDay('רביעי')}
                    </div>
                    <div className="col-2 border border-dark text-center" value='חמישי'>חמישי
                        {this.createBoxesForDay('חמישי')}
                    </div>
                    <div className="col-2 border border-dark text-center" value='שישי'>שישי
                        {this.createBoxesForDay('שישי')}
                    </div>
                </div>
            </div>
        );
    }

    createClassRoomBoxes() {
        let classRoomsBoxes = [];
        let classRooms = [...this.state.classRooms];
        for (let i = 0; i <= classRooms.length - 1; i++) {
            classRoomsBoxes = [...classRoomsBoxes,
            <ClassRoomBox
                key={i}
                data={classRooms[i]}
            >
            </ClassRoomBox>
            ]
        }

        return classRoomsBoxes;
    }

    createConstraintsBoxes() {
        let classConstraintsBoxes = [];
        let classConstraints = [...this.state.classConstraints];
        for (let i = 0; i <= classConstraints.length - 1; i++) {
            classConstraintsBoxes = [...classConstraintsBoxes,
            <ConstraintBox
                key={i}
                data={classConstraints[i]}
            >
            </ConstraintBox>
            ]
        }

        return classConstraintsBoxes;
    }


    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light p-auto ">
                    <div className="collpase navbar-collapse">
                        <ul className="navbar-nav justify-content-between w-100 p-0">
                            {this.setNavbar()}
                        </ul>
                    </div>
                </nav>
                <h4 className="text-right mr-3">{this.state.currentClass}</h4>
                {this.createTimeTableView()}
                <div className="row w-100 mt-2">
                    <div className="col-6">
                        <div
                            className="d-inline-block w-100  text-right p-0 card"
                            style={{ "position": "relative", "height": "400px", "overflow": "auto", "display": "block" }}>
                            <h6 className="text-center">שיעורים עבור כיתה זו</h6>
                            {this.createConstraintsBoxes()}
                        </div>
                    </div>
                    <div className="col-4 p-0 card">
                        <div className="w-100 h-100 text-right p-0 card">
                            merge
                        </div>
                    </div>
                    {/* <div className=" col-2 row m-0 card ">merge</div> */}
                    <div className="col-2">
                        <div
                            // className="w-100 h-100 text-right p-0 card"
                            className="w-100 text-right p-0 card"
                            style={{ "position": "relative", "height": "400px", "overflow": "auto", "display": "block" }}>
                            <h6 className="text-center">חדרי לימוד</h6>
                            {this.createClassRoomBoxes()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default BuildTimetable;