import React, { Component } from 'react';
import DataTable from '../dataContainers/tableDisplay/table';
import AlertMessage from '../../components/alertMessage';
import axios from 'axios';

let allSubject = [];
let teacherToEditId = '';
let teacherToEdit = '';



class Teachers extends Component {
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
            buttonType: 'אישור',
            disableButtons: false
        };
        this.getTeacher = this.getTeacher.bind(this);
        this.deleteTeacher = this.deleteTeacher.bind(this);
    }

    componentDidMount() {
        axios.get('http://localhost:4000/data/getSubjects')
            .then(response => {
                this.onlySubjectsAndGrades(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
        axios.get('http://localhost:4000/data/getTeachers')
            .then(response => {
                this.setState({ teachers: [...response.data] });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    onlySubjectsAndGrades(subjects) {
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
        const newTeacher = {
            name: this.state.name,
            juniorHighSchool: this.state.juniorHighSchool,
            highSchool: this.state.highSchool,
            maxTeachHours: this.state.maxTeachHours,
            dayOff: this.state.dayOff,
            grades: [...this.state.grades],
            subjectsForTeacher: [...this.state.subjectsForTeacher]
        };
        if (this.state.buttonType === 'אישור') {
            let teacher = {};
            axios.post('http://localhost:4000/data/addTeacher', newTeacher)
                .then(res => {
                    teacher = { ...res.data.teacher };
                    this.setState({
                        teachers: [...this.state.teachers, teacher]
                    });
                    this.resetInputs();
                });
        } else if (this.state.buttonType === 'ערוך') {
            axios.post('http://localhost:4000/data/updateTeacher/' + teacherToEditId, newTeacher)
                .then(res => {
                    let teachers = [...this.state.teachers];
                    for (let i = 0; i <= teachers.length - 1; i++) {
                        if (teachers[i]._id === res.data._id) {
                            teachers[i] = { ...res.data };
                        }
                    }
                    this.setState({
                        teachers: [...teachers],
                        buttonType: 'אישור',
                        disableButtons: false
                    });
                    this.resetInputs();
                });
        }
    }

    teacherNameIsTaken() {
        let message = '';
        let originalMessage = message;
        let teachers = [...this.state.teachers];
        let currTeacherName = this.state.name;
        for (let i = 0; i <= teachers.length - 1; i++) {
            if (currTeacherName === teachers[i].name && this.state.buttonType === 'אישור') {
                message = 'הוזן כבר מורה עם השם הזה,';
                this.setState({ alertMessage: message });
                this.alertMessage();
                return true;
            } else if (currTeacherName === teachers[i].name && currTeacherName !== teacherToEdit && this.state.buttonType === 'ערוך') {
                message = 'הוזן כבר מורה עם השם הזה,';
                this.setState({ alertMessage: message });
                this.alertMessage();
                return true;
            }
        }
        return false;
    }

    checkIfInputValid() {
        let name = this.state.name;
        let juniorHighSchool = this.state.juniorHighSchool;
        let highSchool = this.state.highSchool;
        let maxTeachHours = parseInt(this.state.maxTeachHours);
        let dayOff = this.state.dayOff;
        let grades = [...this.state.grades];
        let subjectsForTeacher = [...this.state.subjectsForTeacher];
        let message = 'ישנה בעיה עם לפחות אחד מן השדות:,';
        let originalMessage = message;
        if (name === '') {
            message += 'לא הוזן שם למורה,';
        }
        if (!juniorHighSchool && !highSchool) {
            message += 'יש לבחור  האם המורה מלמד בחטיבה ו/או בתיכון,';
        }
        if (isNaN(maxTeachHours)) {
            message += 'יש להזין מספר בשדה שעות ההוראה,';
        } else if (maxTeachHours <= 0) {
            message += 'יש להזין מספר גדול מ-0 בשדה שעות ההוראה,';
        }
        if (dayOff === '') {
            message += 'לא נבחר יום חופש רצוי עבור המורה,';
        }
        if (grades.length === 0) {
            message += 'לא נבחרו שכבות שהמורה מלמד,';
        }
        if (subjectsForTeacher.length === 0) {
            message += 'לא נבחרו מקצועות שהמטרה מלמד,';
        }

        if (message === originalMessage) {
            return true;
        } else {
            this.setState({ alertMessage: message });
            this.alertMessage();
            return false;
        }
    }

    alertMessage() {
        let alertMessage = this.state.alertMessage;
        return <AlertMessage message={this.state.alertMessage}></AlertMessage>;
    }

    resetInputs() {
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
            alertMessage: alertMessage
        });
    }

    getTeacher(teacherId) {
        teacherToEditId = teacherId;
        axios.get('http://localhost:4000/data/getTeacher/' + teacherId)
            .then(response => {
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
                    juniorHighSchool: response.data.juniorHighSchool,
                    highSchool: response.data.highSchool,
                    maxTeachHours: response.data.maxTeachHours,
                    dayOff: response.data.dayOff,
                    alertMessage: alertMessage,
                    buttonType: 'ערוך',
                    disableButtons: true
                })
                this.alertMessage();
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
        axios.post('http://localhost:4000/data/deleteTeacher/' + teacherId)
            .then(response => {
                let teachers = [...this.state.teachers];
                for (let i = 0; i <= teachers.length - 1; i++) {
                    if (teachers[i]._id === teacherId) {
                        teachers = [...teachers.slice(0, i).concat(teachers.slice(i + 1, teachers.length))];
                        break;
                    }
                }
                this.setState({ teachers: [...teachers] });
            })
            .catch(function (error) {
                console.log(error);
            })

    }

    render() {
        return (
            <div>
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
                    </div>
                    <div className="col-6">
                        <h5 style={{ textAlign: "right" }}>{'נא לסמן מקצועות שהמורה מלמד'}</h5>
                        <DataTable
                            subjects={this.state.subjects}
                            chosenSubjects={this.state.subjectsForTeacher}
                            table="subjetsTochose"
                            onChose={this.handleChose}></DataTable>
                    </div>
                </div>
                <button type="button" className="btn btn-secondary" onClick={() => this.setTeachers()}>{this.state.buttonType}</button>
                {this.alertMessage()}
                {/* <DataTable teachers={this.state.teachers} table="teachers" onChoose={this.handleChoose} onEdit={this.getTeacher}></DataTable> */}
                <DataTable
                    teachers={this.state.teachers}
                    table="teachers"
                    onEdit={this.getTeacher}
                    onDelete={this.deleteTeacher}
                    disableButtons={this.state.disableButtons}>
                </DataTable>
            </div >
        );
    }
}

export default Teachers;

