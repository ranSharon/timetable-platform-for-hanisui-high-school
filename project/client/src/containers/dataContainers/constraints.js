import React, { Component } from 'react';
import axios from 'axios';
import Constraint from '../../components/constraintComponents/constraint';
import AlertMessage from '../../components/alertMessage';
import LessonSplit from '../../components/constraintComponents/lessonSplit'

class Constraints extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // fields to check if valid
            teacher: '',
            subject: '',
            grade: '',
            hours: '0',
            classNumber: [''],
            lessonSplit: false,
            numOfSplits: 0,
            firstLesson: 0,
            secondlesson: 0,
            thirdlesson: 0,

            // this parms also in constraint model
            subjectGrouping: false,
            subjectMix: false,
            subjectFeatures: [],
            constraints: [],

            teacherDetails: {},
            subjectsDetails: {},
            subjectBagrut: false,
            subjectGmol: 0,
            subjectNumOfMix: '',
            copyConstraint: false,
            groupingTeachers: [],

            teachers: [],
            subjects: [],
            grades: [],
            classes: [],

            allGrades: [],
            allSubjects: [],
            allTeachers: [],

            alertMessage: '',
            teacherAlertMessage: '',
            teacherAlertMessageStatus: true,
            subjectAlertMessage: '',
            buttonType: 'אישור',
            disableButtons: false,
            teacherButtonType: 'הצג פרטיי מורה',
            subjectButtonType: 'הצג פרטיי מקצוע'

        }
        this.setSubjects = this.setSubjects.bind(this);
        this.setGrades = this.setGrades.bind(this);
        this.setClasses = this.setClasses.bind(this);
        this.setClass = this.setClass.bind(this);
        this.setHours = this.setHours.bind(this);
        this.setClass = this.setClass.bind(this);
        this.setLessonSplit = this.setLessonSplit.bind(this);
        this.setNumOfSplits = this.setNumOfSplits.bind(this);
        this.setFirstLesson = this.setFirstLesson.bind(this);
        this.setSecondlesson = this.setSecondlesson.bind(this);
        this.setThirdlesson = this.setThirdlesson.bind(this);
    }

    componentDidMount() {
        axios.get('http://localhost:4000/data/getTeachers')
            .then(response => {
                this.setState({ allTeachers: [...response.data] });
                console.log('allTeachers:')
                console.log(this.state.allTeachers);
                this.setTeachers();
            })
            .catch(function (error) {
                console.log(error);
            });
        axios.get('http://localhost:4000/data/getGrades')
            .then(response => {
                this.setState({ allGrades: [...response.data] });
                console.log('allGrades:')

                console.log(this.state.allGrades);
            })
            .catch(function (error) {
                console.log(error);
            });
        axios.get('http://localhost:4000/data/getSubjects')
            .then(response => {
                this.setState({ allSubjects: [...response.data] });
                console.log('allSubjects:')
                console.log(this.state.allSubjects);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.hours !== this.state.hours) {
            //console.log('hours change');
            if (!this.isTeacherDetailsEmpty()) {
                // console.log('teacherDetails in not empty')
                let teacherDetails = { ...this.state.teacherDetails };
                this.setTeacherAlertMessage(teacherDetails);
            }
        }
        if (prevState.subjectBagrut !== this.state.subjectBagrut) {
            let teacherDetails = { ...this.state.teacherDetails };
            this.setTeacherAlertMessage(teacherDetails);
        }
        console.log(this.state.groupingTeachers);
        //console.log(this.state.subjectMix);
    }

    setTeachers() {
        let teachers = [];
        this.state.allTeachers.forEach(teacher => {
            teachers.push(teacher.name);
        });
        //console.log(teachers);
        this.setState({ teachers: [...teachers] });
    }

    setHours(e) {
        let hours = '';
        if (e.target.value === '') {
            hours = '0';
        } else {
            hours = e.target.value;
        }
        this.setState({ hours: hours });
    }

    isTeacherDetailsEmpty() {
        let teacherDetails = { ...this.state.teacherDetails };
        for (let key in teacherDetails) {
            if (teacherDetails.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    setSubjects(e, groupIndex) {
        let teacher = e.target.value;
        console.log(groupIndex);
        if (groupIndex !== 0) {
            let groupingTeachers = [...this.state.groupingTeachers];
            groupingTeachers[groupIndex] = teacher;
            this.setState({ groupingTeachers: [...groupingTeachers] });
            return;
        }
        let teacherDetails = {};
        let groupingTeachers = [...this.state.groupingTeachers];
        groupingTeachers[groupIndex] = teacher;
        let subjects = [];
        for (let i = 0; i <= this.state.allTeachers.length - 1; i++) {
            if (this.state.allTeachers[i].name === teacher) {
                subjects = [...this.state.allTeachers[i].subjectsForTeacher];
                teacherDetails = { ...this.state.allTeachers[i] };
                break;
            }
        }
        this.setState({
            teacher: teacher,
            teacherDetails: { ...teacherDetails },
            subjects: [...subjects],
            subject: '',
            grade: '',
            classNumber: [''],
            grades: [],
            classes: [],
            subjectGrouping: false,
            subjectAlertMessage: '',
            groupingTeachers: [...groupingTeachers]
        });
        this.setTeacherAlertMessage(teacherDetails);
    }

    setTeacherAlertMessage(teacherDetails) {
        let teacherAlertMessage = '';
        // if(this.state.teacher === ''){
        //     return;
        // }
        let maxTeachHours = parseInt(teacherDetails.maxTeachHours);
        let currentTeachHours = teacherDetails.currentTeachHours;
        let hours = parseInt(this.state.hours);
        let newCurrentTeachHours = currentTeachHours + hours;

        if (this.state.subjectBagrut) {
            newCurrentTeachHours += this.state.subjectGmol;
        }


        teacherAlertMessage = 'המורה ' + teacherDetails.name + '$מספר שעות הוראה שבועיות מקסמילי: ' + maxTeachHours + '$שעות הוראה שבועיות נוכחי: ' + currentTeachHours + '$שעות הוראה שבועיות עם הוספת אילוץ זה: ' + newCurrentTeachHours;
        this.setState({
            teacherDetails: { ...teacherDetails },
            teacherAlertMessage: teacherAlertMessage
        });
        if (newCurrentTeachHours <= maxTeachHours) {
            teacherDetails.currentTeachHours = newCurrentTeachHours;
        }
    }

    getGmol(gmol) {
        let gmolArray = gmol.split(':');
        let hours = parseInt(gmolArray[0]);
        let minutes = gmolArray[1];
        if (minutes === '00') {
            minutes = 0;
        } else if (minutes === '15') {
            minutes = 0.25;
        } else if (minutes === '30') {
            minutes = 0.50;
        } else if (minutes === '45') {
            minutes = 0.75;
        }

        console.log(hours + minutes);
        return hours + minutes;
    }

    setGrades(e) {
        let subject = e.target.value;
        let subjectsDetails = { ...this.getSubjectsDetails(subject) };

        let allteacherGrades = [...this.state.teacherDetails.grades];
        //let allteacherGrades = [...this.getAllteacherGrades()];
        let allSubjectGrades = [...subjectsDetails.grades];
        let subjectMix = subjectsDetails.mix;
        let subjectGrouping = subjectsDetails.grouping;
        let subjectNumOfMix = subjectsDetails.numOfMix;
        let copyConstraint = false;
        let subjectBagrut = subjectsDetails.bagrut;
        let subjectGmol = this.getGmol(subjectsDetails.gmol);
        console.log(subjectsDetails);
        let grades = allteacherGrades.filter(grade => allSubjectGrades.includes(grade));
        let groupingTeachers = [this.state.teacher];
        if (subjectGrouping) {
            copyConstraint = true;
            let numOfMix = parseInt(subjectNumOfMix) - 1;
            for (let i = 1; i <= numOfMix; i++) {
                groupingTeachers = [...groupingTeachers, ''];
            }
        }
        this.setState({
            subject: subject,
            grades: [...grades],
            subjectsDetails: { ...subjectsDetails },
            subjectMix: subjectMix,
            subjectGrouping: subjectGrouping,
            subjectNumOfMix: subjectNumOfMix,
            subjectBagrut: subjectBagrut,
            subjectGmol: subjectGmol,
            copyConstraint: copyConstraint,
            groupingTeachers: [...groupingTeachers],
            grade: '',
            classNumber: [''],
            classes: [],
        });
        //this.setTeacherAlertMessage(this.state.teacherDetails);
        this.setSubjectAlertMessage(subjectsDetails, grades);
    }

    getAllteacherGrades() {
        let teacher = this.state.teacher;
        let allteacherGrades = [];
        for (let i = 0; i <= this.state.allTeachers.length - 1; i++) {
            if (this.state.allTeachers[i].name === teacher) {
                allteacherGrades = [...this.state.allTeachers[i].grades];
                break;
            }
        }
        return allteacherGrades;
    }

    getAllSubjectGrades(subject) {
        //let subjectsDetails = [];
        let allSubjectGrades = [];
        for (let i = 0; i <= this.state.allSubjects.length - 1; i++) {
            if (this.state.allSubjects[i].subjectName === subject) {
                allSubjectGrades = [...this.state.allSubjects[i].grades];
                break;
            }
        }
        return allSubjectGrades;
    }

    getSubjectsDetails(subject) {
        let subjectsDetails = {};
        for (let i = 0; i <= this.state.allSubjects.length - 1; i++) {
            if (this.state.allSubjects[i].subjectName === subject) {
                subjectsDetails = { ...this.state.allSubjects[i] };
                break;
            }
        }
        return subjectsDetails;
    }

    setSubjectAlertMessage(subjectDetails) {
        let subjectAlertMessage = 'המקצוע ' + subjectDetails.subjectName + '$';

        subjectAlertMessage += 'המקצוע נלמד בשכבות ';
        subjectDetails.grades.forEach((grade, index) => {
            if (index < subjectDetails.grades.length - 1) {
                subjectAlertMessage += grade + ', ';
            } else {
                subjectAlertMessage += grade;
            }
        });
        if (subjectDetails.bagrut) {
            subjectAlertMessage += '$בכיתות ';
            let highSchoolGrades = subjectDetails.grades.filter(grade => grade > 'ט');
            highSchoolGrades.forEach((grade, index) => {
                if (index < highSchoolGrades.length - 1) {
                    subjectAlertMessage += grade + ', ';
                } else {
                    subjectAlertMessage += grade;
                }
            });
            subjectAlertMessage += ' נלמד כמקצוע לבגרות$'
            subjectAlertMessage += 'הגמול עבור מקצוע זה: ' + subjectDetails.gmol;
        }
        subjectAlertMessage += '$המורה ' + this.state.teacher + ' מלמד/ת מקצוע זה בכיתות ';

        let teacherGradesForSubjest = this.state.teacherDetails.grades.filter(grade => subjectDetails.grades.includes(grade));
        teacherGradesForSubjest.forEach((grade, index) => {
            if (index < teacherGradesForSubjest.length - 1) {
                subjectAlertMessage += grade + ', ';
            } else {
                subjectAlertMessage += grade;
            }
        });
        if (subjectDetails.mix) {
            subjectAlertMessage += '$מקצוע זה נלמד בערבוב שכבה';
        }
        if (subjectDetails.grouping) {
            subjectAlertMessage += '$מקצוע זה מחלוק ל-' + subjectDetails.numOfMix + ' הקבצות';
        }

        this.setState({ subjectAlertMessage: subjectAlertMessage })
    }

    setClasses(e) {
        let grade = e.target.value;
        let classes = [];
        let numOfClasses = 0;
        for (let i = 0; i <= this.state.allGrades.length - 1; i++) {
            if (this.state.allGrades[i].grade === grade) {
                numOfClasses = this.state.allGrades[i].numOfClasses;
                break;
            }
        }
        numOfClasses = parseInt(numOfClasses);
        for (let i = 1; i <= numOfClasses; i++) {
            classes.push(grade + i);
        }
        if (this.state.subjectMix) {
            this.setState({
                grade: grade,
                classNumber: [...classes],
                classes: [...classes]
            });
        } else {
            this.setState({
                grade: grade,
                classNumber: [''],
                classes: [...classes]
            });
        }
    }

    setClass(e) {
        //console.log(e.target.value);
        let classNumber = [e.target.value];
        this.setState({ classNumber: [...classNumber] });
    }

    CopyConstraint() {
        if (this.state.subjectGrouping) {
            let numOfCopyConstraint = parseInt(this.state.subjectNumOfMix) - 1;
            let CopyConstraints = [];
            let teachers = [];
            let subject = this.state.subject;
            let grade = this.state.grade;
            let allTeachers = [...this.state.allTeachers];
            if (grade !== '') {
                allTeachers.forEach(teacher => {
                    if (teacher.subjectsForTeacher.includes(subject) && teacher.grades.includes(grade)) {
                        teachers = [...teachers, teacher.name]
                    }
                });
            }
            console.log(teachers);
            for (let i = 1; i <= numOfCopyConstraint; i++) {
                CopyConstraints = [...CopyConstraints,
                <div key={i}>
                    <h6 className="mb-0 mt-3" style={{ "textAlign": "right" }}>הקבצה {i + 1}</h6>
                    <Constraint
                        copyConstraint={this.state.copyConstraint}

                        hours={this.state.hours}

                        teacher={this.state.groupingTeachers[i]}
                        teachers={teachers}
                        onTeacherSelected={this.setSubjects}
                        groupNum={i}

                        subject={this.state.subject}

                        grade={this.state.grade}

                        classNumber={this.state.classNumber}>
                    </Constraint>
                </div>
                ];
            }
            return (
                <div>
                    {CopyConstraints}
                </div>);
        }
        else {
            return null;
        }
    }

    mainConstraintHeadLime() {
        if (this.state.subjectGrouping) {
            return (
                <h6 className="mb-0 mt-3" style={{ "textAlign": "right" }}>הקבצה 1</h6>
            );
        } else {
            return null;
        }
    }

    lesoonSplit() {
        if (this.state.hours !== '0' && this.state.hours !== '1') {
            return <LessonSplit
                lessonSplit={this.state.lessonSplit}
                onlessonSplitClick={this.setLessonSplit}
                numOfSplits={this.state.numOfSplits}
                onNumOfSplitsSelected={this.setNumOfSplits}
                hours={this.state.hours}
                firstLesson={this.state.firstLesson}
                onFirstLessonSelected={this.setFirstLesson}
                secondlesson={this.state.secondlesson}
                onSecondLessonSelected={this.setSecondlesson}
                thirdlesson={this.state.thirdlesson}
                onThirdLessonSelected={this.setThirdlesson}>
            </LessonSplit>;
        }
    }

    setLessonSplit(e) {
        console.log(e.target.value);
        let lessonSplit;
        if (e.target.value === 'כן') {
            lessonSplit = true;
        } else if (e.target.value === 'לא') {
            lessonSplit = false;
        }
        this.setState({
            lessonSplit: lessonSplit,
            numOfSplits: 0,
            firstLesson: 0,
            secondlesson: 0,
            thirdlesson: 0,
        });
    }

    setNumOfSplits(e) {
        let numOfSplits = parseInt(e.target.value);
        this.setState({
            numOfSplits: numOfSplits,
            firstLesson: 0,
            secondlesson: 0,
            thirdlesson: 0,
        })
    }

    setFirstLesson(e) {
        let firstLesson = parseInt(e.target.value);
        this.setState({
            firstLesson: firstLesson,
            secondlesson: 0,
            thirdlesson: 0,
        })
    }

    setSecondlesson(e) {
        let secondlesson = parseInt(e.target.value);
        this.setState({
            secondlesson: secondlesson,
            thirdlesson: 0,
        })
    }

    setThirdlesson(e) {
        let thirdlesson = parseInt(e.target.value);
        this.setState({ thirdlesson: thirdlesson })
    }

    setConstraints() {
        console.log('submit');
        if (!this.checkIfInputValid()) {
            return;
        }
        // if (this.teacherNameIsTaken()) {
        //     return;
        // }
    }

    checkIfInputValid() {
        let teacher = this.state.teacher; // string init ''
        let subject = this.state.subject; // string init ''
        let grade = this.state.grade; // string init ''
        let hours = this.state.hours; // string init '0'
        let classNumber = [...this.state.classNumber]; // arary string init ['']
        let lessonSplit = this.state.lessonSplit; // bool init false
        let numOfSplits = this.state.numOfSplits; // number init 0
        let firstLesson = this.state.firstLesson; // number init 0
        let secondlesson = this.state.secondlesson; // number init 0
        let thirdlesson = this.state.thirdlesson; // number init 0
        let message = 'ישנה בעיה עם לפחות אחד מן השדות:$';
        let originalMessage = message;
        if (hours === '0') {
            message += 'לא נבחרו שעות לימוד עבור שיעור$';
        }
        if (teacher === '') {
            message += 'לא נבחר מורה$';
        }
        if (subject === '') {
            message += 'לא נבחר מקצוע$';
        }
        if (grade === '') {
            message += 'לא נבחרה שכבה$';
        }
        if (classNumber[0] === '') {
            message += 'לא נבחרה כיתה עבור השיעור$';
        }
        if (lessonSplit) {
            if (numOfSplits === 0) {
                message += 'השיעור הוגדר כמפוצל למספר שיעורים אך לא נבחרה כמות פיצולים$';
            } else if (numOfSplits === 2) {
                if (firstLesson === 0) {
                    message += 'הוגדר ששיעור זה מפוצל לשני שיעורים אך לא הוגדרו מספר שעות עבור שיעור ראשון$';
                } else if (secondlesson === 0) {
                    message += 'הוגדר ששיעור זה מפוצל לשני שיעורים אך לא הוגדרו מספר שעות עבור שיעור שני$';
                }
            } else if (numOfSplits === 3) {
                if (firstLesson === 0) {
                    message += 'הוגדר ששיעור זה מפוצל לשלושה שיעורים אך לא הוגדרו מספר שעות עבור שיעור ראשון$';
                } else if (secondlesson === 0) {
                    message += 'הוגדר ששיעור זה מפוצל לשלושה שיעורים אך לא הוגדרו מספר שעות עבור שיעור שני$';
                } else if (thirdlesson === 0) {
                    message += 'הוגדר ששיעור זה מפוצל לשלושה שיעורים אך לא הוגדרו מספר שעות עבור שיעור שלישי$';
                }
            }

        }

        if (message === originalMessage) {
            message = '';
            this.setState({ alertMessage: message, messageStatus: false });
            this.alertMessage();
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

    setTeacherButtonType() {
        let teacherButtonType = this.state.teacherButtonType;
        if (this.state.teacher === '') {
            return;
        }
        if (teacherButtonType === 'הצג פרטיי מורה') {
            teacherButtonType = 'הסתר פרטיי מורה';
        } else {
            teacherButtonType = 'הצג פרטיי מורה';
        }
        this.setState({ teacherButtonType: teacherButtonType });
    }

    showTeacherDetails() {
        if (this.state.teacherButtonType === 'הסתר פרטיי מורה') {
            return (
                <AlertMessage
                    message={this.state.teacherAlertMessage}
                    messageStatus={this.state.teacherAlertMessageStatus}
                ></AlertMessage>
            );
        } else {
            return null;
        }
    }

    setSubjectButtonType() {
        let subjectButtonType = this.state.subjectButtonType;
        if (this.state.subject === '') {
            return;
        }
        if (subjectButtonType === 'הצג פרטיי מקצוע') {
            subjectButtonType = 'הסתר פרטיי מקצוע';
        } else {
            subjectButtonType = 'הצג פרטיי מקצוע';
        }
        this.setState({ subjectButtonType: subjectButtonType });
    }

    showSubjectDetails() {
        if (this.state.subjectButtonType === 'הסתר פרטיי מקצוע') {
            return (
                <AlertMessage
                    className="col-6"
                    message={this.state.subjectAlertMessage}
                    messageStatus={true}
                ></AlertMessage>
            );
        } else {
            return null;
        }
    }

    render() {
        return (
            <div >
                <h3 style={{ "textAlign": "right" }}>הגדרת אילוצים</h3>
                {this.mainConstraintHeadLime()}
                <Constraint
                    copyConstraint={false}

                    hours={this.state.hours}
                    onHoursSelected={this.setHours}

                    teacher={this.state.teacher}
                    teachers={this.state.teachers}
                    onTeacherSelected={this.setSubjects}
                    groupNum={0}

                    subject={this.state.subject}
                    subjects={this.state.subjects}
                    onSubjectSelected={this.setGrades}

                    grade={this.state.grade}
                    grades={this.state.grades}
                    onGradeSelected={this.setClasses}

                    classNumber={this.state.classNumber}
                    classes={this.state.classes}
                    onClassSelected={this.setClass}
                >
                </Constraint>
                {this.CopyConstraint()}
                {this.lesoonSplit()}
                <div style={{ "textAlign": "right" }}>
                    <button type="button" className="btn btn-outline-dark ml-2 my-2" onClick={() => this.setTeacherButtonType()}>{this.state.teacherButtonType}</button>
                    <button type="button" className="btn btn-outline-dark ml-2 my-2" onClick={() => this.setSubjectButtonType()}>{this.state.subjectButtonType}</button>
                </div>
                <div className="row mt-4">
                    <div className="col-6" >
                        {/* <AlertMessage
                            message={this.state.teacherAlertMessage}
                            messageStatus={this.state.teacherAlertMessageStatus}
                        ></AlertMessage> */}
                        {this.showTeacherDetails()}
                    </div>
                    <div className="col-6" >
                        {/* <AlertMessage
                            className="col-6"
                            message={this.state.subjectAlertMessage}
                            messageStatus={true}
                        ></AlertMessage> */}
                        {this.showSubjectDetails()}
                    </div>
                </div>
                <button type="button" className="btn btn-secondary" onClick={() => this.setConstraints()}>{this.state.buttonType}</button>
                {this.alertMessage()}
            </div>
        );
    }
}

export default Constraints;
