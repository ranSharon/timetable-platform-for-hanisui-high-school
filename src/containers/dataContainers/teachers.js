import React, { Component } from 'react';
import DataTable from './tableDisplay/table';
import AlertMessage from '../../components/alertMessage';
import axios from 'axios';
import down from '../../assets/sort-down.png';
import up from '../../assets/sort-up.png';

let allSubject = [];
let teacherToEditId = '';
let teacherToEdit = '';

class Teachers extends Component {
    mounted = false;
    host = '';

    constructor(props) {
        super(props);
        this.state = {
            // props for teacher detils
            name: '',
            juniorHighSchool: false,
            highSchool: false,
            maxTeachHours: '',
            dayOff: '',
            grades: [],
            subjectsForTeacher: [],
            id: 0,
            currentTeachHours: 0,

            // props for page
            subjects: [],
            teachers: [],
            checked: {
                'ז': false,
                'ח': false,
                'ט': false,
                'י': false,
                'יא': false,
                'יב': false

            },
            selected: false,
            showAlert: false,
            alertMessage: '',
            messageStatus: false,
            buttonType: 'אישור',
            disableButtons: false,
            prevName: '',
            waitingToSave: false,
            teachersFetched: false,

            teacherSortImg: down,
            gradeSortImg: down
        };
        this.getTeacher = this.getTeacher.bind(this);
        this.deleteTeacher = this.deleteTeacher.bind(this);
        this.sortByTeacher = this.sortByTeacher.bind(this);
        this.compareTeacher = this.compareTeacher.bind(this);
        this.sortByGrade = this.sortByGrade.bind(this);
        this.compareGrade = this.compareGrade.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
        if (process.env.NODE_ENV !== 'production') {
            this.host = 'http://localhost:4000'
        }
        // axios.get('http://localhost:4000/data/getSubjects')
        axios.get(this.host + '/data/getSubjects')
            .then(response => {
                if (this.mounted) {
                    this.onlySubjectsAndGrades(response.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        // axios.get('http://localhost:4000/data/getTeachers')
        axios.get(this.host + '/data/getTeachers')
            .then(response => {
                if (this.mounted) {
                    this.setState({ teachers: [...response.data], teachersFetched: true }, () => {
                        console.log(this.state.teachers);
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    componentWillUnmount() {
        this.mounted = false;
        clearTimeout(this.timeoutID);
    }

    componentDidUpdate(prevProps, prevState) {
        if ((prevState.juniorHighSchool !== this.state.juniorHighSchool && this.state.juniorHighSchool === false) ||
            (prevState.highSchool !== this.state.highSchool && this.state.highSchool === false)
        ) {
            let checked = this.state.checked;
            checked['ז'] = false;
            checked['ח'] = false;
            checked['ט'] = false;
            checked['י'] = false;
            checked['יא'] = false;
            checked['יב'] = false;
            this.setState({
                checked: { ...checked },
                subjects: [],
                subjectsForTeacher: [],
                grades: []
            });
        }
    }

    onlySubjectsAndGrades(subjects) {
        allSubject = [];
        subjects.forEach(subject => {
            let newSubject = { subjectName: '', grades: [] }
            newSubject.subjectName = subject.subjectName;
            newSubject.grades = [...subject.grades];
            allSubject = [...allSubject, newSubject];
        });
    }

    onClassCheck(e) {
        const grade = e.target.value;
        let currGrades = [...this.state.grades];
        for (let i = 0; i <= currGrades.length - 1; i++) {
            if (currGrades[i] === grade) {
                currGrades = [...currGrades.slice(0, i).concat(currGrades.slice(i + 1, currGrades.length))];
                this.setState({ grades: [...currGrades] }, function () {
                    this.updateSubjectsForGrades();
                }.bind(this));
                this.updateGradeChecked(grade);
                return;
            }
        }
        this.setState({ grades: [...currGrades, grade] }, function () {
            this.updateSubjectsForGrades();
        }.bind(this));
        this.updateGradeChecked(grade);
    }

    updateGradeChecked(grade) {
        let checked = { ...this.state.checked };
        checked[grade] = !checked[grade];
        this.setState({ checked: checked })
    }

    updateSubjectsForGrades() {
        let grades = [...this.state.grades];
        let subjects = [];
        // run on state grades array
        for (let i = 0; i <= grades.length - 1; i++) {
            // run on allSubject array
            for (let j = 0; j <= allSubject.length - 1; j++) {
                // runs on grades array of allSubject in place j 
                for (let k = 0; k <= allSubject[j].grades.length - 1; k++) {
                    if (allSubject[j].grades[k] === grades[i]) {
                        if (this.subjectExsist(allSubject[j].subjectName, subjects)) {
                            continue;
                        } else {
                            subjects = [...subjects, allSubject[j].subjectName];
                        }
                    }
                }
            }
        }
        this.setState({ subjects: [...subjects] }, function () {
            this.updateSubjectsForTeacher();
        }.bind(this));
    }

    subjectExsist(subject, subjects) {
        for (let i = 0; i <= subjects.length - 1; i++) {
            if (subjects[i] === subject) {
                return true;
            }
        }
        return false;
    }

    handleChose = (subjectName) => {
        let subjectsForTeacher = [...this.state.subjectsForTeacher];
        for (let i = 0; i <= subjectsForTeacher.length - 1; i++) {
            if (subjectName === subjectsForTeacher[i]) {
                subjectsForTeacher = [...subjectsForTeacher.slice(0, i).concat(subjectsForTeacher.slice(i + 1, subjectsForTeacher.length))];
                this.setState({ subjectsForTeacher: [...subjectsForTeacher] });
                return;
            }
        }
        this.setState({ subjectsForTeacher: [...subjectsForTeacher, subjectName] });
    }

    updateSubjectsForTeacher() {
        let subjectsForTeacher = [...this.state.subjectsForTeacher];
        let subjects = [...this.state.subjects];
        if (subjects.length === 0) {
            this.setState({ subjectsForTeacher: [] });
            return;
        }
        outerLoop:
        for (let i = 0; i < subjectsForTeacher.length; i++) {
            for (let j = 0; j <= subjects.length - 1; j++) {
                if (subjects[j] === subjectsForTeacher[i]) {
                    continue outerLoop;
                } else if (j === subjects.length - 1) {
                    subjectsForTeacher = [...subjectsForTeacher.slice(0, i).concat(subjectsForTeacher.slice(i + 1, subjectsForTeacher.length))];
                    i -= 1;
                }
            }
        }
        this.setState({ subjectsForTeacher: [...subjectsForTeacher] });
    }

    onTeacherNameChange(e) {
        this.setState({ name: e.target.value });
    }

    onTeachHoursChange(e) {
        this.setState({ maxTeachHours: e.target.value });
    }

    onDayOffChange(e) {
        this.setState({ dayOff: e.target.value });
    }

    onJuniorHighSchoolCheck() {
        this.setState({ juniorHighSchool: !this.state.juniorHighSchool });
    }

    onHighSchoolCheck() {
        this.setState({ highSchool: !this.state.highSchool });
    }

    setTeachers() {
        if (!this.checkIfInputValid()) {
            return;
        }
        if (this.teacherNameIsTaken()) {
            return;
        }

        let grades = [...this.setCorrecthGrades()];
        let subjectsForTeacher = [...this.setCorrectSubjectsForTeacher()]

        let currentTeachHours = 0;
        if (this.state.buttonType === 'סיים עריכה') {
            if (this.state.prevName === this.state.name) {
                currentTeachHours = this.state.currentTeachHours;
            }
        }

        const newTeacher = {
            name: this.state.name,
            juniorHighSchool: this.state.juniorHighSchool,
            highSchool: this.state.highSchool,
            maxTeachHours: this.state.maxTeachHours,
            currentTeachHours: currentTeachHours,
            dayOff: this.state.dayOff,
            grades: [...grades],
            subjectsForTeacher: [...subjectsForTeacher]
        };

        if (this.state.buttonType === 'אישור') {
            let teacher = {};
            this.setState({ waitingToSave: true }, () => {
                // axios.post('http://localhost:4000/data/addTeacher', newTeacher)
                axios.post(this.host + '/data/addTeacher', newTeacher)
                    .then(res => {
                        if (this.mounted) {
                            teacher = { ...res.data.teacher };
                            this.setState({
                                teachers: [...this.state.teachers, teacher],
                                waitingToSave: false
                            });
                            this.resetInputs();
                        }
                    });
            });
        } else if (this.state.buttonType === 'סיים עריכה') {
            this.setState({ waitingToSave: true }, () => {
                // axios.post('http://localhost:4000/data/updateTeacher/' + teacherToEditId, newTeacher)
                axios.post(this.host + '/data/updateTeacher/' + teacherToEditId, newTeacher)
                    .then(res => {
                        if (this.mounted) {
                            let teachers = [...this.state.teachers];
                            for (let i = 0; i <= teachers.length - 1; i++) {
                                if (teachers[i]._id === res.data._id) {
                                    teachers[i] = { ...res.data };
                                }
                            }
                            this.setState({
                                teachers: [...teachers],
                                buttonType: 'אישור',
                                disableButtons: false,
                                waitingToSave: false
                            });
                            this.resetInputs();
                        }
                    });
            });
        }
    }

    setCorrecthGrades() {
        let correcthGrades = [];
        let subjectsForTeacher = [...this.state.subjectsForTeacher];
        let grades = [...this.state.grades];

        for (let i = 0; i <= subjectsForTeacher.length - 1; i++) {
            for (let j = 0; j <= allSubject.length - 1; j++) {
                if (allSubject[j].subjectName === subjectsForTeacher[i]) {
                    for (let k = 0; k <= grades.length - 1; k++) {
                        for (let l = 0; l <= allSubject[j].grades.length - 1; l++) {
                            if (grades[k] === allSubject[j].grades[l]) {
                                correcthGrades = [...correcthGrades, grades[k]];
                            }
                        }
                    }
                }
            }
        }

        correcthGrades = correcthGrades.filter((item, index) => correcthGrades.indexOf(item) === index);
        return correcthGrades;

    }

    setCorrectSubjectsForTeacher() {
        let CorrectSubjectsForTeacher = [];
        let subjectsForTeacher = [...this.state.subjectsForTeacher];
        let subjectsForTeacherToRemove = [];

        outerLoop:
        for (let i = 0; i <= subjectsForTeacher.length - 1; i++) {
            for (let j = 0; j <= allSubject.length - 1; j++) {
                if (allSubject[j].subjectName === subjectsForTeacher[i]) {
                    continue outerLoop;
                } else if (j === allSubject.length - 1) {
                    subjectsForTeacherToRemove = [...subjectsForTeacherToRemove, subjectsForTeacher[i]];
                }
            }
        }

        CorrectSubjectsForTeacher = subjectsForTeacher.filter(x => !subjectsForTeacherToRemove.includes(x));
        return CorrectSubjectsForTeacher;

    }

    teacherNameIsTaken() {
        let message = '';
        let teachers = [...this.state.teachers];
        let currTeacherName = this.state.name;
        for (let i = 0; i <= teachers.length - 1; i++) {
            if (currTeacherName === teachers[i].name && this.state.buttonType === 'אישור') {
                message = 'הוזן כבר מורה עם השם הזה';
                this.setState({ alertMessage: message, messageStatus: false });
                this.alertMessage();
                return true;
            } else if (currTeacherName === teachers[i].name && currTeacherName !== teacherToEdit && this.state.buttonType === 'סיים עריכה') {
                message = 'הוזן כבר מורה עם השם הזה';
                this.setState({ alertMessage: message, messageStatus: false });
                this.alertMessage();
                return true;
            }
        }
        return false;
    }

    checkIfInputValid() {
        clearTimeout(this.timeoutID);
        let name = this.state.name;
        let juniorHighSchool = this.state.juniorHighSchool;
        let highSchool = this.state.highSchool;
        let maxTeachHours = parseInt(this.state.maxTeachHours);
        let dayOff = this.state.dayOff;
        let grades = [...this.state.grades];
        let subjectsForTeacher = [...this.state.subjectsForTeacher];
        let message = 'ישנה בעיה עם לפחות אחד מן השדות:$';
        let originalMessage = message;
        if (name === '') {
            message += 'לא הוזן שם למורה$';
        }
        if (!juniorHighSchool && !highSchool) {
            message += 'יש לבחור  האם המורה מלמד בחטיבה ו/או בתיכון$';
        }
        if (isNaN(maxTeachHours)) {
            message += 'יש להזין מספר בשדה שעות ההוראה$';
        } else if (maxTeachHours <= 0) {
            message += 'יש להזין מספר גדול מ-0 בשדה שעות ההוראה$';
        }
        if (dayOff === '') {
            message += 'לא נבחר יום חופש רצוי עבור המורה$';
        }
        if (grades.length === 0) {
            message += 'לא נבחרו שכבות שהמורה מלמד$';
        }
        if (subjectsForTeacher.length === 0) {
            message += 'לא נבחרו מקצועות שהמורה מלמד$';
        }

        if (message === originalMessage) {
            return true;
        } else {
            this.setState({ alertMessage: message, messageStatus: false });
            this.alertMessage();
            return false;
        }
    }

    alertMessage() {
        return <AlertMessage
            message={this.state.alertMessage}
            messageStatus={this.state.messageStatus}>
        </AlertMessage>;
    }

    resetInputs() {
        clearTimeout(this.timeoutID);
        let checked = { ...this.state.checked };
        let grades = [...this.state.grades];
        let subjectsForTeacher = [...this.state.subjectsForTeacher]
        let subjects = [...this.state.subjects];
        let name = this.state.name;
        let juniorHighSchool = this.state.juniorHighSchool;
        let highSchool = this.state.highSchool;
        let maxTeachHours = this.state.maxTeachHours;
        let dayOff = this.state.dayOff;
        let alertMessage = this.state.alertMessage;
        for (let grade in checked) {
            checked[grade] = false;
        }
        grades = [];
        subjectsForTeacher = [];
        subjects = [];
        name = '';
        maxTeachHours = '';
        juniorHighSchool = false;
        highSchool = false;
        dayOff = '';
        alertMessage = 'הערך נשמר - אפשר להזין מורה חדש';
        this.setState({
            grades: grades,
            subjectsForTeacher: subjectsForTeacher,
            subjects: subjects,
            checked: checked,
            name: name,
            juniorHighSchool: juniorHighSchool,
            highSchool: highSchool,
            maxTeachHours: maxTeachHours,
            dayOff: dayOff,
            alertMessage: alertMessage,
            messageStatus: true
        }, () => {
            this.timeoutID = setTimeout(() => { this.setState({ alertMessage: '' }) }, 1500);
        });
    }

    getTeacher(teacherId) {
        window.scrollTo(0, 0);
        clearTimeout(this.timeoutID);
        teacherToEditId = teacherId;
        // axios.get('http://localhost:4000/data/getTeacher/' + teacherId)
        axios.get(this.host + '/data/getTeacher/' + teacherId)
            .then(response => {
                if (this.mounted) {
                    let checked = {
                        'ז': false,
                        'ח': false,
                        'ט': false,
                        'י': false,
                        'יא': false,
                        'יב': false
                    }
                    let grades = [...response.data.grades];
                    grades.forEach(grade => {
                        checked[grade] = true;
                    })

                    let subjects = [...this.setSubjectForEdting(grades)];
                    let alertMessage = 'עריכת פרטי המורה: ' + response.data.name;
                    teacherToEdit = response.data.name;
                    this.setState({
                        grades: [...response.data.grades],
                        subjectsForTeacher: [...response.data.subjectsForTeacher],
                        subjects: subjects,
                        checked: checked,
                        name: response.data.name,
                        prevName: response.data.name,
                        currentTeachHours: response.data.currentTeachHours,
                        juniorHighSchool: response.data.juniorHighSchool,
                        highSchool: response.data.highSchool,
                        maxTeachHours: response.data.maxTeachHours,
                        dayOff: response.data.dayOff,
                        alertMessage: alertMessage,
                        messageStatus: true,
                        buttonType: 'סיים עריכה',
                        disableButtons: true
                    })
                    this.alertMessage();
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    setSubjectForEdting(grades) {
        let subjects = [];
        outerLoop:
        for (let i = 0; i <= allSubject.length - 1; i++) {
            for (let j = 0; j <= allSubject[i].grades.length - 1; j++) {
                for (let k = 0; k <= grades.length - 1; k++) {
                    if (grades[k] === allSubject[i].grades[j]) {
                        if (this.subjectExsist(allSubject[i].subjectName, subjects)) {
                            continue outerLoop;
                        } else {
                            subjects.push(allSubject[i].subjectName);
                        }
                    }
                }
            }
        }
        return subjects;
    }

    deleteTeacher(teacherId) {
        // axios.post('http://localhost:4000/data/deleteTeacher/' + teacherId)
        axios.post(this.host + '/data/deleteTeacher/' + teacherId)
            .then(response => {
                if (this.mounted) {
                    let teachers = [...this.state.teachers];
                    for (let i = 0; i <= teachers.length - 1; i++) {
                        if (teachers[i]._id === teacherId) {
                            teachers = [...teachers.slice(0, i).concat(teachers.slice(i + 1, teachers.length))];
                            break;
                        }
                    }
                    this.setState({ teachers: [...teachers] });
                }
            })
            .catch(function (error) {
                console.log(error);
            })

    }

    showJuniorHighSchool() {
        if (!this.state.juniorHighSchool) {
            return null;
        }

        return (
            <div>
                <div style={{ textAlign: "right" }}>
                    <input type="checkbox" lable="ז" value="ז" checked={this.state.checked['ז']} onChange={(e) => this.onClassCheck(e)} />
                    <div style={{ display: "inline" }}> {'ז'}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <input type="checkbox" lable="ח" value="ח" checked={this.state.checked['ח']} onChange={(e) => this.onClassCheck(e)} />
                    <div style={{ display: "inline" }}> {'ח'}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <input type="checkbox" lable="ט" value="ט" checked={this.state.checked['ט']} onChange={(e) => this.onClassCheck(e)} />
                    <div style={{ display: "inline" }}> {'ט'}</div>
                </div>
            </div>
        );
    }

    showHighSchool() {
        if (!this.state.highSchool) {
            return null;
        }
        return (
            <div>
                <div style={{ textAlign: "right" }}>
                    <input type="checkbox" lable="י" value="י" checked={this.state.checked['י']} onChange={(e) => this.onClassCheck(e)} />
                    <div style={{ display: "inline" }}> {'י'}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <input type="checkbox" lable="יא" value="יא" checked={this.state.checked['יא']} onChange={(e) => this.onClassCheck(e)} />
                    <div style={{ display: "inline" }}> {'יא'}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <input type="checkbox" lable="יב" value="יב" checked={this.state.checked['יב']} onChange={(e) => this.onClassCheck(e)} />
                    <div style={{ display: "inline" }}> {'יב'}</div>
                </div>
            </div>
        );
    }

    sortByTeacher() {
        let imgSrc = this.state.teacherSortImg;
        if (imgSrc === down) {
            imgSrc = up;
        } else if (imgSrc === up) {
            imgSrc = down;
        }
        this.setState({
            teachers: [...this.state.teachers.sort(this.compareTeacher)],
            teacherSortImg: imgSrc
        });
    }

    compareTeacher(a, b) {
        const teacherA = a.name;
        const teacherB = b.name;

        let comparison = 0;
        if (this.state.teacherSortImg === down) {
            if (teacherA > teacherB) {
                comparison = 1;
            } else if (teacherA < teacherB) {
                comparison = -1;
            }
        } else if (this.state.teacherSortImg === up) {
            if (teacherA < teacherB) {
                comparison = 1;
            } else if (teacherA > teacherB) {
                comparison = -1;
            }
        }
        return comparison;
    }

    sortByGrade() {
        let imgSrc = this.state.gradeSortImg;
        if (imgSrc === down) {
            imgSrc = up;
        } else if (imgSrc === up) {
            imgSrc = down;
        }
        this.setState({
            teachers: [...this.state.teachers.sort(this.compareGrade)],
            gradeSortImg: imgSrc
        });
    }

    compareGrade(a, b) {
        const gradeA = a.grades[0];
        const gradeB = b.grades[0];

        let comparison = 0;
        if (this.state.gradeSortImg === down) {
            if (gradeA > gradeB) {
                comparison = 1;
            } else if (gradeA < gradeB) {
                comparison = -1;
            }
        } else if (this.state.gradeSortImg === up) {
            if (gradeA < gradeB) {
                comparison = 1;
            } else if (gradeA > gradeB) {
                comparison = -1;
            }
        }
        return comparison;
    }

    saveButton() {
        if (!this.state.waitingToSave) {
            return (
                <button type="button" className="btn btn-secondary" onClick={() => this.setTeachers()}>{this.state.buttonType}</button>
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
        return (
            <div>
                <h4 style={{ "textAlign": "right" }}>הגדרת נתונים ושיעורים/ מורים</h4>
                <div className="row">
                    <div className="col-4">
                        <h5 style={{ textAlign: "right" }}>{'פרטים'}</h5>
                        <div className="input-group mt-3 mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1">הגדר מורה חדש</span>
                            </div>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="מורה..."
                                value={this.state.name}
                                aria-label="Username"
                                aria-describedby="basic-addon1"
                                onChange={(e) => (this.onTeacherNameChange(e))}
                            >
                            </input>
                        </div>
                        <div style={{ float: "right" }}>
                            <div style={{ textAlign: "right" }}>
                                <input type="checkbox" value="חטיבה" checked={this.state.juniorHighSchool} onChange={() => this.onJuniorHighSchoolCheck()} />
                                <div style={{ display: "inline" }}> {'חטיבה'} </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <input type="checkbox" value="תיכון" checked={this.state.highSchool} onChange={() => this.onHighSchoolCheck()} />
                                <div style={{ display: "inline" }}> {'תיכון'}</div>
                            </div>
                            <div className="input-group mt-3 mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1">מספר שעות הוראה מקסימלי</span>
                                </div>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="שעות הוראה..."
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    value={this.state.maxTeachHours}
                                    onChange={(e) => (this.onTeachHoursChange(e))}
                                >
                                </input>
                            </div>
                            <div className="input-group mt-3 mb-3">
                                <div className="input-group-append">
                                    <label className="input-group-text" htmlFor="inputGroupSelect02">יום חופש רצוי</label>
                                </div>
                                <select className="custom-select" id="inputGroupSelect02" value={this.state.dayOff} onChange={(e) => this.onDayOffChange(e)}>
                                    <option value=''>יום...</option>
                                    <option value="ראשון">ראשון</option>
                                    <option value="שני">שני</option>
                                    <option value="שלישי">שלישי</option>
                                    <option value="רביעי">רביעי</option>
                                    <option value="חמישי">חמישי</option>
                                    <option value="שישי">שישי</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="col-2">
                        <div style={{ float: "right" }}>
                            <h5 style={{ textAlign: "right" }}>{'מלמד בכיתות'}</h5>
                            {this.showJuniorHighSchool()}
                            {this.showHighSchool()}
                        </div>
                    </div>
                    <div className="col-6">
                        <h5 style={{ textAlign: "right" }}>{'נא לסמן מקצועות שהמורה מלמד'}</h5>
                        <DataTable
                            subjects={this.state.subjects}
                            chosenSubjects={this.state.subjectsForTeacher}
                            table="subjetsToChoose"
                            onChose={this.handleChose}>
                        </DataTable>
                    </div>
                </div>
                {/* <button type="button" className="btn btn-secondary" onClick={() => this.setTeachers()}>{this.state.buttonType}</button> */}
                {this.saveButton()}
                {this.alertMessage()}
                {this.state.teachersFetched ?
                    (<DataTable
                        teachers={this.state.teachers}
                        table="teachers"
                        onEdit={this.getTeacher}
                        onDelete={this.deleteTeacher}
                        disableButtons={this.state.disableButtons}
                        sortByTeacher={this.sortByTeacher}
                        teacherSortImg={this.state.teacherSortImg}
                        sortByGrade={this.sortByGrade}
                        gradeSortImg={this.state.gradeSortImg}>
                    </DataTable>) :
                    (<div className="text-center mt-5">
                        <div className="spinner-border" style={{ "width": "3rem", "height": "3rem" }} role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>)
                }
                {/* <DataTable
                    teachers={this.state.teachers}
                    table="teachers"
                    onEdit={this.getTeacher}
                    onDelete={this.deleteTeacher}
                    disableButtons={this.state.disableButtons}
                    sortByTeacher={this.sortByTeacher}
                    teacherSortImg={this.state.teacherSortImg}
                    sortByGrade={this.sortByGrade}
                    gradeSortImg={this.state.gradeSortImg}>
                </DataTable> */}
            </div >
        );
    }
}

export default Teachers;