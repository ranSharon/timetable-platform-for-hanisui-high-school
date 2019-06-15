import React, { Component } from 'react';
import axios from 'axios';
import HourBox from './buildTimetableContainers/hourBox';
import ClassRoomBox from './buildTimetableContainers/classRoomBox';
import ConstraintBox from './buildTimetableContainers/constraintBox';
import DragConstraintBox from './buildTimetableContainers/dragConstraintBox';


import { DragDropContext } from 'react-dnd';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
// import withScrolling from 'react-dnd-scrollzone';

// const ScrollingComponent = withScrolling('div');

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
            classConstraintsView: [],

            timeTable: [],

            days: [],
            classRooms: [],
            grades: [],
            teachers: [],

            inTable: false,
            row: -1,
            col: -1,

            showDeleteButton: false,

            backgroundColorSunday: 'white',
            backgroundColorMonday: 'white',
            backgroundColorTuesday: 'white',
            backgroundColorWednesday: 'white',
            backgroundColorThursday: 'white',
            backgroundColorFriday: 'white'
        }

        this.handleConstraintClick = this.handleConstraintClick.bind(this);
        this.handleHourClick = this.handleHourClick.bind(this);
        this.handleClassRoomClick = this.handleClassRoomClick.bind(this);
        this.handleConstraintDrag = this.handleConstraintDrag.bind(this);
        this.addConstraintToHour = this.addConstraintToHour.bind(this);
        this.handleConstraintEndDrag = this.handleConstraintEndDrag.bind(this);
        this.handleDragConstraintClick = this.handleDragConstraintClick.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
        axios.get('http://localhost:4000/data/getConstraints')
            .then(response => {
                if (this.mounted) {
                    this.setState({ constraints: [...response.data] }, function () {
                        axios.get('http://localhost:4000/data/getDays')
                            .then(response => {
                                if (this.mounted) {
                                    this.setState({ days: [...response.data] }, function () {
                                        axios.get('http://localhost:4000/data/getGrades')
                                            .then(response => {
                                                if (this.mounted) {
                                                    this.setState({ grades: [...response.data.sort(this.compareGrade)] }, function () {
                                                        this.initTimeTable();
                                                    });
                                                }
                                                console.log('grades:')
                                                console.log(this.state.grades);
                                            })
                                            .catch(function (error) {
                                                console.log(error);
                                            });
                                    });
                                }
                                console.log('days:')
                                console.log(this.state.days);
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    });
                }
                console.log('constraints:')
                console.log(this.state.constraints);
            })
            .catch(function (error) {
                console.log(error);
            });
        axios.get('http://localhost:4000/data/getClassRooms')
            .then(response => {
                if (this.mounted) {
                    this.setState({ classRooms: [...response.data], classRoomsView: [...response.data] });
                }
                console.log('classRooms:')
                console.log(this.state.classRooms);
            })
            .catch(function (error) {
                console.log(error);
            });
        axios.get('http://localhost:4000/data/getTeachers')
            .then(response => {
                if (this.mounted) {
                    this.setState({ teachers: [...response.data] });
                }
                console.log('teachers:')
                console.log(this.state.teachers);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    componentWillUnmount() {
        this.mounted = false;
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log('componentDidUpdate');
        // console.log(this.state.tableViewForClass);
        // console.log(this.state.inTable);
        // if (this.state.inTable && prevProps.inTable === this.state.inTable) {
        //     this.setState({inTable : false});
        // }

    }

    initTimeTable() {
        axios.get('http://localhost:4000/data/getTimeTable')
            .then(response => {
                if (response.data.length > 0) {
                    this.setState({ timeTable: [...response.data] }, function () {
                        console.log('timeTable');
                        console.log(this.state.timeTable);
                    });
                }
                else {
                    let grades = [...this.state.grades];
                    let days = [...this.state.days];
                    let timeTable = [...this.state.timeTable];
                    for (let i = 0; i <= grades.length - 1; i++) {
                        for (let j = 1; j <= grades[i].numOfClasses; j++) {
                            let tableViewForClass = { classNumber: grades[i].grade + j, days: [], constaraintsToAdd: [...this.setConstaraintsToAdd(grades[i].grade + j)] };
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
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    setConstaraintsToAdd(classNumber) {
        let constraints = [...this.state.constraints];
        let constaraintsToAdd = [];
        let constaraintsInTable = [];
        for (let i = 0; i <= constraints.length - 1; i++) {
            for (let j = 0; j <= constraints[i].classNumber.length; j++) {
                if (classNumber === constraints[i].classNumber[j]) {
                    constaraintsToAdd = [...constaraintsToAdd, constraints[i]];
                }
            }
        }
        return constaraintsToAdd;
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
        if (this.state.timeTable.length === 0) {
            return;
        }
        this.setState({
            currentClass: classNumber,
            currentConstraint: {},
            currentClassRoom: {},
            inTable: false,
            row: -1,
            col: -1,
            showDeleteButton: false
        }, function () {
            this.setDayOf()
            let tableViewForClass = { ...this.setTableViewForClass(classNumber) };
            this.setState({ tableViewForClass: tableViewForClass }, function () {
                let classConstraints = [...tableViewForClass.constaraintsToAdd];
                this.setState({ classConstraints: [...classConstraints] }, function () {
                    this.setState({ classConstraintsView: [...this.state.classConstraints] }, function () {
                        this.setConstraintsView();
                    })
                });
            })
        });

    }

    setConstraintsView() {
        // remove constraints that exsist in timetableView of class number from the constraintsView
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
        let days = [...this.state.tableViewForClass.days];
        for (let i = 0; i <= days.length - 1; i++) {
            if (days[i].day === day) {
                dayView = { ...days[i] };
                break;
            }
        }

        let hoursBoxes = [];
        let prvConstraints = ''; // if lesson is more then an hour i want to check it and not showing all lesson hours boxes 
        let show = true; // // if a box while br shown
        let validToAdd = true; // if box is green or red
        let currentConstraintEmpty = true; // if no constriant is chosee in this component then box lavan
        let data = {};

        let first = true // when edeting we use this flag  
        let dummy = false;
        for (let i = 0; i <= dayView.hours.length - 1; i++) {
            if (i === 0 && col === 0) {
                // console.log('start:')
            }
            if (dayView.hours[i].constraints.length > 0) {
                validToAdd = false;
                if (prvConstraints === JSON.stringify(dayView.hours[i].constraints[0])) {
                    show = false;
                }
            } else if (!this.objectEmpty(this.state.currentConstraint) && !this.objectEmpty(this.state.currentClassRoom)) {
                if (this.state.currentConstraint.subjectMix) {
                    validToAdd = (this.checkOtherConstraintsInGrage(day, dayView.hours[i].hour, dayView.hours[dayView.hours.length - 1].hour, this.state.currentConstraint) &&
                        this.checkOtherConstraintsInTable(day, dayView.hours[i].hour, dayView.hours[dayView.hours.length - 1].hour, this.state.currentConstraint) &&
                        this.chekTeacherOtherDays(day, dayView.hours[i].hour, dayView.hours[dayView.hours.length - 1].hour, this.state.currentConstraint) &&
                        this.checkClassRoomsOtherDays(day, dayView.hours[i].hour, this.state.currentClassRoom));
                } else {
                    validToAdd = (this.checkOtherConstraintsInTable(day, dayView.hours[i].hour, dayView.hours[dayView.hours.length - 1].hour, this.state.currentConstraint) &&
                        this.chekTeacherOtherDays(day, dayView.hours[i].hour, dayView.hours[dayView.hours.length - 1].hour, this.state.currentConstraint) &&
                        this.checkClassRoomsOtherDays(day, dayView.hours[i].hour, this.state.currentClassRoom));
                }
                currentConstraintEmpty = false;
            } else if (!this.objectEmpty(this.state.currentConstraint)) {
                if (this.state.currentConstraint.subjectMix) {
                    validToAdd = (this.checkOtherConstraintsInGrage(day, dayView.hours[i].hour, dayView.hours[dayView.hours.length - 1].hour, this.state.currentConstraint) &&
                        this.checkOtherConstraintsInTable(day, dayView.hours[i].hour, dayView.hours[dayView.hours.length - 1].hour, this.state.currentConstraint) &&
                        this.chekTeacherOtherDays(day, dayView.hours[i].hour, dayView.hours[dayView.hours.length - 1].hour, this.state.currentConstraint));
                } else {
                    validToAdd = (this.checkOtherConstraintsInTable(day, dayView.hours[i].hour, dayView.hours[dayView.hours.length - 1].hour, this.state.currentConstraint) &&
                        this.chekTeacherOtherDays(day, dayView.hours[i].hour, dayView.hours[dayView.hours.length - 1].hour, this.state.currentConstraint));
                }
                currentConstraintEmpty = false;
            } else if (!this.objectEmpty(this.state.currentClassRoom)) {
                validToAdd = this.checkClassRoomsOtherDays(day, dayView.hours[i].hour, this.state.currentClassRoom);
                currentConstraintEmpty = false;
            }

            data = { ...dayView.hours[i] };

            if (this.state.inTable && this.state.row === i && this.state.col === col) {
                data.constraints = [...data.constraints, this.state.currentConstraint];
            }

            hoursBoxes = [...hoursBoxes,
            <HourBox
                key={i} // must have for react
                show={show} // if a box while or shown
                validToAdd={validToAdd} // if box is green or red
                day={day} // 
                data={data} // data about box from timetable, inclulde hour time and lessons array
                // data={dayView.hours[i]} // data about box from timetable, inclulde hour time and lessons array
                endHour={dayView.hours[dayView.hours.length - 1].hour} // the end time of currnt hour box
                // endHour={dayView.hours[dayView.hours.length - 1].hour} // the end time of currnt hour box
                currentConstraintEmpty={currentConstraintEmpty} // if no constriant is chosee in this component then box lavan
                row={i} // num of row of box in table - i am not using this info at the app
                col={col} // num of col of box in table - i am not using this info at the app
                click={this.handleDragConstraintClick}

                drop={this.addConstraintToHour} // event for droping lesson in this box
                hover={this.handleHourClick} // change color or box when hover and also valid to add

                drag={this.handleConstraintDrag} // event for draging a constraint that are in hour box 
                endDrag={this.handleConstraintEndDrag} // event for end draging a constraint that are in hour box 
            >
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

    checkOtherConstraintsInGrage(day, hour, endofDay, constraint) {
        let canBeAdded = true;
        let lessonHours = parseInt(constraint.hours);
        let grade = '';
        let currentClass = this.state.currentClass;
        if (currentClass.length === 2) {
            grade = currentClass[0];
        } else if (currentClass.length === 3) {
            grade = currentClass[0] + currentClass[1];
        }
        let numOfClasses = 0;
        let grades = [...this.state.grades];
        for (let i = 0; i <= grades.length - 1; i++) {
            if (grades[i].grade === grade) {
                numOfClasses = parseInt(grades[i].numOfClasses);
                break;
            }
        }
        let message = '';
        let timeTable = [...this.state.timeTable];

        for (let i = 1; i <= numOfClasses; i++) {
            for (let j = 0; j <= timeTable.length - 1; j++) {
                if (timeTable[j].classNumber === (grade + i)) {
                    for (let k = 0; k <= timeTable[j].days.length - 1; k++) {
                        if (timeTable[j].days[k].day === day) {
                            for (let l = 0; l <= timeTable[j].days[k].hours.length - 1; l++) {
                                if (timeTable[j].days[k].hours[l].hour === hour) {
                                    if (timeTable[j].days[k].hours[l].constraints.length > 0) {
                                        return false;
                                    } else if (timeTable[j].days[k].hours[l].hour + (lessonHours - 1) <= endofDay) {
                                        if (timeTable[j].days[k].hours[l + lessonHours - 1].constraints.length > 0) {
                                            return false;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return canBeAdded;
    }

    checkOtherConstraintsInTable(day, hour, endofDay, constraint) {
        let canBeAdded = true;
        let lessonHours = parseInt(constraint.hours);
        if (lessonHours + (hour - 1) > endofDay) {
            return false
        }

        let message = '';
        let timeTableView = { ...this.state.tableViewForClass };

        for (let j = 0; j <= timeTableView.days.length - 1; j++) {
            if (timeTableView.days[j].day === day) {
                for (let k = 0; k <= timeTableView.days[j].hours.length - 1; k++) {
                    if (timeTableView.days[j].hours[k].hour === hour) {
                        if (timeTableView.days[j].hours[k].hour + (lessonHours - 1) <= endofDay) {
                            for (let m = 1; m <= lessonHours; m++) {
                                if (timeTableView.days[j].hours[k + m - 1].constraints.length > 0) {
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        }
        return canBeAdded;
    }


    chekTeacherOtherDays(day, hour, endofDay, constraint) {
        let canBeAdded = true;
        let lessonHours = parseInt(constraint.hours);
        let message = '';
        let timeTable = [...this.state.timeTable];

        for (let i = 0; i <= timeTable.length - 1; i++) {
            if (timeTable[i].classNumber !== this.state.currentClass) {
                for (let j = 0; j <= timeTable[i].days.length - 1; j++) {
                    if (timeTable[i].days[j].day === day) {
                        for (let k = 0; k <= timeTable[i].days[j].hours.length - 1; k++) {
                            if (timeTable[i].days[j].hours[k].hour === hour) {
                                for (let l = 0; l <= timeTable[i].days[j].hours[k].constraints.length - 1; l++) {
                                    if (timeTable[i].days[j].hours[k].constraints[l].teacher === constraint.teacher) {
                                        message = "the teacher " + timeTable[i].days[j].hours[k].constraints[l].teacher + ' teach alrady at the same time: day: ' + day + ' hour: ' + hour + ' in class: ' + timeTable[i].classNumber;
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return canBeAdded;
    }

    checkClassRoomsOtherDays(day, hour, classRoom) {
        let canBeAdded = true;

        let message = '';
        let timeTable = [...this.state.timeTable];

        for (let i = 0; i <= timeTable.length - 1; i++) {
            if (timeTable[i].classNumber !== this.state.currentClass) {
                for (let j = 0; j <= timeTable[i].days.length - 1; j++) {
                    if (timeTable[i].days[j].day === day) {
                        for (let k = 0; k <= timeTable[i].days[j].hours.length - 1; k++) {
                            if (timeTable[i].days[j].hours[k].hour === hour) {
                                for (let l = 0; l <= timeTable[i].days[j].hours[k].constraints.length - 1; l++) {
                                    if (timeTable[i].days[j].hours[k].constraints[l].classRoom === classRoom.classRoomName) {
                                        message = "the class  " + classRoom.classRoomName + ' is uesd in day: ' + day + ' ,at class: ' + timeTable[i].classNumber + ' ,at time: ' + timeTable[i].days[j].hours[k].hour;
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return canBeAdded;
    }

    handleHourClick(hourData, day) {

    }

    createTimeTableView() {
        return (
            <div className="row m-0">
                <div className="col col-1 border border-dark text-center" value='שעות'>שעות
                {this.createTimeCol()}
                </div>
                <div className="col-11 row">
                    <div className="col col-2 border border-dark text-center" style={{ "backgroundColor": this.state.backgroundColorSunday }} value='ראשון'>ראשון
                        {this.createBoxesForDay('ראשון', 0)}
                    </div>
                    <div className="col-2 border border-dark text-center" style={{ "backgroundColor": this.state.backgroundColorMonday }} value='שני'>שני
                        {this.createBoxesForDay('שני', 1)}
                    </div>
                    <div className="col-2 border border-dark text-center" style={{ "backgroundColor": this.state.backgroundColorTuesday }} value='שלישי'>שלישי
                        {this.createBoxesForDay('שלישי', 2)}
                    </div>
                    <div className="col-2 border border-dark text-center" style={{ "backgroundColor": this.state.backgroundColorWednesday }} value='רביעי'>רביעי
                        {this.createBoxesForDay('רביעי', 3)}
                    </div>
                    <div className="col-2 border border-dark text-center" style={{ "backgroundColor": this.state.backgroundColorThursday }} value='חמישי'>חמישי
                        {this.createBoxesForDay('חמישי', 4)}
                    </div>
                    <div className="col-2 border border-dark text-center" style={{ "backgroundColor": this.state.backgroundColorFriday }} value='שישי'>שישי
                        {this.createBoxesForDay('שישי', 5)}
                    </div>
                </div>
            </div>
        );
    }

    createTimeCol() {
        let maxEndTime = 0;
        let minStartTime = 100;
        let days = [...this.state.days];
        for (let i = 0; i <= days.length - 1; i++) {
            if (maxEndTime < parseInt(days[i].endTime)) {
                maxEndTime = parseInt(days[i].endTime);
            }
            if (minStartTime > parseInt(days[i].startTime)) {
                minStartTime = parseInt(days[i].startTime);
            }
        }
        let TimeCol = [];
        for (let i = minStartTime; i < maxEndTime; i++) {
            let time = i + ':00-' + (i + 1) + ':00';
            TimeCol = [...TimeCol,
            <div key={i} className="row  border-top border-dark text-center" style={{ "height": "50px" }}>{time}</div>
            ];
        }
        return TimeCol;
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
            });
        } else {
            this.setState({ currentClassRoom: { ...classRoomData } }, function () {
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
                click={this.handleConstraintClick}
            >
            </ConstraintBox>
            ]
        }

        return classConstraintsBoxes;
    }

    handleConstraintClick(constraintData) {
        if (JSON.stringify(constraintData) === JSON.stringify(this.state.currentConstraint)) {
            this.setState({ currentConstraint: {} }, function () {
                this.setDayOf();
                this.setClassRoomForLesson();
            });
        } else {
            this.setState({ currentConstraint: { ...constraintData } }, function () {
                this.setDayOf();
                this.setClassRoomForLesson();
            });
        }
    }

    handleDragConstraintClick(inTable, constraint, classRoom) {
        if (!inTable) {
            return;
        }
        let classRooms = [...this.state.classRooms];
        let currentClassRoom = {};
        for (let i = 0; i <= classRooms.length - 1; i++) {
            if (classRooms[i].classRoomName === classRoom) {
                currentClassRoom = { ...classRooms[i] };
            }
        }
        if (JSON.stringify(constraint) === JSON.stringify(this.state.currentConstraint)) {
            this.setState({
                currentConstraint: {},
                currentClassRoom: {},
                showDeleteButton: false
            }, function () {
                this.setDayOf()
            });
        } else {
            this.setState({
                currentConstraint: { ...constraint },
                currentClassRoom: { ...currentClassRoom },
                showDeleteButton: true
            }, function () {
                this.setDayOf()
            });
        }
    }

    handleConstraintDrag(inTable, constraint, classRoom, row, col) {
        let classRooms = [...this.state.classRooms];
        let currentClassRoom = {};
        for (let i = 0; i <= classRooms.length - 1; i++) {
            if (classRooms[i].classRoomName === classRoom) {
                currentClassRoom = { ...classRooms[i] };
            }
        }

        let timeTable = [...this.state.timeTable];
        let hours = parseInt(constraint.hours);
        for (let i = 0; i <= timeTable.length - 1; i++) {
            for (let j = 0; j <= timeTable[i].days.length - 1; j++) {
                for (let k = 0; k <= timeTable[i].days[j].hours.length - 1; k++) {
                    if (timeTable[i].days[j].hours[k].constraints.length > 0) {
                        for (let l = 0; l <= timeTable[i].days[j].hours[k].constraints.length - 1; l++) {
                            if (timeTable[i].days[j].hours[k].constraints[l]._id === constraint._id) {
                                timeTable[i].days[j].hours[k].constraints = [...timeTable[i].days[j].hours[k].constraints.slice(0, l).concat(timeTable[i].days[j].hours[k].constraints.slice(l + 1, timeTable[i].days[j].hours[k].constraints.length))];


                            }
                        }

                    }


                }
            }
        }

        let tableViewForClass = {};
        for (let i = 0; i <= timeTable.length - 1; i++) {
            if (timeTable[i].classNumber === this.state.currentClass) {
                tableViewForClass = { ...timeTable[i] };
            }
        }
        this.setState({
            inTable: true,
            row: row,
            col: col,
            currentConstraint: { ...constraint },
            currentClassRoom: { ...currentClassRoom },
            timeTable: [...timeTable],
            tableViewForClass: { ...tableViewForClass }
        }, function () {
            this.setDayOf()
        });
    }

    handleConstraintEndDrag(didDrop) {
        if (!this.state.inTable) {
            return;
        }
        this.setState({ inTable: false }, function () {
            if (!didDrop) {
                this.returnConstraintToOriginalHourBox();
            }
        });
    }

    returnConstraintToOriginalHourBox() {
        let tableViewForClass = { ...this.state.tableViewForClass };
        // console.log(this.state.row); // hour
        // console.log(this.state.col); // day
        // console.log(tableViewForClass); // day
        let day = ''
        let hourData = {};
        switch (this.state.col) {
            case 0:
                day = 'ראשון';
                break;
            case 1:
                day = 'שני';
                break;
            case 2:
                day = 'שלישי';
                break;
            case 3:
                day = 'רביעי';
                break;
            case 4:
                day = 'חמישי';
                break;
            case 5:
                day = 'שישי';
                break;
        }

        outerLoop:
        for (let i = 0; i <= tableViewForClass.days.length - 1; i++) {
            if (tableViewForClass.days[i].day === day) {
                hourData = { ...tableViewForClass.days[i].hours[this.state.row] };
                break outerLoop;
            }
        }
        // console.log(day);
        // console.log(hourData);
        this.addConstraintToHour(hourData, day);
    }

    setDayOf() {
        if (this.objectEmpty(this.state.currentConstraint)) {
            this.setState({
                backgroundColorSunday: 'white',
                backgroundColorMonday: 'white',
                backgroundColorTuesday: 'white',
                backgroundColorWednesday: 'white',
                backgroundColorThursday: 'white',
                backgroundColorFriday: 'white'
            });
        }
        this.setState({
            backgroundColorSunday: 'white',
            backgroundColorMonday: 'white',
            backgroundColorTuesday: 'white',
            backgroundColorWednesday: 'white',
            backgroundColorThursday: 'white',
            backgroundColorFriday: 'white'
        }, function () {
            let teachers = this.state.teachers;
            let teacher = this.state.currentConstraint.teacher;
            let teacherDayOf = '';
            for (let i = 0; i <= teachers.length - 1; i++) {
                if (teachers[i].name === teacher) {
                    teacherDayOf = teachers[i].dayOff;
                    break;
                }
            }
            switch (teacherDayOf) {
                case 'ראשון':
                    this.setState({ backgroundColorSunday: '#fff3cd' })
                    break;
                case 'שני':
                    this.setState({ backgroundColorMonday: '#fff3cd' })
                    break;
                case 'שלישי':
                    this.setState({ backgroundColorTuesday: '#fff3cd' })
                    break;
                case 'רביעי':
                    this.setState({ backgroundColorWednesday: '#fff3cd' })
                    break;
                case 'חמישי':
                    this.setState({ backgroundColorThursday: '#fff3cd' })
                    break;
                case 'שישי':
                    this.setState({ backgroundColorFriday: '#fff3cd' })
                    break;
            }
        });


    }


    setClassRoomForLesson() {
        if (this.objectEmpty(this.state.currentConstraint)) {
            this.setState({ classRoomsView: [...this.state.classRooms] });
            return;
        }
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
        this.setState({ classRoomsView: [...classRoomsView], currentClassRoom: { ...classRoomsView[0] } });
    }

    addConstraintToHour(hourData, day, row, col) {
        // console.log(hourData);
        // console.log(this.state.currentConstraint);
        // console.log(day);

        let currentHourBox = { ...hourData };
        for (let i = 0; i <= currentHourBox.constraints.length - 1; i++) {
            if (currentHourBox.constraints[i]._id === this.state.currentConstraint._id) {
                currentHourBox.constraints = [...currentHourBox.constraints.slice(0, i).concat(currentHourBox.constraints.slice(i + 1, currentHourBox.constraints.length))];
                break;
            }
        }

        this.setState({ currentHourBox: { ...currentHourBox }, currentDay: day, showDeleteButton: false }, function () {
            let currentConstraint = { ...this.state.currentConstraint };
            let classConstraints = [...this.state.classConstraints];
            for (let i = 0; i <= classConstraints.length - 1; i++) {
                if (currentConstraint._id === classConstraints[i]._id) {
                    classConstraints = [...classConstraints.slice(0, i).concat(classConstraints.slice(i + 1, classConstraints.length))];
                    break;
                }
            }

            if (this.objectEmpty(this.state.currentConstraint) || this.objectEmpty(this.state.currentHourBox)) {
                return;
            }

            let currentHourBox = { ...this.state.currentHourBox };
            let classRoom = this.state.currentClassRoom.classRoomName;
            currentConstraint.classRoom = classRoom;
            currentHourBox.constraints = [...currentHourBox.constraints, currentConstraint];
            this.setState({
                inTable: false,
                currentHourBox: { ...currentHourBox },
                currentConstraint: currentConstraint,
                currentClassRoom: {},
                classConstraints: classConstraints,
                row: -1,
                col: -1
            },
                function () {
                    this.setDayOf();
                    if (this.state.currentConstraint.subjectMix) {
                        let grade = '';
                        let currentClass = this.state.currentClass;
                        if (currentClass.length === 2) {
                            grade = currentClass[0];
                        } else if (currentClass.length === 3) {
                            grade = currentClass[0] + currentClass[1];
                        }
                        let numOfClasses = 0;
                        let grades = [...this.state.grades];
                        for (let i = 0; i <= grades.length - 1; i++) {
                            if (grades[i].grade === grade) {
                                numOfClasses = parseInt(grades[i].numOfClasses);
                                break;
                            }
                        }
                        let timeTableViews = [];
                        for (let i = 1; i <= numOfClasses; i++) {
                            let timeTableView = { ...this.addHourToTableView((grade + i), this.state.currentConstraint) };
                            timeTableViews = [...timeTableViews, this.addHourToTableView((grade + i), this.state.currentConstraint)];
                            // console.log(timeTableView);
                        }
                        let timeTable = [...this.state.timeTable];
                        for (let i = 0; i <= timeTableViews.length - 1; i++) {
                            for (let j = 0; j <= timeTable.length - 1; j++) {
                                if (timeTable[j].classNumber === timeTableViews[i].classNumber) {
                                    timeTable[j] = { ...timeTableViews[i] };
                                }
                            }
                        }
                        // console.log(timeTable);
                        this.setState({ timeTable: [...timeTable] });
                    } else {
                        let timeTableView = { ...this.addHourToTableView(this.state.currentClass, this.state.currentConstraint) };
                        let timeTable = [...this.state.timeTable];

                        for (let j = 0; j <= timeTable.length - 1; j++) {
                            if (timeTable[j].classNumber === timeTableView.classNumber) {
                                timeTable[j] = { ...timeTableView };
                            }
                        }
                        this.setState({ timeTable: [...timeTable] });
                    }
                })
        });
    }

    addHourToTableView(classNumber, constaraint) {
        let tableViewForClass = {};
        if (classNumber !== this.state.classNumber) { // condition for mix lesson
            tableViewForClass = { ...this.setTableViewForClass(classNumber) };
        } else {
            tableViewForClass = { ...this.state.tableViewForClass };
        }
        let constaraintsToAdd = [...tableViewForClass.constaraintsToAdd];
        for (let i = 0; i <= constaraintsToAdd.length - 1; i++) {
            if (constaraint._id === constaraintsToAdd[i]._id) {
                constaraintsToAdd = [...constaraintsToAdd.slice(0, i).concat(constaraintsToAdd.slice(i + 1, constaraintsToAdd.length))];
                tableViewForClass.constaraintsToAdd = [...constaraintsToAdd];
                break;
            }
        }

        let currentHourBox = { ...this.state.currentHourBox };
        let currentDay = this.state.currentDay;
        for (let i = 0; i <= tableViewForClass.days.length - 1; i++) {
            if (tableViewForClass.days[i].day === currentDay) {
                for (let j = 0; j <= tableViewForClass.days[i].hours.length - 1; j++) {
                    if (tableViewForClass.days[i].hours[j].hour === currentHourBox.hour) {
                        for (let k = 0; k <= parseInt(this.state.currentConstraint.hours) - 1; k++) {
                            tableViewForClass.days[i].hours[j + k].constraints = [...currentHourBox.constraints];
                        }
                        tableViewForClass.days[i].hours[j] = { ...currentHourBox };
                        if (classNumber === this.state.currentClass) {
                            this.setState({
                                tableViewForClass: { ...tableViewForClass },
                                currentHourBox: {},
                                currentConstraint: {},
                                currentDay: ''
                            }, function () {
                                this.setDayOf();
                            });
                        }
                        return tableViewForClass;
                    }
                }
            }
        }
    }

    createPotential() {
        return (
            <div className="text-center mb-3">
                {this.crateConstraintBoxAndClassRoomBox()}
            </div>
        );
    }

    cratePotentialLesson() {
        if (this.state.buttonType === 'צור שיעור לשיבוץ') {
            return null;
        } else {
            return <div>lesson that can be drag</div>
        }
    }

    crateConstraintBoxAndClassRoomBox() {
        if (this.objectEmpty(this.state.currentConstraint)) {
            return <h6>אנא בחר שיעור מתוך רשימת השיעורים עבור כיתה זו</h6>;
        } else if (this.objectEmpty(this.state.currentClassRoom)) {
            return (
                <div>
                    <h6>כעת בחר חדר לימוד עבור שיעור זה</h6>
                    <div>
                        <ConstraintBox
                            data={this.state.currentConstraint}
                            currentConstraint={this.state.currentConstraint}
                            click={this.handleConstraintClick}
                        >
                        </ConstraintBox>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <h6>יש כעת אפשרות לגרור את השיעור לטובת שיבוץ בטבלה</h6>
                    <div>
                        <DragConstraintBox
                            data={this.state.currentConstraint}
                            currentConstraint={this.state.currentConstraint}
                            click={this.handleDragConstraintClick}
                            drag={this.handleConstraintDrag}
                            endDrag={this.handleConstraintEndDrag}
                            classRoom={this.state.currentClassRoom.classRoomName}
                            inTable={false}
                        >
                        </DragConstraintBox>
                    </div>
                    <div>
                        <h6>{'חדר הלימוד שנבחר עבור שיעור זה: ' + this.state.currentClassRoom.classRoomName}</h6>
                    </div>
                </div>
            );
        }
    }

    addTimeTable() {
        let timeTable = [...this.state.timeTable];
        let classTimeTable = {};
        axios.post('http://localhost:4000/data/dropTimeTable')
            .then(response => {
                for (let i = 0; i <= timeTable.length - 1; i++) {
                    classTimeTable = { ...timeTable[i] };
                    // console.log(classTimeTable);
                    axios.post('http://localhost:4000/data/addTimeTable', classTimeTable)
                        .then(res => {
                            // classRoom = { ...res.data };
                            // console.log(res.data);
                        });
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    deleteConstraintFromTable() {
        if (this.state.showDeleteButton) {
            return (
                <button type="button" className="btn btn-secondary" onClick={() => this.removeConstraint()}>הסר שיעור</button>
            );
        } else {
            return null;
        }

    }

    removeConstraint() {
        let timeTable = [...this.state.timeTable];
        for (let i = 0; i <= timeTable.length - 1; i++) {
            for (let j = 0; j <= timeTable[i].days.length - 1; j++) {
                for (let k = 0; k <= timeTable[i].days[j].hours.length - 1; k++) {
                    if (timeTable[i].days[j].hours[k].constraints.length > 0) {
                        for (let l = 0; l <= timeTable[i].days[j].hours[k].constraints.length - 1; l++) {
                            if (timeTable[i].days[j].hours[k].constraints[l]._id === this.state.currentConstraint._id) {
                                timeTable[i].days[j].hours[k].constraints = [...timeTable[i].days[j].hours[k].constraints.slice(0, l).concat(timeTable[i].days[j].hours[k].constraints.slice(l + 1, timeTable[i].days[j].hours[k].constraints.length))];
                            }
                        }
                    }
                }
            }
        }

        let greads = [...this.state.currentConstraint.classNumber];

        for (let i = 0; i <= greads.length - 1; i++) {
            for (let j = 0; j <= timeTable.length - 1; j++) {
                if (greads[i] === timeTable[j].classNumber) {
                    timeTable[j].constaraintsToAdd = [...timeTable[j].constaraintsToAdd, this.state.currentConstraint];
                }
            }
        }

        let tableViewForClass = {};
        for (let i = 0; i <= timeTable.length - 1; i++) {
            if (timeTable[i].classNumber === this.state.currentClass) {
                tableViewForClass = { ...timeTable[i] };
            }
        }

        this.setState({
            currentConstraint: {},
            currentClassRoom: {},
            timeTable: [...timeTable],
            tableViewForClass: { ...tableViewForClass },
            classConstraints: [...tableViewForClass.constaraintsToAdd],
            showDeleteButton: false
        }, function () {
            this.setDayOf();
        })
    }


    render() {
        // console.log('render');
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
                <div className="text-right my-2">
                    <button type="button" className="btn btn-secondary ml-2" onClick={() => this.addTimeTable()}>שמור שינויים</button>
                    {this.deleteConstraintFromTable()}
                </div>
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
                            <h6 className="text-center mb-4">נתונים על שיעור פוטנציאלי לשיבוץ</h6>
                            {this.createPotential()}
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

export default DragDropContext(HTML5Backend)(BuildTimetable);