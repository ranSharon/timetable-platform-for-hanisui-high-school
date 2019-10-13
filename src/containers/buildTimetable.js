import React, { Component } from 'react';
import axios from 'axios';
import HourBox from './buildTimetableContainers/hourBox';
import ClassRoomBox from './buildTimetableContainers/classRoomBox';
import ConstraintBox from './buildTimetableContainers/constraintBox';
import DragConstraintBox from './buildTimetableContainers/dragConstraintBox';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

let teacherClashMessage = [];
let classroomClashMessage = [];

class BuildTimetable extends Component {
    mounted = false;
    timeoutID;

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

            daysFetched: false,
            gradesFetched: false,
            constraintsFetched: false,

            inTable: false,
            row: -1,
            col: -1,

            showDeleteButton: false,

            backgroundColorSunday: 'white',
            backgroundColorMonday: 'white',
            backgroundColorTuesday: 'white',
            backgroundColorWednesday: 'white',
            backgroundColorThursday: 'white',
            backgroundColorFriday: 'white',

            showTeacherClashMessage: false,
            showClassroomClashMessage: false,
            showTeacherClashButtonType: 'הצג התנגשויות עבור מורה',
            showClassroomClashButtonType: 'הצג התנגשויות עבור חדר לימוד',
            saveSucceed: false,
            waitingToSave: false,
            isLoading: true,
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
        // axios.get('http://localhost:4000/data/getConstraints')
        //     .then(response => {
        //         if (this.mounted) {
        //             this.setState({ constraints: [...response.data.sort(this.compareTeacher)] }, function () {
        //                 axios.get('http://localhost:4000/data/getDays')
        //                     .then(response => {
        //                         if (this.mounted) {
        //                             this.setState({ days: [...response.data] }, function () {
        //                                 axios.get('http://localhost:4000/data/getGrades')
        //                                     .then(response => {
        //                                         if (this.mounted) {
        //                                             this.setState({ grades: [...response.data.sort(this.compareGrade)] }, function () {
        //                                                 this.initTimeTable();
        //                                             });
        //                                         }
        //                                         console.log('grades:')
        //                                         console.log(this.state.grades);
        //                                     })
        //                                     .catch(function (error) {
        //                                         console.log(error);
        //                                     });
        //                             });
        //                         }
        //                         console.log('days:')
        //                         console.log(this.state.days);
        //                     })
        //                     .catch(function (error) {
        //                         console.log(error);
        //                     });
        //             });
        //         }
        //         console.log('constraints:')
        //         console.log(this.state.constraints);
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });

        this.mounted = true;
        // if (process.env.NODE_ENV !== 'production') {
        //     this.host = 'http://localhost:4000'
        // }
        // axios.get('http://localhost:4000/data/getConstraints')
        axios.get('/api/constraints')
            .then(response => {
                if (this.mounted) {
                    this.setState({ constraints: [...response.data.sort(this.compareTeacher)], constraintsFetched: true }, function () {
                        this.initTimeTable();
                    });
                }
                // console.log('constraints:')
                // console.log(this.state.constraints);
            })
            .catch(function (error) {
                console.log(error);
            });

        // axios.get('http://localhost:4000/data/getGrades')
        axios.get('/api/grades')
            .then(response => {
                if (this.mounted) {
                    this.setState({ grades: [...response.data.sort(this.compareGrade)], gradesFetched: true }, function () {
                        console.log('grades:')
                        console.log(this.state.grades);
                        this.initTimeTable();
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });

        // axios.get('http://localhost:4000/data/getDays')
        axios.get('/api/days')
            .then(response => {
                if (this.mounted) {
                    this.setState({ days: [...response.data], daysFetched: true }, function () {
                        this.initTimeTable();
                    });
                }
                // console.log('days:')
                // console.log(this.state.days);
            })
            .catch(function (error) {
                console.log(error);
            });

        // axios.get('http://localhost:4000/data/getClassRooms')
        axios.get('/api/classRooms')
            .then(response => {
                if (this.mounted) {
                    this.setState({ classRooms: [...response.data.sort(this.compareClassroom)], classRoomsView: [...response.data] });
                }
                // console.log('classRooms:')
                // console.log(this.state.classRooms);
            })
            .catch(function (error) {
                console.log(error);
            });
        // axios.get('http://localhost:4000/data/getTeachers')
        axios.get('/api/teachers')
            .then(response => {
                if (this.mounted) {
                    this.setState({ teachers: [...response.data] });
                }
                // console.log('teachers:')
                // console.log(this.state.teachers);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    componentWillUnmount() {
        this.mounted = false;
        clearTimeout(this.timeoutID);
    }

    componentDidUpdate() {
        // console.log(this.state.inTable);
        console.log(this.state.currentConstraint);
    }

    initTimeTable() {
        if (!this.state.daysFetched || !this.state.gradesFetched || !this.state.constraintsFetched) {
            return;
        }
        // axios.get('http://localhost:4000/data/getTimeTable')
        axios.get('/api/timeTables')
            .then(response => {
                if (this.mounted) {
                    // console.log(response.data);
                    let timeTableEmpty = true;
                    if (response.data.length > 0) {
                        outerLoop:
                        for (let i = 0; i <= response.data.length - 1; i++) {
                            for (let j = 0; j <= response.data[i].days.length - 1; j++) {
                                for (let k = 0; k <= response.data[i].days[j].hours.length - 1; k++) {
                                    // console.log(response.data[i].days[j].hours[k]);
                                    // for (let l = 0; l <= response.data[i].days[j].hours[k].length - 1; l++) {
                                    if (response.data[i].days[j].hours[k].constraints.length > 0) {
                                        timeTableEmpty = false;
                                        break outerLoop;
                                    }
                                    // }
                                }
                            }
                        }
                    }
                    // console.log(timeTableEmpty);
                    if (!timeTableEmpty && response.data.length > 0) {
                        this.setState({ timeTable: [...response.data] }, function () {
                            this.updateTimeTable();
                            console.log('timeTable');
                            console.log(this.state.timeTable);
                            this.setGrades();
                        });
                    } else {
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
                            this.setGrades();
                        });
                    }

                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    setGrades() {
        const timeTable = [...this.state.timeTable];

        let timeTableEmpty = true;
        if (timeTable.length > 0) {
            outerLoop:
            for (let i = 0; i <= timeTable.length - 1; i++) {
                for (let j = 0; j <= timeTable[i].days.length - 1; j++) {
                    for (let k = 0; k <= timeTable[i].days[j].hours.length - 1; k++) {
                        // console.log(response.data[i].days[j].hours[k]);
                        // for (let l = 0; l <= response.data[i].days[j].hours[k].length - 1; l++) {
                        if (timeTable[i].days[j].hours[k].constraints.length > 0) {
                            timeTableEmpty = false;
                            break outerLoop;
                        }
                        // }
                    }
                }
            }
        }

        console.log(timeTableEmpty);
        let grades = [];
        let stateGreades = [];

        if (!timeTableEmpty) {
            // [TODO] check if num of clasess change (if not => return)

            timeTable.forEach(table => {
                grades.push(table.classNumber);
            });
            grades = [...grades.sort()];
            console.log(grades);

            // creating
            let gradeObj = {};
            let grade = '';
            let currGrade = '';

            for (let i = 0; i <= grades.length - 1; i++) {
                if (grades[i].length === 2) {
                    currGrade = grades[i][0];
                    gradeObj['grade'] = grades[i][0];
                } else if (grades[i].length === 3) {
                    currGrade = grades[i][0] + grades[i][1];
                    gradeObj['grade'] = grades[i][0] + grades[i][1];
                }
                gradeObj['numOfClasses'] = '';

                if (grade !== currGrade) {
                    console.log(gradeObj);
                    stateGreades.push(gradeObj);
                    grade = currGrade;
                    gradeObj = {};
                }
            }
            console.log(stateGreades);

            // update grades array state for correct sitution
            grade = grades[0];
            currGrade = '';
            let numOfClassesInGrade = 0;
            for (let i = 0; i <= grades.length - 1; i++) {
                // console.log(grade);
                // console.log(currGrade);
                // console.log(numOfClassesInGrade);
                if (grades[i].length === 2) {
                    currGrade = grades[i][0];
                } else if (grades[i].length === 3) {
                    currGrade = grades[i][0] + grades[i][1];
                }
                // console.log(grade !== currGrade && grade !== '');
                if (grade !== currGrade || i === grades.length - 1) {
                    if (i === grades.length - 1) {
                        numOfClassesInGrade++;
                    }
                    for (let j = 0; j <= stateGreades.length - 1; j++) {
                        if (stateGreades[j].grade === grade) {
                            stateGreades[j].numOfClasses = numOfClassesInGrade.toString();
                        }
                    }
                    numOfClassesInGrade = 1;
                    grade = currGrade;
                } else {
                    numOfClassesInGrade++;
                }
            }
            this.setState({ grades: [...stateGreades], isLoading: false }, () => {
                console.log(this.state.grades);
            });
        }
        else {
            this.setState({ isLoading: false }, () => {
                console.log(this.state.grades);
            });
        }

    }

    updateTimeTable() {
        let timeTable = [...this.state.timeTable];
        let constraints = [...this.state.constraints];
        let constraintsToAdd = [];
        let constraintsToRemove = [];
        let timeTableConstraints = [];

        for (let i = 0; i <= timeTable.length - 1; i++) {
            for (let j = 0; j <= timeTable[i].constaraintsToAdd.length - 1; j++) {
                timeTableConstraints = [...timeTableConstraints, timeTable[i].constaraintsToAdd[j]];
            }
        }

        for (let i = 0; i <= timeTable.length - 1; i++) {
            for (let j = 0; j <= timeTable[i].days.length - 1; j++) {
                for (let k = 0; k <= timeTable[i].days[j].hours.length - 1; k++) {
                    for (let l = 0; l <= timeTable[i].days[j].hours[k].constraints.length - 1; l++) {
                        timeTableConstraints = [...timeTableConstraints, timeTable[i].days[j].hours[k].constraints[l]];
                    }
                }
            }

        }

        const uniqueTimeTableConstraints = Array.from(new Set(timeTableConstraints.map(a => a._id)))
            .map(_id => {
                return timeTableConstraints.find(a => a._id === _id)
            })

        constraintsToAdd = constraints.filter(item1 =>
            !uniqueTimeTableConstraints.some(item2 => (item2._id === item1._id)));

        // adding new constraints
        for (let i = 0; i <= constraintsToAdd.length - 1; i++) {
            for (let j = 0; j <= constraintsToAdd[i].classNumber.length - 1; j++) {
                for (let k = 0; k <= timeTable.length - 1; k++) {
                    if (timeTable[k].classNumber === constraintsToAdd[i].classNumber[j]) {
                        timeTable[k].constaraintsToAdd = [...timeTable[k].constaraintsToAdd, constraintsToAdd[i]];
                    }
                }
            }

        }

        constraintsToRemove = uniqueTimeTableConstraints.filter(item1 =>
            !constraints.some(item2 => (item2._id === item1._id)));

        // removing constraints from constraints to add of each table
        for (let i = 0; i <= constraintsToRemove.length - 1; i++) {
            for (let j = 0; j <= timeTable.length - 1; j++) {
                for (let k = 0; k <= timeTable[j].constaraintsToAdd.length - 1; k++) {
                    if (constraintsToRemove[i]._id === timeTable[j].constaraintsToAdd[k]._id) {
                        timeTable[j].constaraintsToAdd = [...timeTable[j].constaraintsToAdd.slice(0, k).concat(timeTable[j].constaraintsToAdd.slice(k + 1, timeTable[j].constaraintsToAdd.length))];
                    }
                }
            }
        }

        // removing constraints from each table
        for (let i = 0; i <= constraintsToRemove.length - 1; i++) {
            for (let j = 0; j <= timeTable.length - 1; j++) {
                for (let k = 0; k <= timeTable[j].days.length - 1; k++) {
                    for (let l = 0; l <= timeTable[j].days[k].hours.length - 1; l++) {
                        for (let m = 0; m <= timeTable[j].days[k].hours[l].constraints.length - 1; m++) {
                            if (constraintsToRemove[i]._id === timeTable[j].days[k].hours[l].constraints[m]._id) {
                                timeTable[j].days[k].hours[l].constraints = [...timeTable[j].days[k].hours[l].constraints.slice(0, m).concat(timeTable[j].days[k].hours[l].constraints.slice(m + 1, timeTable[j].days[k].hours[l].constraints))];
                            }
                        }
                    }
                }
            }
        }
    }

    setConstaraintsToAdd(classNumber) {
        let constraints = [...this.state.constraints];
        let constaraintsToAdd = [];
        // let constaraintsInTable = [];
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

    compareClassroom(a, b) {
        const classroomA = a.classRoomName;
        const classroomB = b.classRoomName;

        let comparison = 0;
        if (classroomA > classroomB) {
            comparison = 1;
        } else if (classroomA < classroomB) {
            comparison = -1;
        }
        return comparison;
    }

    compareTeacher(a, b) {
        const teacherA = a.groupingTeachers[0];
        const teacherB = b.groupingTeachers[0];

        let comparison = 0;
        if (teacherA > teacherB) {
            comparison = 1;
        } else if (teacherA < teacherB) {
            comparison = -1;
        }
        return comparison;
    }

    setNavbar() {
        if (!this.state.daysFetched || !this.state.gradesFetched || !this.state.constraintsFetched || this.state.timeTable.length === 0) {
            return null;
        }
        const timeTable = [...this.state.timeTable];

        let timeTableEmpty = true;
        if (timeTable.length > 0) {
            outerLoop:
            for (let i = 0; i <= timeTable.length - 1; i++) {
                for (let j = 0; j <= timeTable[i].days.length - 1; j++) {
                    for (let k = 0; k <= timeTable[i].days[j].hours.length - 1; k++) {
                        // console.log(response.data[i].days[j].hours[k]);
                        // for (let l = 0; l <= response.data[i].days[j].hours[k].length - 1; l++) {
                        if (timeTable[i].days[j].hours[k].constraints.length > 0) {
                            timeTableEmpty = false;
                            break outerLoop;
                        }
                        // }
                    }
                }
            }
        }
        let grades = [];
        let navBar = [];
        let key = 0;


        if (!timeTableEmpty) {
            timeTable.forEach(table => {
                grades.push(table.classNumber);

            });
            grades = [...grades.sort()];

            // countinu setting nav bar
            // for (let i = 0; i <= grades.length - 1; i++) {
            //     navBar = [...navBar,
            //     <li key={key} className="navbar-item w-aotu">
            //         <div
            //             className="nav-link"
            //             value={grades[i]}
            //             onClick={() => { this.handleClassClick(grades[i]) }}
            //             // onClick={() =>  this.handleClassClick(grades[i]) }
            //             style={{ "cursor": "pointer" }}>
            //             {grades[i]}
            //         </div>
            //     </li>
            //     ];
            //     key++;
            // }
            grades.forEach((grade) => {
                navBar = [...navBar,
                <li key={key} className="navbar-item w-aotu">
                    <div
                        className="nav-link"
                        value={grade}
                        onClick={() => { this.handleClassClick(grade) }}
                        // onClick={() =>  this.handleClassClick(grades[i]) }
                        style={{ "cursor": "pointer" }}>
                        {grade}
                    </div>
                </li>
                ];
                key++;
            })
        } else {
            grades = [...this.state.grades];
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
        }
        // grades = [...grades.sort()];
        // console.log(grades);
        // let navBar = [];
        // let key = 0;
        // for (let i = 0; i <= grades.length - 1; i++) {
        //     for (let j = 1; j <= parseInt(grades[i].numOfClasses); j++) {
        //         navBar = [...navBar,
        //         <li key={key} className="navbar-item w-aotu">
        //             <div
        //                 className="nav-link"
        //                 value={grades[i].grade + j}
        //                 onClick={() => { this.handleClassClick(grades[i].grade + j) }}
        //                 style={{ "cursor": "pointer" }}>
        //                 {grades[i].grade + j}
        //             </div>
        //         </li>
        //         ];
        //         key++;
        //     }
        // }
        // console.log(this.state.timeTable);
        return navBar;
    }

    handleClassClick(classNumber) {
        classroomClashMessage = [];
        teacherClashMessage = [];
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
            showDeleteButton: false,
            showTeacherClashMessage: false,
            showClassroomClashMessage: false,
            showTeacherClashButtonType: 'הצג התנגשויות עבור מורה',
            showClassroomClashButtonType: 'הצג התנגשויות עבור חדר לימוד'
        }, function () {
            this.setDayOff()
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

        if (this.objectEmpty(dayView)) {
            return null;
        }

        let hoursBoxes = [];
        let prvConstraints = ''; // if lesson is more then an hour i want to check it and not showing all lesson hours boxes 
        let show = true; // // if a box while br shown
        let validToAdd = true; // if box is green or red
        let currentConstraintEmpty = true; // if no constriant is chosee in this component then box lavan
        let data = {};
        let border = 'border border-dark';

        // let first = true // when edeting we use this flag  
        // let dummy = false;
        for (let i = 0; i <= dayView.hours.length - 1; i++) {
            if (i === 0 && col === 0) {
                // console.log('start:')
            }
            // if (i === 0) {
            //     for (let j = 8; j < dayView.hours[i]; j++) {
            //         emptySpace += <div key={j} style={{ "height": "50px", "width": "162px", "backgroundColor": "black" }}></div>;
            //         console.log(emptySpace);
            //     }
            // }
            if (dayView.hours[i].constraints.length > 0) {
                validToAdd = false;
                if (prvConstraints === JSON.stringify(dayView.hours[i].constraints[0])) {
                    show = false;
                }
            } else if (!this.objectEmpty(this.state.currentConstraint) && !this.objectEmpty(this.state.currentClassRoom)) {
                if (this.state.currentConstraint.subjectMix) {
                    validToAdd = (this.checkOtherConstraintsInTable(day, dayView.hours[i].hour, dayView.hours[dayView.hours.length - 1].hour, this.state.currentConstraint) &&
                        this.chekTeacherOtherDays(day, dayView.hours[i].hour, dayView.hours[dayView.hours.length - 1].hour, this.state.currentConstraint) &&
                        this.checkClassRoomsOtherDays(day, dayView.hours[i].hour, dayView.hours[dayView.hours.length - 1].hour, this.state.currentClassRoom, this.state.currentConstraint) &&
                        this.checkOtherConstraintsInGrage(day, dayView.hours[i].hour, dayView.hours[dayView.hours.length - 1].hour, this.state.currentConstraint));
                } else {
                    validToAdd = (this.checkOtherConstraintsInTable(day, dayView.hours[i].hour, dayView.hours[dayView.hours.length - 1].hour, this.state.currentConstraint) &&
                        this.chekTeacherOtherDays(day, dayView.hours[i].hour, dayView.hours[dayView.hours.length - 1].hour, this.state.currentConstraint) &&
                        this.checkClassRoomsOtherDays(day, dayView.hours[i].hour, dayView.hours[dayView.hours.length - 1].hour, this.state.currentClassRoom, this.state.currentConstraint));
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
                validToAdd = this.checkClassRoomsOtherDays(day, dayView.hours[i].hour, dayView.hours[dayView.hours.length - 1].hour, this.state.currentClassRoom, this.state.currentConstraint);
                currentConstraintEmpty = false;
            }

            data = { ...dayView.hours[i] };

            if (this.state.inTable && this.state.row === i && this.state.col === col) {
                data.constraints = [...data.constraints, this.state.currentConstraint];
            }

            if (JSON.stringify(data.constraints[0]) === JSON.stringify(this.state.currentConstraint)) {
                // console.log(data.constraints[0]);
                // console.log(this.state.currentConstraint);
                border = 'border border-primary';
            }

            hoursBoxes = [...hoursBoxes,
            <HourBox
                key={i} // must have for react
                show={show} // if a box while or shown
                validToAdd={validToAdd} // if box is green or red
                day={day} // 
                data={data} // data about box from timetable, inclulde hour time and lessons array
                // data={dayView.hours[i]} // data about box from timetable, inclulde hour time and lessons array
                endHour={dayView.hours[dayView.hours.length - 1].hour} // the end time of currnt hour box day
                // endHour={dayView.hours[dayView.hours.length - 1].hour} // the end time of currnt hour box
                currentConstraintEmpty={currentConstraintEmpty} // if no constriant is chosee in this component then box white
                row={i} // num of row of box in table
                col={col} // num of col of box in table
                click={this.handleDragConstraintClick}
                border={border}

                drop={this.addConstraintToHour} // event for droping lesson in this box
                hover={this.handleHourClick} // change color or box when hover and also valid to add

                drag={this.handleConstraintDrag} // event for draging a constraint that are in hour box 
                endDrag={this.handleConstraintEndDrag} // event for end draging a constraint that are in hour box 
            >
            </HourBox>
            ];
            show = true;
            border = 'border border-dark';
            if (dayView.hours[i].constraints.length !== 0) {
                prvConstraints = JSON.stringify(dayView.hours[i].constraints[0]);
            }
        }
        return hoursBoxes;
    }

    createEmptyBoxs(day) {
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

        if (this.objectEmpty(dayView)) {
            return null;
        }

        let emptyBoxes = [];

        for (let j = 8; j < dayView.hours[0].hour; j++) {
            emptyBoxes = [...emptyBoxes, <div key={j} style={{ "height": "50px", "width": "162px" }}></div>];
        }

        return emptyBoxes;
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
        console.log(this.state.grades)
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
        let timeTable = [...this.state.timeTable];

        // for (let i = 1; i <= numOfClasses; i++) {
        //     for (let j = 0; j <= timeTable.length - 1; j++) {
        //         if (timeTable[j].classNumber === (grade + i)) {
        //             for (let k = 0; k <= timeTable[j].days.length - 1; k++) {
        //                 if (timeTable[j].days[k].day === day) {
        //                     for (let l = 0; l <= timeTable[j].days[k].hours.length - 1; l++) {
        //                         if (timeTable[j].days[k].hours[l].hour === hour) {
        //                             if (timeTable[j].days[k].hours[l].constraints.length > 0) {
        //                                 return false;
        //                             } else if (timeTable[j].days[k].hours[l].hour + (lessonHours - 1) <= endofDay) {
        //                                 if (timeTable[j].days[k].hours[l + lessonHours - 1].constraints.length > 0) {
        //                                     return false;
        //                                 }
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }
        for (let i = 1; i <= numOfClasses; i++) {
            for (let j = 0; j <= timeTable.length - 1; j++) {
                if (timeTable[j].classNumber === (grade + i)) {
                    for (let k = 0; k <= timeTable[j].days.length - 1; k++) {
                        if (timeTable[j].days[k].day === day) {
                            for (let l = 0; l <= timeTable[j].days[k].hours.length - 1; l++) {
                                if (timeTable[j].days[k].hours[l].hour === hour) {
                                    if (timeTable[j].days[k].hours[l].hour + (lessonHours - 1) <= endofDay) {
                                        for (let m = 1; m <= lessonHours; m++) {
                                            if (timeTable[j].days[k].hours[l].constraints.length > 0) {
                                                return false;
                                            } else if (timeTable[j].days[k].hours[l + m - 1].constraints.length > 0) {
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
        }

        return canBeAdded;
    }

    checkOtherConstraintsInTable(day, hour, endofDay, constraint) {
        let canBeAdded = true;
        let lessonHours = parseInt(constraint.hours);
        if (lessonHours + (hour - 1) > endofDay) {
            return false
        }

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
        let message = '';
        let timeTable = [...this.state.timeTable];
        let teachers = [...constraint.groupingTeachers];
        let lessonHours = parseInt(constraint.hours);

        // for (let t = 0; t <= teachers.length - 1; t++) {
        //     for (let i = 0; i <= timeTable.length - 1; i++) {
        //         if (timeTable[i].classNumber !== this.state.currentClass) {
        //             for (let j = 0; j <= timeTable[i].days.length - 1; j++) {
        //                 if (timeTable[i].days[j].day === day) {
        //                     for (let k = 0; k <= timeTable[i].days[j].hours.length - 1; k++) {
        //                         if (timeTable[i].days[j].hours[k].hour === hour) {
        //                             for (let l = 0; l <= timeTable[i].days[j].hours[k].constraints.length - 1; l++) {
        //                                 if (timeTable[i].days[j].hours[k].constraints[l].teacher === teachers[t]) {
        //                                     message = 'המורה ' + teachers[t] + ' כבר מלמד ביום: ' + day + ', בשעה ' + (hour - 1) + ':00-' + + hour + ':00, בכיתה ' + timeTable[i].classNumber;
        //                                     teacherClashMessage = [...teacherClashMessage, message];
        //                                     return false;
        //                                 }
        //                             }
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }

        // for (let m = 1; m <= lessonHours; m++) {
        //     if (timeTableView.days[j].hours[k + m - 1].constraints.length > 0) {
        //         return false;
        //     }
        // }

        for (let t = 0; t <= teachers.length - 1; t++) {
            for (let i = 0; i <= timeTable.length - 1; i++) {
                if (timeTable[i].classNumber !== this.state.currentClass) {
                    for (let j = 0; j <= timeTable[i].days.length - 1; j++) {
                        if (timeTable[i].days[j].day === day) {
                            for (let k = 0; k <= timeTable[i].days[j].hours.length - 1; k++) {
                                if (timeTable[i].days[j].hours[k].hour === hour) {
                                    if (timeTable[i].days[j].hours[k].hour + (lessonHours - 1) <= endofDay) {
                                        for (let m = 1; m <= lessonHours; m++) {
                                            if (timeTable[i].days[j].hours[k].constraints.length > 0) {
                                                for (let o = 0; o <= timeTable[i].days[j].hours[k].constraints[0].groupingTeachers.length - 1; o++) {
                                                    if (timeTable[i].days[j].hours[k].constraints[0].groupingTeachers[o] === teachers[t]) {
                                                        message = 'המורה ' + teachers[t] + ' כבר מלמד ביום ' + day + ', בשעה ' + (hour - 1) + ':00-' + + hour + ':00, בכיתה ' + timeTable[i].classNumber;
                                                        teacherClashMessage = [...teacherClashMessage, message];
                                                        return false;
                                                    }
                                                }
                                            } else if (timeTable[i].days[j].hours[k + m - 1].constraints.length > 0) {
                                                for (let o = 0; o <= timeTable[i].days[j].hours[k + m - 1].constraints[0].groupingTeachers.length - 1; o++) {
                                                    if (timeTable[i].days[j].hours[k + m - 1].constraints[0].groupingTeachers[o] === teachers[t]) {
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
                }
            }
        }
        return canBeAdded;
    }

    checkClassRoomsOtherDays(day, hour, endofDay, classRoom, constraint) {
        let canBeAdded = true;

        let message = '';
        let timeTable = [...this.state.timeTable];
        let lessonHours = parseInt(constraint.hours);

        if (this.objectEmpty(constraint)) {
            for (let i = 0; i <= timeTable.length - 1; i++) {
                if (timeTable[i].classNumber !== this.state.currentClass) {
                    for (let j = 0; j <= timeTable[i].days.length - 1; j++) {
                        if (timeTable[i].days[j].day === day) {
                            for (let k = 0; k <= timeTable[i].days[j].hours.length - 1; k++) {
                                if (timeTable[i].days[j].hours[k].hour === hour) {
                                    for (let l = 0; l <= timeTable[i].days[j].hours[k].constraints.length - 1; l++) {
                                        if (timeTable[i].days[j].hours[k].constraints[l].classRoom === classRoom.classRoomName) {
                                            message = 'חדר הלימוד ' + classRoom.classRoomName + ' תפוס כבר ביום ' + day + ', ע"י כיתה ' + timeTable[i].classNumber + ', בשעה ' + (hour - 1) + ':00-' + hour + ':00';
                                            classroomClashMessage = [...classroomClashMessage, message];
                                            return false;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            for (let i = 0; i <= timeTable.length - 1; i++) {
                if (timeTable[i].classNumber !== this.state.currentClass) {
                    for (let j = 0; j <= timeTable[i].days.length - 1; j++) {
                        if (timeTable[i].days[j].day === day) {
                            for (let k = 0; k <= timeTable[i].days[j].hours.length - 1; k++) {
                                if (timeTable[i].days[j].hours[k].hour === hour) {
                                    if (timeTable[i].days[j].hours[k].hour + (lessonHours - 1) <= endofDay) {
                                        for (let m = 1; m <= lessonHours; m++) {
                                            if (timeTable[i].days[j].hours[k].constraints.length > 0) {
                                                if (timeTable[i].days[j].hours[k].constraints[0].classRoom === classRoom.classRoomName) {
                                                    message = 'חדר הלימוד ' + classRoom.classRoomName + ' תפוס כבר ביום ' + day + ', ע"י כיתה ' + timeTable[i].classNumber + ', בשעה ' + (hour - 1) + ':00-' + hour + ':00';
                                                    classroomClashMessage = [...classroomClashMessage, message];
                                                    return false;
                                                }
                                            }
                                            else if (timeTable[i].days[j].hours[k + m - 1].constraints.length > 0) {
                                                if (timeTable[i].days[j].hours[k + m - 1].constraints[0].classRoom === classRoom.classRoomName) {
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
            }
        }

        return canBeAdded;
    }

    handleHourClick(hourData, day) {

    }

    createTimeTableView() {
        return (
            <div className="row justify-content-center m-0">
                <div className="col col-1 border border-dark text-center" value='שעות'>שעות
                {this.createTimeCol()}
                </div>
                <div className="col-11 row">
                    <div className="col-2 border border-dark text-center" ><div className="border-bottom border-dark" style={{ "backgroundColor": this.state.backgroundColorSunday, "marginRight": "-15px", "marginLeft": "-15px" }} value='ראשון'>ראשון</div>
                        {this.createEmptyBoxs('ראשון')}
                        {this.createBoxesForDay('ראשון', 0)}
                    </div>
                    <div className="col-2 border border-dark text-center" ><div className="border-bottom border-dark" style={{ "backgroundColor": this.state.backgroundColorMonday, "marginRight": "-15px", "marginLeft": "-15px" }} value='שני'>שני</div>
                        {this.createEmptyBoxs('שני')}
                        {this.createBoxesForDay('שני', 1)}
                    </div>
                    <div className="col-2 border border-dark text-center" ><div className="border-bottom border-dark" style={{ "backgroundColor": this.state.backgroundColorTuesday, "marginRight": "-15px", "marginLeft": "-15px" }} value='שלישי'>שלישי</div>
                        {this.createEmptyBoxs('שלישי')}
                        {this.createBoxesForDay('שלישי', 2)}
                    </div>
                    <div className="col-2 border border-dark text-center" ><div className="border-bottom border-dark" style={{ "backgroundColor": this.state.backgroundColorWednesday, "marginRight": "-15px", "marginLeft": "-15px" }} value='רביעי'>רביעי</div>
                        {this.createEmptyBoxs('רביעי')}
                        {this.createBoxesForDay('רביעי', 3)}
                    </div>
                    <div className="col-2 border border-dark text-center" ><div className="border-bottom border-dark" style={{ "backgroundColor": this.state.backgroundColorThursday, "marginRight": "-15px", "marginLeft": "-15px" }} value='חמישי'>חמישי</div>
                        {this.createEmptyBoxs('חמישי')}
                        {this.createBoxesForDay('חמישי', 4)}
                    </div>
                    <div className="col-2 border border-dark text-center" ><div className="border-bottom border-dark" style={{ "backgroundColor": this.state.backgroundColorFriday, "marginRight": "-15px", "marginLeft": "-15px" }} value='שישי'>שישי</div>
                        {this.createEmptyBoxs('שישי')}
                        {this.createBoxesForDay('שישי', 5)}
                    </div>
                </div>
            </div>
        );
    }

    createTimeCol() {
        // let maxEndTime = 0;
        // let minStartTime = 100;
        // let days = [...this.state.days];
        // for (let i = 0; i <= days.length - 1; i++) {
        //     if (maxEndTime < parseInt(days[i].endTime)) {
        //         maxEndTime = parseInt(days[i].endTime);
        //     }
        //     if (minStartTime > parseInt(days[i].startTime)) {
        //         minStartTime = parseInt(days[i].startTime);
        //     }
        // }
        // let TimeCol = [];
        // for (let i = minStartTime; i < maxEndTime; i++) {
        //     let time = i + ':00-' + (i + 1) + ':00';
        //     TimeCol = [...TimeCol,
        //     <div key={i} className="row border-top border-dark text-center" style={{ "height": "50px" }}>{time}</div>
        //     ];
        // }

        let TimeCol = [];
        for (let i = 7; i < 20; i++) {
            let time = i + ':00-' + (i + 1) + ':00';
            TimeCol = [...TimeCol,
            <div key={i} className="row border-top border-dark text-center" style={{ "height": "50px" }}>{time}</div>
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
        classroomClashMessage = [];
        if (this.state.inTable) {
            teacherClashMessage = [];
            this.setState({
                inTable: false,
                currentConstraint: {}
            })
        }
        if (JSON.stringify(classRoomData) === JSON.stringify(this.state.currentClassRoom)) {
            this.setState({
                currentClassRoom: {},
                showTeacherClashMessage: false,
                showClassroomClashMessage: false,
                showTeacherClashButtonType: 'הצג התנגשויות עבור מורה',
                showClassroomClashButtonType: 'הצג התנגשויות עבור חדר לימוד'
            },
                function () {
                });
        } else {
            this.setState({
                currentClassRoom: { ...classRoomData },
                showClassroomClashMessage: false,
                showClassroomClashButtonType: 'הצג התנגשויות עבור חדר לימוד'
            }, function () {
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
                inPotentialCard={false}
                data={classConstraints[i]}
                currentConstraint={this.state.currentConstraint}
                click={this.handleConstraintClick}>
            </ConstraintBox>
            ]
        }

        return classConstraintsBoxes;
    }

    handleConstraintClick(constraintData) {
        teacherClashMessage = [];
        if (this.state.inTable) {
            this.setState({
                inTable: false,
                currentClassRoom: {}
                // showTeacherClashMessage: false
            })
        }
        if (JSON.stringify(constraintData) === JSON.stringify(this.state.currentConstraint)) {
            this.setState({
                currentConstraint: {},
                showTeacherClashMessage: false,
                showTeacherClashButtonType: 'הצג התנגשויות עבור מורה',
            }, function () {
                this.setDayOff();
                this.setClassRoomForLesson();
            });
        } else {
            this.setState({
                currentConstraint: { ...constraintData },
                showTeacherClashMessage: false,
                showTeacherClashButtonType: 'הצג התנגשויות עבור מורה',
            }, function () {
                this.setDayOff();
                this.setClassRoomForLesson();
            });
        }
    }

    handleDragConstraintClick(inTable, constraint, classRoom) {
        if (!inTable) {
            return;
        }
        teacherClashMessage = [];
        classroomClashMessage = [];
        let classRooms = [...this.state.classRooms];
        let currentClassRoom = {};
        for (let i = 0; i <= classRooms.length - 1; i++) {
            if (classRooms[i].classRoomName === classRoom) {
                currentClassRoom = { ...classRooms[i] };
            }
        }
        if (JSON.stringify(constraint) === JSON.stringify(this.state.currentConstraint)) {
            this.setState({
                inTable: false,
                currentConstraint: {},
                currentClassRoom: {},
                showDeleteButton: false,
                showTeacherClashMessage: false,
                showClassroomClashMessage: false,
                showTeacherClashButtonType: 'הצג התנגשויות עבור מורה',
                showClassroomClashButtonType: 'הצג התנגשויות עבור חדר לימוד',
            }, function () {
                this.setDayOff()
            });
        } else {
            this.setState({
                inTable: true,
                currentConstraint: { ...constraint },
                currentClassRoom: { ...currentClassRoom },
                showDeleteButton: true,
                showTeacherClashMessage: false,
                showClassroomClashMessage: false,
                showTeacherClashButtonType: 'הצג התנגשויות עבור מורה',
                showClassroomClashButtonType: 'הצג התנגשויות עבור חדר לימוד',
            }, function () {
                this.setDayOff()
            });
        }
    }

    handleConstraintDrag(inTable, constraint, classRoom, row, col) {
        // let tableView = { ...this.state.tableViewForClass }

        // for (let i = 0; i <= tableView.days.length - 1; i++) {
        //     for (let j = 0; j <= tableView.days[i].hours.length - 1; j++) {
        //         for (let k = 0; k <= tableView.days[i].hours[j].constraints.length - 1; k++) {
        //             if (tableView.days[i].hours[j].constraints[k]._id === this.state.currentConstraint._id) {
        //                 this.setState({
        //                     inTable: false,
        //                     currentConstraint: {},
        //                     currentClassRoom: {},
        //                     showDeleteButton: false,
        //                     showTeacherClashMessage: false,
        //                     showClassroomClashMessage: false,
        //                     showTeacherClashButtonType: 'הצג התנגשויות עבור מורה',
        //                     showClassroomClashButtonType: 'הצג התנגשויות עבור חדר לימוד'
        //                 });
        //                 return;
        //             }
        //         }
        //     }
        // }

        let classRooms = [...this.state.classRooms];
        let currentClassRoom = {};
        for (let i = 0; i <= classRooms.length - 1; i++) {
            if (classRooms[i].classRoomName === classRoom) {
                currentClassRoom = { ...classRooms[i] };
            }
        }

        let timeTable = [...this.state.timeTable];
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
            this.setDayOff()
        });
    }

    handleConstraintEndDrag(didDrop) {
        // console.log('handleConstraintEndDrag');
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
            default:
                break;

        }

        for (let i = 0; i <= tableViewForClass.days.length - 1; i++) {
            if (tableViewForClass.days[i].day === day) {
                hourData = { ...tableViewForClass.days[i].hours[this.state.row] };
                break;
            }
        }
        this.addConstraintToHour(hourData, day);
    }

    setDayOff() {
        if (this.objectEmpty(this.state.currentConstraint)) {
            this.setState({
                backgroundColorSunday: 'white',
                backgroundColorMonday: 'white',
                backgroundColorTuesday: 'white',
                backgroundColorWednesday: 'white',
                backgroundColorThursday: 'white',
                backgroundColorFriday: 'white'
            });
            return;
        }

        this.setState({
            backgroundColorSunday: 'white',
            backgroundColorMonday: 'white',
            backgroundColorTuesday: 'white',
            backgroundColorWednesday: 'white',
            backgroundColorThursday: 'white',
            backgroundColorFriday: 'white'
        }, function () {
            // let teachers = this.state.teachers;
            // let teacher = this.state.currentConstraint.teacher;
            // let teacherDayOff = '';

            // for (let i = 0; i <= teachers.length - 1; i++) {
            //     if (teachers[i].name === teacher) {
            //         teacherDayOff = teachers[i].dayOff;
            //         break;
            //     }
            // }
            // switch (teacherDayOff) {
            //     case 'ראשון':
            //         this.setState({ backgroundColorSunday: '#fff3cd' })
            //         break;
            //     case 'שני':
            //         this.setState({ backgroundColorMonday: '#fff3cd' })
            //         break;
            //     case 'שלישי':
            //         this.setState({ backgroundColorTuesday: '#fff3cd' })
            //         break;
            //     case 'רביעי':
            //         this.setState({ backgroundColorWednesday: '#fff3cd' })
            //         break;
            //     case 'חמישי':
            //         this.setState({ backgroundColorThursday: '#fff3cd' })
            //         break;
            //     case 'שישי':
            //         this.setState({ backgroundColorFriday: '#fff3cd' })
            //         break;
            //     default:
            //         break;
            // }

            let teachers = this.state.teachers;
            let currentTeachers = [...this.state.currentConstraint.groupingTeachers];
            let teacherDayOff = '';

            for (let j = 0; j <= currentTeachers.length - 1; j++) {
                for (let i = 0; i <= teachers.length - 1; i++) {
                    if (teachers[i].name === currentTeachers[j]) {
                        teacherDayOff = teachers[i].dayOff;
                        break;
                    }
                }
                switch (teacherDayOff) {
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
                    default:
                        break;
                }
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

    // calls when lesson begin drop to hour box
    addConstraintToHour(hourData, day, row, col) {
        console.log(hourData);
        let currentHourBox = { ...hourData };

        // case of droping lesson on the same hour box it were begin drag from
        for (let i = 0; i <= currentHourBox.constraints.length - 1; i++) {
            if (currentHourBox.constraints[i]._id === this.state.currentConstraint._id) {
                currentHourBox.constraints = [...currentHourBox.constraints.slice(0, i).concat(currentHourBox.constraints.slice(i + 1, currentHourBox.constraints.length))];
                break;
            }
        }

        this.setState({ currentHourBox: { ...currentHourBox }, currentDay: day, showDeleteButton: false }, function () {
            let currentConstraint = { ...this.state.currentConstraint };
            let classConstraints = [...this.state.classConstraints];

            // removing lesson that being drop from lessons that should be added to current class
            for (let i = 0; i <= classConstraints.length - 1; i++) {
                if (currentConstraint._id === classConstraints[i]._id) {
                    classConstraints = [...classConstraints.slice(0, i).concat(classConstraints.slice(i + 1, classConstraints.length))];
                    break;
                }
            }

            if (this.objectEmpty(this.state.currentConstraint) || this.objectEmpty(this.state.currentHourBox)) {
                return;
            }

            // console.log(this.state.currentClassRoom.classRoomName);
            let currentHourBox = { ...this.state.currentHourBox };
            let classRoom = this.state.currentClassRoom.classRoomName;
            currentConstraint.classRoom = classRoom;
            currentHourBox.constraints = [...currentHourBox.constraints, currentConstraint];
            this.setState({
                inTable: false,
                currentHourBox: { ...currentHourBox },
                currentConstraint: { ...currentConstraint },
                currentClassRoom: {},
                classConstraints: classConstraints,
                row: -1,
                col: -1,
                showTeacherClashMessage: false,
                showClassroomClashMessage: false,
                showTeacherClashButtonType: 'הצג התנגשויות עבור מורה',
                showClassroomClashButtonType: 'הצג התנגשויות עבור חדר לימוד'
            },
                function () {
                    // console.log(this.state.currentConstraint.subjectMix);
                    if (this.state.currentConstraint.subjectMix) {
                        let grade = '';
                        // let nunOfClasses = 0;
                        let currentClass = this.state.currentClass;
                        if (currentClass.length === 2) {
                            grade = currentClass[0];
                            // nunOfClasses = parseInt(currentClass[1]);
                        } else if (currentClass.length === 3) {
                            grade = currentClass[0] + currentClass[1];
                            // nunOfClasses = parseInt(currentClass[2]);
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
                            // timeTableView = { ...this.addHourToTableView((grade + i), this.state.currentConstraint) };
                            // let timeTableView = { ...this.addHourToTableView((grade + i), this.state.currentConstraint) };
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
        teacherClashMessage = [];
        classroomClashMessage = [];
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
                                this.setDayOff();
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
        if (this.state.inTable) {
            return null;
        }
        if (this.objectEmpty(this.state.currentConstraint)) {
            return <h6>אנא בחר שיעור מתוך רשימת השיעורים עבור כיתה זו</h6>;
        } else if (this.objectEmpty(this.state.currentClassRoom)) {
            return (
                <div>
                    <h6>כעת בחר חדר לימוד עבור שיעור זה</h6>
                    <div>
                        <ConstraintBox
                            inPotentialCard={true}
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
                    {/* <div style={{ "marginRight": "16.6666666667%", "marginLeft": "16.6666666667%" }}> */}
                    <div className="mx-auto" style={{ "width": "61.11111111%" }}>
                        <DragConstraintBox
                            data={this.state.currentConstraint}
                            currentConstraint={this.state.currentConstraint}
                            click={this.handleDragConstraintClick}
                            drag={this.handleConstraintDrag}
                            endDrag={this.handleConstraintEndDrag}
                            classRoom={this.state.currentClassRoom.classRoomName}
                            inTable={false}
                            border={'border border-primary'}
                        >
                        </DragConstraintBox>
                    </div>
                    <div className='d-inline-block'>
                        <h6>{'חדר הלימוד שנבחר עבור שיעור זה: ' + this.state.currentClassRoom.classRoomName}</h6>
                    </div>
                </div>
            );
        }
    }

    addTimeTable() {
        let timeTable = [...this.state.timeTable];
        let classTimeTable = {};
        this.setState({ waitingToSave: true, saveSucceed: false }, () => {
            // axios.post('http://localhost:4000/data/dropTimeTable')
            axios.delete('/api/timeTables')
            // axios.delete('/api/timeTablese')
                .then(response => {
                    if (this.mounted) {
                        if (timeTable.length === 0) {
                            this.setState({ waitingToSave: false, saveSucceed: true }, () => {
                                // console.log('hi');
                                clearTimeout(this.timeoutID);
                                this.timeoutID = setTimeout(() => { this.setState({ saveSucceed: false }) }, 1500);
                                return;
                                // console.log(classTimeTable);
                            });
                        }
                    }
                    let tablesSaved = 0;
                    // for (let i = 0; i <= timeTable.length - 1; i++) {
                    //     classTimeTable = { ...timeTable[i] };
                    //     // axios.post('http://localhost:4000/data/addTimeTable', classTimeTable)
                    //     axios.post(this.host + '/data/addTimeTable', classTimeTable)
                    //         .then(res => {
                    //             if (this.mounted) {
                    //                 tablesSaved++;
                    //                 console.log(tablesSaved);
                    //                 if (this.mounted) {
                    //                     if (tablesSaved === timeTable.length) {
                    //                         this.setState({ waitingToSave: false, saveSucceed: true }, () => {
                    //                             // console.log('hi');
                    //                             clearTimeout(this.timeoutID);
                    //                             this.timeoutID = setTimeout(() => { this.setState({ saveSucceed: false }) }, 1500);
                    //                             // console.log(classTimeTable);
                    //                         });
                    //                     }
                    //                 }
                    //             }
                    //         })
                    //         .catch(function (error) {
                    //             console.log(error);
                    //         });
                    // }
                    timeTable.forEach((table) => {
                        classTimeTable = { ...table };
                        // axios.post('http://localhost:4000/data/addTimeTable', classTimeTable)
                        axios.post('/api/timeTables', classTimeTable)
                            .then(res => {
                                if (this.mounted) {
                                    tablesSaved++;
                                    console.log(tablesSaved);
                                    if (this.mounted) {
                                        if (tablesSaved === timeTable.length) {
                                            this.setState({ waitingToSave: false, saveSucceed: true }, () => {
                                                // console.log('hi');
                                                clearTimeout(this.timeoutID);
                                                this.timeoutID = setTimeout(() => { this.setState({ saveSucceed: false }) }, 1500);
                                                // console.log(classTimeTable);
                                            });
                                        }
                                    }
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    });
                })
                .catch(function (error) {
                    console.log(error);
                })
        })
        // axios.post('http://localhost:4000/data/dropTimeTable')
        //     .then(response => {
        //         for (let i = 0; i <= timeTable.length - 1; i++) {
        //             classTimeTable = { ...timeTable[i] };
        //             // console.log(classTimeTable);
        //             axios.post('http://localhost:4000/data/addTimeTable', classTimeTable)
        //                 .then(res => {

        //                 })
        //                 .catch(function (error) {
        //                     console.log(error);
        //                 });
        //         }
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     })
    }

    deleteConstraintFromTable() {
        if (this.state.showDeleteButton) {
            return (
                <button type="button" className="btn btn-secondary" onClick={() => this.removeConstraint()}>הסר שיעור</button>
            );
        } else {
            return (
                <button type="button" className="btn btn-secondary" onClick={() => this.removeConstraint()} disabled>הסר שיעור</button>
            );
        }

    }

    removeConstraint() {
        teacherClashMessage = [];
        classroomClashMessage = [];
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
        // let greads = [...constraintToRemove.classNumber];

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
            this.setDayOff();
        })
    }

    teacherClashMessage() {
        if (!this.state.showTeacherClashMessage) {
            return null;
        }
        teacherClashMessage = teacherClashMessage.filter((item, index) => teacherClashMessage.indexOf(item) === index);
        if (teacherClashMessage.length === 0) {
            return null;
        }

        let content = [];
        teacherClashMessage.forEach((element, index) => {
            content = [...content, <li key={index} style={{ textAlign: "right" }}>{element}</li>];
        });

        return (
            <div
                className="col-5 alert alert-danger m-1 text-center"
                role="alert"
                style={{ textAlign: "right" }}>
                {content}
            </div>
        );
    }

    classroomClashMessage() {
        if (!this.state.showClassroomClashMessage) {
            return null;
        }
        classroomClashMessage = classroomClashMessage.filter((item, index) => classroomClashMessage.indexOf(item) === index);
        if (classroomClashMessage.length === 0) {
            return null
        }

        let content = [];
        classroomClashMessage.forEach((element, index) => {
            content = [...content, <li key={index} style={{ textAlign: "right" }}>{element}</li>];
        });

        return (
            <div
                className="col-5 alert alert-danger m-1 text-center"
                role="alert"
                style={{ textAlign: "right" }}>
                {content}
            </div>
        );
    }

    showTeacherClashMessage() {
        let buttonType = '';
        if (this.state.showTeacherClashButtonType === 'הסתר התנגשויות עבור מורה') {
            buttonType = 'הצג התנגשויות עבור מורה';
        } else if (this.state.showTeacherClashButtonType === 'הצג התנגשויות עבור מורה') {
            buttonType = 'הסתר התנגשויות עבור מורה';
        }
        this.setState({ showTeacherClashButtonType: buttonType, showTeacherClashMessage: !this.state.showTeacherClashMessage })
    }

    showClassroomClashMessage() {
        let buttonType = '';
        if (this.state.showClassroomClashButtonType === 'הסתר התנגשויות עבור חדר לימוד') {
            buttonType = 'הצג התנגשויות עבור חדר לימוד';
        } else if (this.state.showClassroomClashButtonType === 'הצג התנגשויות עבור חדר לימוד') {
            buttonType = 'הסתר התנגשויות עבור חדר לימוד';
        }
        this.setState({ showClassroomClashButtonType: buttonType, showClassroomClashMessage: !this.state.showClassroomClashMessage })
    }

    clashButtons() {
        if (teacherClashMessage.length > 0 && classroomClashMessage.length > 0) {
            return (
                <div className="text-center">
                    <button type="button" className="btn btn-outline-dark" onClick={() => this.showTeacherClashMessage()}>{this.state.showTeacherClashButtonType}</button>
                    <button type="button" className="btn btn-outline-dark my-2" onClick={() => this.showClassroomClashMessage()}>{this.state.showClassroomClashButtonType}</button>
                </div>
            );
        } else if (teacherClashMessage.length > 0) {
            return (
                <div className="text-center">
                    <button type="button" className="btn btn-outline-dark my-2" onClick={() => this.showTeacherClashMessage()}>{this.state.showTeacherClashButtonType}</button>
                </div>
            );
        } else if (classroomClashMessage.length > 0) {
            return (
                <div className="text-center">
                    <button type="button" className="btn btn-outline-dark my-2" onClick={() => this.showClassroomClashMessage()}>{this.state.showClassroomClashButtonType}</button>
                </div>
            );
        }
    }

    handleRemoveCurrentClick() {
        confirmAlert({
            title: 'אנא אשר',
            message: 'האם לאפס טבלה נוכחית?',
            buttons: [
                {
                    label: 'כן',
                    onClick: () => this.removeConstraintsfromTimeTableView(this.state.tableViewForClass)
                },
                {
                    label: 'לא',
                    onClick: () => { }
                }
            ]
        });
    }

    handleRemoveAllClick() {
        confirmAlert({
            title: 'אנא אשר',
            message: 'האם לאפס את כל הטבלאות?',
            buttons: [
                {
                    label: 'כן',
                    onClick: () => this.removeConstraintsfromTimeTable()
                },
                {
                    label: 'לא',
                    onClick: () => { }
                }
            ]
        });
    }

    removeConstraintsfromTimeTableView(timeTableForClass) {
        let constraintsToRemove = [];
        for (let i = 0; i <= timeTableForClass.days.length - 1; i++) {
            for (let j = 0; j <= timeTableForClass.days[i].hours.length - 1; j++) {
                if (timeTableForClass.days[i].hours[j].constraints.length > 0) {
                    for (let k = 0; k <= timeTableForClass.days[i].hours[j].constraints.length - 1; k++) {
                        constraintsToRemove = [...constraintsToRemove, timeTableForClass.days[i].hours[j].constraints[k]];
                    }
                }

            }
        }
        const uniqueConstraintsToRemove = Array.from(new Set(constraintsToRemove.map(a => a._id)))
            .map(_id => {
                return constraintsToRemove.find(a => a._id === _id)
            })

        teacherClashMessage = [];
        classroomClashMessage = [];
        let timeTable = [...this.state.timeTable];
        for (let c = 0; c <= uniqueConstraintsToRemove.length - 1; c++) {
            for (let i = 0; i <= timeTable.length - 1; i++) {
                for (let j = 0; j <= timeTable[i].days.length - 1; j++) {
                    for (let k = 0; k <= timeTable[i].days[j].hours.length - 1; k++) {
                        if (timeTable[i].days[j].hours[k].constraints.length > 0) {
                            for (let l = 0; l <= timeTable[i].days[j].hours[k].constraints.length - 1; l++) {
                                if (timeTable[i].days[j].hours[k].constraints[l]._id === uniqueConstraintsToRemove[c]._id) {
                                    timeTable[i].days[j].hours[k].constraints = [...timeTable[i].days[j].hours[k].constraints.slice(0, l).concat(timeTable[i].days[j].hours[k].constraints.slice(l + 1, timeTable[i].days[j].hours[k].constraints.length))];
                                }
                            }
                        }
                    }
                }
            }

            let greads = [...uniqueConstraintsToRemove[c].classNumber];

            for (let i = 0; i <= greads.length - 1; i++) {
                for (let j = 0; j <= timeTable.length - 1; j++) {
                    if (greads[i] === timeTable[j].classNumber) {
                        timeTable[j].constaraintsToAdd = [...timeTable[j].constaraintsToAdd, uniqueConstraintsToRemove[c]];
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
            currentConstraint: {},
            currentClassRoom: {},
            timeTable: [...timeTable],
            tableViewForClass: { ...tableViewForClass },
            classConstraints: [...tableViewForClass.constaraintsToAdd],
            showDeleteButton: false
        }, function () {
            this.setDayOff();
        })

    }

    removeConstraintsfromTimeTable() {
        let timeTable = [...this.state.timeTable];
        for (let i = 0; i <= timeTable.length - 1; i++) {
            this.removeConstraintsfromTimeTableView(timeTable[i]);
        }
    }

    saveSuccessMessage() {
        if (!this.state.saveSucceed) {
            return null;
        }
        return (
            <div className="alert alert-success mr-2 pt-2 d-inline">
                השינויים נשמרו בהצלחה
            </div>
        );
    }

    saveTimeTablesButton() {
        if (!this.state.waitingToSave) {
            return (
                <button type="button" className="btn btn-secondary ml-2" onClick={() => this.addTimeTable()}>שמור שינויים</button>
            );
        }
        return (
            <button className="btn btn-secondary ml-2" type="button" disabled>
                אנא המתן...
                <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
            </button>
        );

    }

    render() {
        if (this.state.isLoading) {
            return (
                <div className="text-center mt-5">
                    <div className="spinner-border" style={{ "width": "3rem", "height": "3rem" }} role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            );
        }
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
                <div className="row">
                    <div className="text-right my-2 col-6">
                        {this.saveTimeTablesButton()}
                        {this.deleteConstraintFromTable()}
                        {this.saveSuccessMessage()}
                    </div>
                    <div className="text-left my-2 col-6">
                        <button type="button" className="btn btn-secondary ml-2" onClick={() => this.handleRemoveCurrentClick()}>אפס טבלה נוכחית</button>
                        <button type="button" className="btn btn-secondary ml-2" onClick={() => this.handleRemoveAllClick()}>אפס כל הטבלאות</button>
                    </div>
                </div>
                <div className="row" >
                    {this.teacherClashMessage()}
                    {this.classroomClashMessage()}
                </div>
                <div className="row mt-2 mb-5">
                    <div className="col-5">
                        <div
                            // className="d-inline-block w-100 text-center p-0 card"
                            className=" w-100 text-center p-0 card"
                            style={{ "position": "relative", "height": "400px", "overflow": "auto", "display": "block" }}>
                            <h6 className="text-center">שיעורים עבור כיתה זו</h6>
                            {this.createConstraintsBoxes()}
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="w-100 h-100 text-right p-0 card">
                            <h6 className="text-center mb-4">נתונים על שיעור פוטנציאלי לשיבוץ</h6>
                            {this.createPotential()}
                            {this.clashButtons()}
                        </div>
                    </div>
                    <div className="col-4">
                        <div
                            className="w-100 text-center p-0 card"
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