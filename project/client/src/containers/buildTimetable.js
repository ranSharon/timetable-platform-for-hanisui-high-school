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

            currentConstraint: {},
            currentHourBox: {},
            currentDay: '',
            currentClassRoom: {},

            tableViewForClass: {},

            classRoomsView: [],

            timeTable: [],

            days: [],
            classRooms: [],
            grades: []
        }

        this.handleConstraintClick = this.handleConstraintClick.bind(this);
        this.handleHourClick = this.handleHourClick.bind(this);
        this.handleClassRoomClick = this.handleClassRoomClick.bind(this);
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
                axios.get('http://localhost:4000/data/getGrades')
                    .then(response => {
                        this.setState({ grades: [...response.data.sort(this.compareGrade)] });
                        console.log('grades:')
                        console.log(this.state.grades);
                        this.initTimeTable();
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            })
            .catch(function (error) {
                console.log(error);
            });
        axios.get('http://localhost:4000/data/getClassRooms')
            .then(response => {
                this.setState({ classRooms: [...response.data], classRoomsView: [...response.data] });
                console.log('classRooms:')
                console.log(this.state.classRooms);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    initTimeTable() {
        let grades = [...this.state.grades];
        let days = [...this.state.days];
        let timeTable = [...this.state.timeTable];
        for (let i = 0; i <= grades.length - 1; i++) {
            for (let j = 1; j <= grades[i].numOfClasses; j++) {
                let tableViewForClass = { classNumber: grades[i].grade + j, days: [] };
                for (let k = 0; k <= days.length - 1; k++) {
                    let day = { day: days[k].day, hours: [] };
                    let startTime = parseInt(days[k].startTime);
                    let endTime = parseInt(days[k].endTime);
                    for (let l = startTime + 1; l <= endTime; l++) {
                        let hour = { hour: l, constraints: [] };
                        day.hours = [...day.hours, hour];
                    }
                    tableViewForClass.days = [...tableViewForClass.days, day];
                }
                timeTable = [...timeTable, tableViewForClass];
            }

        }
        this.setState({ timeTable: timeTable }, function () {
            console.log('timeTable');
            console.log(this.state.timeTable);
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
        this.setState({ currentClass: classNumber, currentConstraint: {} }, function () {
            let tableViewForClass = { ...this.setTableViewForClass(classNumber) };
            this.setState({ tableViewForClass: tableViewForClass }, function () {
                // console.log(this.state.currentClass);
                // console.log(this.state.tableViewForClass);
            })
        });

        let classConstraints = [];
        let constraints = [...this.state.constraints]
        for (let i = 0; i <= constraints.length - 1; i++) {
            for (let j = 0; j <= constraints[i].classNumber.length; j++) {
                if (classNumber === constraints[i].classNumber[j]) {
                    classConstraints = [...classConstraints, constraints[i]];
                }
            }
        }
        // console.log(classConstraints);
        this.setState({ classConstraints: [...classConstraints] });
    }

    setTableViewForClass(classNumber) {
        let timeTable = [...this.state.timeTable];
        let tableViewForClass = {};
        for (let i = 0; i <= timeTable.length - 1; i++) {
            if (classNumber === timeTable[i].classNumber) {
                tableViewForClass = { ...timeTable[i] };
                break;
            }
        }
        return tableViewForClass;
    }

    createBoxesForDay(day, col) {
        if (this.objectEmpty(this.state.tableViewForClass)) {
            return null;
        }
        let dayView = {};
        // console.log(this.state.tableViewForClass.days);
        let days = [...this.state.tableViewForClass.days];
        for (let i = 0; i <= days.length - 1; i++) {
            if (days[i].day === day) {
                dayView = { ...days[i] };
                break;
            }
        }

        let hoursBoxes = [];
        let prvConstraints = '';
        let show = true;
        let validToAdd = true;
        let currentConstraintEmpty = true;

        for (let i = 0; i <= dayView.hours.length - 1; i++) {
            if (dayView.hours[i].constraints.length > 0) {
                validToAdd = false;
                if (prvConstraints === JSON.stringify(dayView.hours[i].constraints[0])) {
                    show = false;
                }
            } else if (!this.objectEmpty(this.state.currentConstraint)) {
                validToAdd = this.lessonCanBeAdded(day, dayView.hours[i].hour, dayView.hours[dayView.hours.length - 1].hour, this.state.currentConstraint);
                currentConstraintEmpty = false;
            }
            hoursBoxes = [...hoursBoxes,
            <HourBox
                key={i}
                show={show}
                validToAdd={validToAdd}
                day={day}
                data={dayView.hours[i]}
                endHour={dayView.hours[dayView.hours.length - 1].hour}
                currentConstraintEmpty={currentConstraintEmpty}
                row={i}
                col={col}
                click={this.handleHourClick}>
            </HourBox>
            ];
            show = true;
            if (dayView.hours[i].constraints.length !== 0) {
                prvConstraints = JSON.stringify(dayView.hours[i].constraints[0]);
            }
        }
        return hoursBoxes;
    }

    objectEmpty(obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    lessonCanBeAdded(day, hour, endofDay, constraint) {
        let canBeAdded = true;
        let lessonHours = parseInt(constraint.hours);
        if (lessonHours + (hour - 1) > endofDay) {
            return false
        }

        let message = '';
        let timeTable = [...this.state.timeTable];
        
        // console.log(timeTable);
        for (let i = 0; i <= timeTable.length - 1; i++) {
            // console.log(timeTable[i].classNumber);
            // console.log(this.state.currentClass);
            if (timeTable[i].classNumber !== this.state.currentClass) {
                // console.log(timeTable[i]);
                for (let j = 0; j <= timeTable[i].days.length - 1; j++) {
                    if (timeTable[i].days[j].day === day) {
                        // console.log(timeTable[i].days[j]);
                        for (let k = 0; k <= timeTable[i].days[j].hours.length - 1; k++) {
                            if (timeTable[i].days[j].hours[k].hour === hour) {
                                // console.log(timeTable[i].days[j].hours[k])
                                // console.log(timeTable[i].days[j].hours[k].constraints.length);
                                // if (timeTable[i].days[j].hours[k].constraints.length === 0) {
                                //     canBeAdded = true;
                                // }
                                // else {
                                    for (let l = 0; l <= timeTable[i].days[j].hours[k].constraints.length - 1; l++) {
                                        if(timeTable[i].days[j].hours[k].constraints[l].teacher === constraint.teacher){
                                            message = "the teacher " + timeTable[i].days[j].hours[k].constraints[l].teacher + ' teach alrady at the same time: day: ' + day + ' hour: ' + hour +' in class: ' + timeTable[i].classNumber;
                                            console.log(message);
                                            return false;
                                        }
                                    }
                                // }
                            }
                        }
                    }
                }
            }
        }
        return canBeAdded;
    }

    handleHourClick(hourData, day) {
        console.log(day);
        console.log(hourData);
        this.setState({ currentHourBox: { ...hourData }, currentDay: day }, function () {
            // console.log(this.state.currentHourBox);
            // console.log(this.state.currentDay);
        });
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
                        {this.createBoxesForDay('ראשון', 0)}
                    </div>
                    <div className="col-2 border border-dark text-center" value='שני'>שני
                        {this.createBoxesForDay('שני', 1)}
                    </div>
                    <div className="col-2 border border-dark text-center" value='שלישי'>שלישי
                        {this.createBoxesForDay('שלישי', 2)}
                    </div>
                    <div className="col-2 border border-dark text-center" value='רביעי'>רביעי
                        {this.createBoxesForDay('רביעי', 3)}
                    </div>
                    <div className="col-2 border border-dark text-center" value='חמישי'>חמישי
                        {this.createBoxesForDay('חמישי', 4)}
                    </div>
                    <div className="col-2 border border-dark text-center" value='שישי'>שישי
                        {this.createBoxesForDay('שישי', 5)}
                    </div>
                </div>
            </div>
        );
    }

    createClassRoomBoxes() {
        let classRoomsBoxes = [];
        let classRooms = [...this.state.classRoomsView];
        for (let i = 0; i <= classRooms.length - 1; i++) {
            classRoomsBoxes = [...classRoomsBoxes,
            <ClassRoomBox
                key={i}
                data={classRooms[i]}
                click={this.handleClassRoomClick}
                currentClassRoom={this.state.currentClassRoom}>
            </ClassRoomBox>
            ]
        }

        return classRoomsBoxes;
    }

    handleClassRoomClick(classRoomData) {
        if (JSON.stringify(classRoomData) === JSON.stringify(this.state.currentClassRoom)) {
            this.setState({ currentClassRoom: {} }, function () {
                // console.log(this.state.currentClassRoom);
            });
        } else {
            this.setState({ currentClassRoom: { ...classRoomData } }, function () {
                // console.log(this.state.currentClassRoom);
            });
        }
    }

    createConstraintsBoxes() {
        let classConstraintsBoxes = [];
        let classConstraints = [...this.state.classConstraints];
        for (let i = 0; i <= classConstraints.length - 1; i++) {
            classConstraintsBoxes = [...classConstraintsBoxes,
            <ConstraintBox
                key={i}
                data={classConstraints[i]}
                currentConstraint={this.state.currentConstraint}
                click={this.handleConstraintClick}>
            </ConstraintBox>
            ]
        }

        return classConstraintsBoxes;
    }

    handleConstraintClick(constraintData) {
        if (JSON.stringify(constraintData) === JSON.stringify(this.state.currentConstraint)) {
            this.setState({ currentConstraint: {} }, function () {
                // console.log(this.state.currentConstraint);
                this.setClassRoomForLesson();
            });
        } else {
            this.setState({ currentConstraint: { ...constraintData } }, function () {
                // console.log(this.state.currentConstraint);
                this.setClassRoomForLesson();

            });
        }
        // this.setClassRoomForLesson();

    }

    setClassRoomForLesson() {
        if (this.objectEmpty(this.state.currentConstraint)) {
            this.setState({ classRoomsView: [...this.state.classRooms] });
            return;
        }
        // console.log(this.state.currentConstraint.subjectFeatures.length === 0);
        if (this.state.currentConstraint.subjectFeatures.length === 0) {
            this.setState({ classRoomsView: [...this.state.classRooms] });
            return;
        }
        let classRooms = [...this.state.classRooms];
        let classRoomsView = [];
        let subjectFeatures = [...this.state.currentConstraint.subjectFeatures];
        outerLoop:
        for (let i = 0; i <= classRooms.length - 1; i++) {
            for (let j = 0; j <= classRooms[i].classRoomFeatures.length - 1; j++) {
                for (let k = 0; k <= subjectFeatures.length - 1; k++) {
                    if (subjectFeatures[k] === classRooms[i].classRoomFeatures[j]) {
                        classRoomsView = [...classRoomsView, classRooms[i]];
                        continue outerLoop;
                    }
                }
            }
        }
        this.setState({ classRoomsView: [...classRoomsView] });
    }

    addConstraintToHour() {
        // console.log(this.state.currentConstraint);
        // console.log(this.state.currentHourBox);

        if (this.objectEmpty(this.state.currentConstraint) || this.objectEmpty(this.state.currentHourBox)) {
            console.log('constraint or hour not checked');
            return;
        }
        let currentHourBox = { ...this.state.currentHourBox };
        let currentConstraint = { ...this.state.currentConstraint };
        currentHourBox.constraints = [...currentHourBox.constraints, currentConstraint];
        this.setState({ currentHourBox: { ...currentHourBox } }, function () {
            console.log(this.state.currentHourBox);
            this.addHourToTableView(this.state.currentClass);
        })
        console.log('its ok to add constraint to hour');
    }

    addHourToTableView(classNumber) {
        let tableViewForClass = {};
        if (classNumber !== this.state.classNumber) {
            tableViewForClass = { ...this.setTableViewForClass(classNumber) };
        } else {
            tableViewForClass = { ...this.state.tableViewForClass };
        }
        let currentHourBox = { ...this.state.currentHourBox };
        let currentDay = this.state.currentDay;
        for (let i = 0; i <= tableViewForClass.days.length - 1; i++) {
            if (tableViewForClass.days[i].day === currentDay) {
                for (let j = 0; j <= tableViewForClass.days[i].hours.length - 1; j++) {
                    if (tableViewForClass.days[i].hours[j].hour === currentHourBox.hour) {
                        // console.log(this.state.currentConstraint.hours);
                        for (let k = 0; k <= parseInt(this.state.currentConstraint.hours) - 1; k++) {
                            // console.log(tableViewForClass.days[i].hours[j + k])
                            tableViewForClass.days[i].hours[j + k].constraints = [...currentHourBox.constraints];
                        }
                        tableViewForClass.days[i].hours[j] = { ...currentHourBox };
                        this.setState({
                            tableViewForClass: { ...tableViewForClass },
                            currentHourBox: {},
                            currentConstraint: {},
                            currentDay: ''
                        },
                            // console.log(this.state.tableViewForClass)
                        );
                        return;
                    }
                }
            }
        }
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
                    <div className="col-5">
                        <div
                            className="d-inline-block w-100  text-right p-0 card"
                            style={{ "position": "relative", "height": "400px", "overflow": "auto", "display": "block" }}>
                            <h6 className="text-center">שיעורים עבור כיתה זו</h6>
                            {this.createConstraintsBoxes()}
                        </div>
                    </div>
                    <div className="col-5">
                        <div className="w-100 h-100 text-right p-0 card">
                            <button onClick={() => this.addConstraintToHour()} >ADD</button>
                        </div>
                    </div>
                    <div className="col-2">
                        <div
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