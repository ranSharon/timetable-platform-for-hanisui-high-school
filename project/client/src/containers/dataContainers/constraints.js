import React, { Component } from 'react';
import axios from 'axios';
import Constraint from '../../components/constraintComponents/constraint';
import AlertMessage from '../../components/alertMessage';
import LessonSplit from '../../components/constraintComponents/lessonSplit';
import DataTable from '../dataContainers/tableDisplay/table';

let numEdit = 0;

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
            classRoom: '',

            // this parms also in constraint model
            subjectGrouping: false,
            subjectMix: false,
            subjectFeatures: [],
            constraintSplitsBros: [],// delete
            constraintCopyBros: [],//delete
            copyConstraint: false,
            constraints: [],
            tempConstraints: [],//delete
            numOfConstraintsToEdit: 0,//delete
            startIndexToEdit: 0,//delete
            mainConstraint: true,
            beforeEditConstraint: {},//delete
            num: 0,

            counter: 0,//delete

            teacherDetails: {},
            newCurrentTeachHours: 0,//change name
            subjectsDetails: {},
            subjectBagrut: false,
            subjectGmol: 0,
            subjectNumOfMix: 0,
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
            subjectButtonType: 'הצג פרטיי מקצוע',
            mainButtonDisable: false

        }
        this.setSubjects = this.setSubjects.bind(this);
        this.setGrades = this.setGrades.bind(this);
        this.setClasses = this.setClasses.bind(this);
        this.setClass = this.setClass.bind(this);
        this.setHours = this.setHours.bind(this);
        this.setLessonSplit = this.setLessonSplit.bind(this);
        this.setNumOfSplits = this.setNumOfSplits.bind(this);
        this.setFirstLesson = this.setFirstLesson.bind(this);
        this.setSecondlesson = this.setSecondlesson.bind(this);
        this.setThirdlesson = this.setThirdlesson.bind(this);
        this.deleteConstraint = this.deleteConstraint.bind(this);
        this.getConstraint = this.getConstraint.bind(this);
    }

    componentDidMount() {
        axios.get('http://localhost:4000/data/getConstraints')
            .then(response => {
                let num = 0;
                if (response.data.length !== 0) {
                    num = response.data[response.data.length - 1].num + 1;
                }
                this.setState({ constraints: [...response.data.sort(this.compare)], num: num });
                console.log('constraints:')
                console.log(this.state.constraints);

            })
            .catch(function (error) {
                console.log(error);
            });
        axios.get('http://localhost:4000/data/getTeachers')
            .then(response => {
                this.setState({ allTeachers: [...response.data] });
                // console.log('allTeachers:')
                console.log(this.state.allTeachers);
                this.setTeachers();
            })
            .catch(function (error) {
                console.log(error);
            });
        axios.get('http://localhost:4000/data/getGrades')
            .then(response => {
                this.setState({ allGrades: [...response.data] });
                // console.log('allGrades:')
                // console.log(this.state.allGrades);
            })
            .catch(function (error) {
                console.log(error);
            });
        axios.get('http://localhost:4000/data/getSubjects')
            .then(response => {
                this.setState({ allSubjects: [...response.data] });
                // console.log('allSubjects:')
                // console.log(this.state.allSubjects);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    componentDidUpdate(prevProps, prevState) {
        // console.log(this.state.teacherDetails);
        if (prevState.hours !== this.state.hours) {
            if (!this.isTeacherDetailsEmpty()) {
                let teacherDetails = { ...this.state.teacherDetails };
                this.setTeacherAlertMessage(teacherDetails);
            }
        }
        if (prevState.subjectBagrut !== this.state.subjectBagrut) {
            let teacherDetails = { ...this.state.teacherDetails };
            this.setTeacherAlertMessage(teacherDetails);
        }
        if (prevState.constraints.length !== this.state.constraints.length && this.state.buttonType === 'אישור') {
            let num = 0;
            if (this.state.constraints.length > 0) {
                let constraints = [...this.state.constraints.sort(this.compare)];
                num = constraints[constraints.length - 1].num + 1;
            }
            this.resetInputs();
            this.setState({
                constraints: [...this.state.constraints.sort(this.compare)],
                groupingTeachers: [],
                num: num
            })
        }
        if (prevState.constraints.length !== this.state.constraints.length && this.state.buttonType === 'ערוך') {
            // console.log(this.state.constraints);
            // console.log(this.state.constraints.length);
            // console.log(this.state.constraints[this.state.constraints.length-1].num);
            let num = 0;
            if (this.state.constraints.length > 0) {
                num = this.state.constraints[this.state.constraints.length - 1].num + 1;
            }
            this.setState({
                constraints: [...this.state.constraints.sort(this.compare)],
                num: num
            })
        }
        if (prevState.constraints.length === this.state.constraints.length && this.state.mainButtonDisable) {
            this.setState({ mainButtonDisable: false });
        }
    }

    setTeachers() {
        let teachers = [];
        this.state.allTeachers.forEach(teacher => {
            teachers.push(teacher.name);
        });
        this.setState({ teachers: [...teachers] });
    }

    setHours(e) {
        let hours = '';
        if (e.target.value === '') {
            hours = '0';
        } else {
            hours = e.target.value;
        }

        let newCurrentTeachHours = parseInt(hours) + this.state.subjectGmol;
        this.setState({
            hours: hours,
            newCurrentTeachHours: newCurrentTeachHours
        });
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
        let teacher = '';
        if (e === null) {
            teacher = this.state.teacher;
        } else {
            teacher = e.target.value;
        }
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
            subjectGmol: 0,
            subjectGrouping: false,
            newCurrentTeachHours: this.state.newCurrentTeachHours - this.state.subjectGmol,
            subjectAlertMessage: '',
            groupingTeachers: [...groupingTeachers]
        });
        this.setTeacherAlertMessage(teacherDetails);
    }

    setTeacherAlertMessage(teacherDetails) {
        let teacherAlertMessage = '';
        let maxTeachHours = parseInt(teacherDetails.maxTeachHours);
        let currentTeachHours = teacherDetails.currentTeachHours;
        let newCurrentTeachHours = currentTeachHours + this.state.newCurrentTeachHours;
        teacherAlertMessage = 'המורה ' + teacherDetails.name + '$מספר שעות הוראה שבועיות מקסמילי: ' + maxTeachHours + '$שעות הוראה שבועיות נוכחי: ' + currentTeachHours + '$שעות הוראה שבועיות עם הוספת אילוץ זה: ' + newCurrentTeachHours;
        this.setState({
            teacherDetails: { ...teacherDetails },
            teacherAlertMessage: teacherAlertMessage
        });
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

        return hours + minutes;
    }

    setGrades(e) {
        let subject = '';
        if (e === null) {
            subject = this.state.subject;
        } else {
            subject = e.target.value;
        }
        let newCurrentTeachHours = this.state.newCurrentTeachHours - this.state.subjectGmol;
        if (subject === '') {
            this.setState({
                subject: subject,
                grades: [],
                subjectsDetails: {},
                subjectMix: false,
                subjectGrouping: false,
                subjectNumOfMix: 0,
                subjectFeatures: [],
                subjectBagrut: false,
                newCurrentTeachHours: newCurrentTeachHours,
                subjectGmol: 0,
                copyConstraint: false,
                groupingTeachers: [],
                grade: '',
                classNumber: [''],
                classes: [],
            })
            return;
        }
        let subjectsDetails = { ...this.getSubjectsDetails(subject) };
        console.log(subjectsDetails);
        let allteacherGrades = [...this.state.teacherDetails.grades];
        let allSubjectGrades = [...subjectsDetails.grades];
        let subjectMix = subjectsDetails.mix;
        // console.log(subjectMix);
        let subjectFeatures = [...subjectsDetails.subjectFeatures]
        let subjectGrouping = subjectsDetails.grouping;
        let subjectNumOfMix = 0;
        if (!isNaN(parseInt(subjectsDetails.numOfMix))) {
            subjectNumOfMix = parseInt(subjectsDetails.numOfMix);
        }
        let copyConstraint = false;
        let subjectBagrut = subjectsDetails.bagrut;
        let subjectGmol = 0;
        if (subjectBagrut) {
            subjectGmol = this.getGmol(subjectsDetails.gmol);
            newCurrentTeachHours = newCurrentTeachHours + subjectGmol;
        }
        let grades = allteacherGrades.filter(grade => allSubjectGrades.includes(grade));
        let groupingTeachers = [this.state.teacher];
        if (subjectGrouping) {
            copyConstraint = true;
            let numOfMix = subjectNumOfMix - 1;
            for (let i = 1; i <= numOfMix; i++) {
                groupingTeachers = [...groupingTeachers, ''];
            }
        }
        if (subjectBagrut) {

        }
        this.setState({
            subject: subject,
            grades: [...grades],
            subjectsDetails: { ...subjectsDetails },
            subjectMix: subjectMix,
            subjectGrouping: subjectGrouping,
            subjectNumOfMix: subjectNumOfMix,
            subjectFeatures: [...subjectFeatures],
            subjectBagrut: subjectBagrut,
            subjectGmol: subjectGmol,
            newCurrentTeachHours: newCurrentTeachHours,
            copyConstraint: copyConstraint,
            groupingTeachers: [...groupingTeachers],
            grade: '',
            classNumber: [''],
            classes: [],
        }, function(){
            console.log(this.state.subjectMix);
            console.log(this.state.subjectGrouping);
            console.log(this.state.subjectNumOfMix);
        });
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
        let grade = '';
        if (e === null) {
            grade = this.state.grade;
        }
        else {
            grade = e.target.value;
        }
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
        let lessonSplit = false;
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
        if (!this.checkIfInputValid()) {
            return;
        }
        if (this.state.groupingTeachers.length > 0) {
            // console.log('con');
            for (let i = 0; i <= this.state.groupingTeachers.length - 1; i++) {
                for (let j = 0; j <= this.state.allTeachers.length - 1; j++) {
                    if (this.state.groupingTeachers[i] === this.state.allTeachers[j].name) {
                        // console.log(this.state.allTeachers[j].currentTeachHours);
                        // console.log(this.state.newCurrentTeachHours);
                        // console.log(typeof this.state.allTeachers[j].maxTeachHours);
                        if (this.state.allTeachers[j].currentTeachHours + this.state.newCurrentTeachHours > parseInt(this.state.allTeachers[j].maxTeachHours)) {
                            let message = 'לא ניתן להגדיר שיעור זה  כי המורה ' + this.state.allTeachers[j].name + ' יחרוג משעות ההוראה שבועיות';
                            this.setState({ alertMessage: message, messageStatus: false });
                            this.alertMessage();
                            return;
                        }
                    }
                }
            }
        }
        // if (this.state.teacherDetails.maxTeachHours < this.state.newCurrentTeachHours) {
        //     let message = 'לא ניתן להגדיר שיעור זה כי המורה יחרוג משעות הוראה שבועיות';
        //     this.setState({ alertMessage: message, messageStatus: false });
        //     this.alertMessage();
        //     return;
        // }
        if (this.constraintExist()) {
            this.setState({ mainButtonDisable: false });
            return;
        }

        this.setState({ mainButtonDisable: true });

        const newConstraint = {
            teacher: this.state.teacher,
            subject: this.state.subject,
            grade: this.state.grade,
            hours: this.state.hours,
            classNumber: [...this.state.classNumber],
            lessonSplit: this.state.lessonSplit,
            numOfSplits: this.state.numOfSplits,
            firstLesson: this.state.firstLesson,
            secondlesson: this.state.secondlesson,
            thirdlesson: this.state.thirdlesson,
            subjectGrouping: this.state.subjectGrouping,
            subjectMix: this.state.subjectMix,
            subjectNumOfMix: this.state.subjectNumOfMix,
            subjectFeatures: [...this.state.subjectFeatures],
            groupingTeachers: [...this.state.groupingTeachers],
            constraintSplitsBros: [],
            constraintCopyBros: [],
            copyConstraint: this.state.copyConstraint,
            num: this.state.num,
            mainConstraint: this.state.mainConstraint,
            classRoom: this.state.classRoom
        };
        console.log(newConstraint);

        if (this.state.buttonType === 'אישור') {
            if (newConstraint.subjectGrouping) {
                let copyConstraints = [...this.createCopyConstraints(newConstraint)];
                this.addCopyAndSplitConstraintsToDB(newConstraint, copyConstraints);
            } else if (newConstraint.lessonSplit && !newConstraint.subjectGrouping) {
                let splitConstraints = [...this.createSplitsBrosConstraints(newConstraint)];
                this.addSplitConstraintsToDB(newConstraint, splitConstraints, this.state.num);
            } else {
                let constraint = {};
                let num = this.state.num;
                newConstraint.num = num;
                num += 1;
                this.setState({ num: num });
                axios.post('http://localhost:4000/data/addConstraint', newConstraint)
                    .then(res => {
                        constraint = { ...res.data };
                        this.setState({
                            constraints: [...this.state.constraints, constraint]
                        });
                    });
            }

            let newTeacher = { ...this.state.teacherDetails };
            let newCurrentTeachHours = this.state.newCurrentTeachHours;
            newTeacher.currentTeachHours = newCurrentTeachHours;
            // console.log(this.state.newCurrentTeachHours);
            if (this.state.groupingTeachers.length > 0) {
                for (let i = 0; i <= this.state.groupingTeachers.length - 1; i++) {
                    axios.post('http://localhost:4000/data/updateTeacherByName/', { name: this.state.groupingTeachers[i], hours: newCurrentTeachHours })
                        .then(res => {
                            let teachers = [...this.state.allTeachers];
                            for (let i = 0; i <= teachers.length - 1; i++) {
                                if (teachers[i]._id === res.data._id) {
                                    teachers[i] = { ...res.data };
                                }
                            }
                            this.setState({
                                allTeachers: [...teachers]
                            });
                        });
                }
            } else {
                const teacherToEditId = this.state.teacherDetails._id;
                axios.post('http://localhost:4000/data/updateTeacher/' + teacherToEditId, newTeacher)
                    .then(res => {
                        let teachers = [...this.state.allTeachers];
                        for (let i = 0; i <= teachers.length - 1; i++) {
                            if (teachers[i]._id === res.data._id) {
                                teachers[i] = { ...res.data };
                            }
                        }
                        this.setState({
                            allTeachers: [...teachers]
                        });
                    });
            }
        } else if (this.state.buttonType === 'ערוך') {
            this.setState({
                buttonType: 'אישור'
            }, function () {
                this.setConstraints();
            })
        }
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
        let groupingTeachers = [...this.state.groupingTeachers];
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
        if (this.state.subjectGrouping && grade !== '' && hours !== '0') {
            for (let i = 0; i <= groupingTeachers.length - 1; i++) {
                if (groupingTeachers[i] === '') {
                    message += 'לא נבחר מורה עבורה הקבצה ' + (i + 1) + '$';
                }
            }
            outerLoop:
            for (let i = 0; i <= this.state.groupingTeachers.length - 1; i++) {
                for (let j = 0; j <= this.state.groupingTeachers.length - 1; j++) {
                    if (i !== j && this.state.groupingTeachers[i] !== '' && this.state.groupingTeachers[i] === this.state.groupingTeachers[j]) {
                        message += 'נבחר אותו מורה להקבצה שונה לפחות פעם אחת$';
                        break outerLoop;
                    }
                }
            }
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
            return true;
        } else {
            this.setState({ alertMessage: message, messageStatus: false });
            this.alertMessage();
            return false;
        }
    }

    constraintExist() {
        let message = '';
        let constraints = [...this.state.constraints];
        let teacher = this.state.teacher; // string init ''
        let subject = this.state.subject; // string init ''
        let grade = this.state.grade; // string init ''
        let classNumber = [...this.state.classNumber]; // arary string init ['']
        for (let i = 0; i <= constraints.length - 1; i++) {
            if (teacher === constraints[i].teacher &&
                subject === constraints[i].subject &&
                grade === constraints[i].grade &&
                JSON.stringify(classNumber) === JSON.stringify(constraints[i].classNumber) &&
                this.state.buttonType === 'אישור') {
                message = 'הוזן כבר שיעור עם פרטים אלו';
                this.setState({ alertMessage: message, messageStatus: false });
                this.alertMessage();
                return true;
            }
        }
        return false;

    }

    resetInputs() {
        let teacher = ''; // string init ''
        let subject = ''; // string init ''
        let grade = ''; // string init ''
        let hours = '0'; // string init '0'
        let classNumber = ['']; // arary string init ['']
        let lessonSplit = false; // bool init false
        let numOfSplits = 0; // number init 0
        let firstLesson = 0; // number init 0
        let secondlesson = 0; // number init 0
        let thirdlesson = 0; // number init 0
        let alertMessage = 'הערך נשמר - אפשר להזין שיעור/שיעורים חדש';
        this.setState({
            teacher: teacher,
            subject: subject,
            grade: grade,
            hours: hours,
            classNumber: [...classNumber],
            lessonSplit: lessonSplit,
            numOfSplits: numOfSplits,
            firstLesson: firstLesson,
            secondlesson: secondlesson,
            thirdlesson: thirdlesson,
            subjectGrouping: false,
            mainConstraint: true,
            subjectGmol: 0,
            newCurrentTeachHours: 0,
            subjectsDetails: {},
            teacherDetails: {},
            subjects: [],
            grades: [],
            classes: [],
            alertMessage: alertMessage,
            teacherAlertMessage: '',
            subjectAlertMessage: '',
            teacherButtonType: 'הצג פרטיי מורה',
            subjectButtonType: 'הצג פרטיי מקצוע',
            messageStatus: true
        });
    }

    createSplitsBrosConstraints(mainBroConstraint) {
        let splitConstraint = [];
        for (let i = 1; i <= mainBroConstraint.numOfSplits - 1; i++) {
            const newConstraint = {
                teacher: mainBroConstraint.teacher,
                subject: mainBroConstraint.subject,
                grade: mainBroConstraint.grade,
                hours: mainBroConstraint.hours,
                classNumber: [...mainBroConstraint.classNumber],
                lessonSplit: mainBroConstraint.lessonSplit,
                numOfSplits: mainBroConstraint.numOfSplits,
                firstLesson: mainBroConstraint.firstLesson,
                secondlesson: mainBroConstraint.secondlesson,
                thirdlesson: mainBroConstraint.thirdlesson,
                subjectGrouping: mainBroConstraint.subjectGrouping,
                subjectMix: mainBroConstraint.subjectMix,
                subjectNumOfMix: mainBroConstraint.subjectNumOfMix,
                subjectFeatures: [...mainBroConstraint.subjectFeatures],
                groupingTeachers: [...mainBroConstraint.groupingTeachers],
                constraintSplitsBros: [],
                copyConstraint: mainBroConstraint.copyConstraint,
                num: mainBroConstraint.num,
                mainConstraint: false,
                classRoom: mainBroConstraint.classRoom
            };

            if (i === 1) {
                newConstraint.hours = newConstraint.secondlesson.toString();
            } else if (i === 2) {
                newConstraint.hours = newConstraint.thirdlesson.toString();
            }
            splitConstraint = [...splitConstraint, newConstraint];
        }
        return splitConstraint;
    }

    createCopyConstraints(realConstraint) {
        let copyConstraints = [];
        for (let i = this.state.groupingTeachers.length - 1; i >= 1; i--) {
            const newConstraint = {
                teacher: this.state.groupingTeachers[i],
                subject: realConstraint.subject,
                grade: realConstraint.grade,
                hours: realConstraint.hours,
                classNumber: [...realConstraint.classNumber],
                lessonSplit: realConstraint.lessonSplit,
                numOfSplits: realConstraint.numOfSplits,
                firstLesson: realConstraint.firstLesson,
                secondlesson: realConstraint.secondlesson,
                thirdlesson: realConstraint.thirdlesson,
                subjectGrouping: realConstraint.subjectGrouping,
                subjectMix: realConstraint.subjectMix,
                subjectNumOfMix: realConstraint.realConstraint,
                subjectFeatures: [...realConstraint.subjectFeatures],
                groupingTeachers: [...realConstraint.groupingTeachers],
                constraintSplitsBros: [],
                constraintCopyBros: [],
                copyConstraint: true,
                num: realConstraint.num,
                mainConstraint: false,
                classRoom: realConstraint.classRoom
            };

            copyConstraints = [...copyConstraints, newConstraint];
        }
        return copyConstraints;
    }

    addCopyAndSplitConstraintsToDB(realConstraint, copyConstraints) {
        if (realConstraint.lessonSplit) {
            if (copyConstraints.length === 1) {
                let splitConstraints1 = [...this.createSplitsBrosConstraints(copyConstraints[0])];
                let num1 = this.state.num;
                this.addSplitConstraintsToDB(copyConstraints[0], splitConstraints1, num1);
                let splitConstraintsForReal = [...this.createSplitsBrosConstraints(realConstraint)];
                let numForReal = num1 + copyConstraints.length + 1;
                realConstraint.copyConstraint = false;
                this.addSplitConstraintsToDB(realConstraint, splitConstraintsForReal, numForReal);
            } else if (copyConstraints.length === 2) {
                let splitConstraints1 = [...this.createSplitsBrosConstraints(copyConstraints[0])];
                let splitConstraints2 = [...this.createSplitsBrosConstraints(copyConstraints[1])];
                let num1 = this.state.num;
                let num2 = num1 + copyConstraints.length + 1;
                this.addSplitConstraintsToDB(copyConstraints[0], splitConstraints1, num1);
                this.addSplitConstraintsToDB(copyConstraints[1], splitConstraints2, num2);
                let splitConstraintsForReal = [...this.createSplitsBrosConstraints(realConstraint)];
                let numForReal = num2 + copyConstraints.length + 1;
                realConstraint.copyConstraint = false;
                this.addSplitConstraintsToDB(realConstraint, splitConstraintsForReal, numForReal);
            } else if (copyConstraints.length === 3) {
                let splitConstraints1 = [...this.createSplitsBrosConstraints(copyConstraints[0])];
                let splitConstraints2 = [...this.createSplitsBrosConstraints(copyConstraints[1])];
                let splitConstraints3 = [...this.createSplitsBrosConstraints(copyConstraints[2])];
                let num1 = this.state.num;
                let num2 = num1 + copyConstraints.length + 1;
                let num3 = num2 + copyConstraints.length + 1;
                this.addSplitConstraintsToDB(copyConstraints[0], splitConstraints1, num1);
                this.addSplitConstraintsToDB(copyConstraints[1], splitConstraints2, num2);
                this.addSplitConstraintsToDB(copyConstraints[2], splitConstraints3, num3);
                let splitConstraintsForReal = [...this.createSplitsBrosConstraints(realConstraint)];
                let numForReal = num3 + copyConstraints.length + 1;
                realConstraint.copyConstraint = false;
                this.addSplitConstraintsToDB(realConstraint, splitConstraintsForReal, numForReal);
            } else if (copyConstraints.length === 4) {
                let splitConstraints1 = [...this.createSplitsBrosConstraints(copyConstraints[0])];
                let splitConstraints2 = [...this.createSplitsBrosConstraints(copyConstraints[1])];
                let splitConstraints3 = [...this.createSplitsBrosConstraints(copyConstraints[2])];
                let splitConstraints4 = [...this.createSplitsBrosConstraints(copyConstraints[3])];
                let num1 = this.state.num;
                let num2 = num1 + copyConstraints.length + 1;
                let num3 = num2 + copyConstraints.length + 1;
                let num4 = num3 + copyConstraints.length + 1;
                this.addSplitConstraintsToDB(copyConstraints[0], splitConstraints1, num1);
                this.addSplitConstraintsToDB(copyConstraints[1], splitConstraints2, num2);
                this.addSplitConstraintsToDB(copyConstraints[2], splitConstraints3, num3);
                this.addSplitConstraintsToDB(copyConstraints[3], splitConstraints4, num4);
                let splitConstraintsForReal = [...this.createSplitsBrosConstraints(realConstraint)];
                let numForReal = num4 + copyConstraints.length + 1;
                realConstraint.copyConstraint = false;
                this.addSplitConstraintsToDB(realConstraint, splitConstraintsForReal, numForReal);
            }
        } else {
            let constraint = {};
            let num = this.state.num;
            copyConstraints[0].num = num;
            num += 1;
            this.setState({ num: num });
            axios.post('http://localhost:4000/data/addConstraint', copyConstraints[0])
                .then(res => {
                    constraint = { ...res.data };
                    realConstraint.constraintCopyBros = [...realConstraint.constraintCopyBros, res.data._id];
                    this.setState({
                        constraints: [...this.state.constraints, constraint]
                    });
                    if (copyConstraints.length === 1) {
                        let constraint = {};
                        let num = this.state.num;
                        realConstraint.num = num;
                        realConstraint.copyConstraint = false;
                        num += 1;
                        this.setState({ num: num });
                        axios.post('http://localhost:4000/data/addConstraint', realConstraint)
                            .then(res => {
                                constraint = { ...res.data };
                                //console.log(constraint);
                                this.setState({
                                    constraints: [...this.state.constraints, constraint]
                                });
                            });
                    }
                    if (copyConstraints.length > 1) {
                        let constraint = {};
                        let num = this.state.num;
                        copyConstraints[1].num = num;
                        num += 1;
                        this.setState({ num: num });
                        axios.post('http://localhost:4000/data/addConstraint', copyConstraints[1])
                            .then(res => {
                                constraint = { ...res.data };
                                realConstraint.constraintCopyBros = [...realConstraint.constraintCopyBros, res.data._id];
                                this.setState({
                                    constraints: [...this.state.constraints, constraint]
                                });
                                if (copyConstraints.length === 2) {
                                    let constraint = {};
                                    let num = this.state.num;
                                    realConstraint.num = num;
                                    realConstraint.copyConstraint = false;
                                    num += 1;
                                    this.setState({ num: num });
                                    axios.post('http://localhost:4000/data/addConstraint', realConstraint)
                                        .then(res => {
                                            constraint = { ...res.data };
                                            this.setState({
                                                constraints: [...this.state.constraints, constraint]
                                            });
                                        });
                                }
                                if (copyConstraints.length > 2) {
                                    let constraint = {};
                                    let num = this.state.num;
                                    copyConstraints[2].num = num;
                                    num += 1;
                                    this.setState({ num: num });
                                    axios.post('http://localhost:4000/data/addConstraint', copyConstraints[2])
                                        .then(res => {
                                            constraint = { ...res.data };
                                            realConstraint.constraintCopyBros = [...realConstraint.constraintCopyBros, res.data._id];
                                            this.setState({
                                                constraints: [...this.state.constraints, constraint]
                                            });
                                            if (copyConstraints.length === 3) {

                                                let constraint = {};
                                                let num = this.state.num;
                                                realConstraint.num = num;
                                                realConstraint.copyConstraint = false;
                                                num += 1;
                                                this.setState({ num: num });
                                                axios.post('http://localhost:4000/data/addConstraint', realConstraint)
                                                    .then(res => {
                                                        constraint = { ...res.data };
                                                        this.setState({
                                                            constraints: [...this.state.constraints, constraint]
                                                        });
                                                    });
                                            }
                                            if (copyConstraints.length > 3) {
                                                let constraint = {};
                                                let num = this.state.num;
                                                copyConstraints[2].num = num;
                                                num += 1;
                                                this.setState({ num: num });
                                                axios.post('http://localhost:4000/data/addConstraint', copyConstraints[2])
                                                    .then(res => {
                                                        constraint = { ...res.data };
                                                        realConstraint.constraintCopyBros = [...realConstraint.constraintCopyBros, res.data._id];
                                                        this.setState({
                                                            constraints: [...this.state.constraints, constraint]
                                                        });
                                                        if (copyConstraints.length === 4) {
                                                            let constraint = {};
                                                            let num = this.state.num;
                                                            realConstraint.num = num;
                                                            realConstraint.copyConstraint = false;
                                                            num += 1;
                                                            this.setState({ num: num });
                                                            axios.post('http://localhost:4000/data/addConstraint', realConstraint)
                                                                .then(res => {
                                                                    constraint = { ...res.data };
                                                                    this.setState({
                                                                        constraints: [...this.state.constraints, constraint]
                                                                    });
                                                                });
                                                        }
                                                    });
                                            }
                                        });
                                }
                            });
                    }
                });
        }
    }

    addSplitConstraintsToDB(firstConstraint, splitConstraints, num) {
        firstConstraint.hours = firstConstraint.firstLesson.toString();
        let constraint = {};
        splitConstraints[0].num = num;
        num += 1;
        axios.post('http://localhost:4000/data/addConstraint', splitConstraints[0])
            .then(res => {
                constraint = { ...res.data };
                firstConstraint.constraintSplitsBros = [...firstConstraint.constraintSplitsBros, res.data._id];
                if (this.state.num > num) {
                    this.setState({
                        constraints: [...this.state.constraints, constraint]
                    });
                } else {
                    this.setState({
                        constraints: [...this.state.constraints, constraint],
                        num: num
                    });
                }
                if (splitConstraints.length === 1) {
                    let constraint = {};
                    firstConstraint.num = num;
                    num += 1;
                    axios.post('http://localhost:4000/data/addConstraint', firstConstraint)
                        .then(res => {
                            constraint = { ...res.data };
                            if (this.state.num > num) {
                                this.setState({
                                    constraints: [...this.state.constraints, constraint]
                                });
                            } else {
                                this.setState({
                                    constraints: [...this.state.constraints, constraint],
                                    num: num
                                });
                            }
                        });
                }
                if (splitConstraints.length > 1) {
                    let constraint = {};
                    splitConstraints[1].num = num;
                    axios.post('http://localhost:4000/data/addConstraint', splitConstraints[1])
                        .then(res => {
                            constraint = { ...res.data };
                            firstConstraint.constraintSplitsBros = [...firstConstraint.constraintSplitsBros, res.data._id];
                            if (this.state.num > num) {
                                this.setState({
                                    constraints: [...this.state.constraints, constraint]
                                });
                            } else {
                                this.setState({
                                    constraints: [...this.state.constraints, constraint],
                                    num: num
                                });
                            }
                            if (splitConstraints.length === 2) {
                                let constraint = {};
                                num += 1;
                                firstConstraint.num = num;
                                axios.post('http://localhost:4000/data/addConstraint', firstConstraint)
                                    .then(res => {
                                        constraint = { ...res.data };
                                        if (this.state.num > num) {
                                            this.setState({
                                                constraints: [...this.state.constraints, constraint]
                                            });
                                        } else {
                                            this.setState({
                                                constraints: [...this.state.constraints, constraint],
                                                num: num
                                            });
                                        }
                                    });
                            }
                        });
                }
            });
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

    compare(a, b) {
        const numeA = a.num;
        const numB = b.num;

        let comparison = 0;
        if (numeA > numB) {
            comparison = 1;
        } else if (numeA < numB) {
            comparison = -1;
        }
        return comparison;
    }

    deleteConstraint(constraintId) {
        let fatherConstraint = {};
        let constraints = [...this.state.constraints];
        let constraintsIdToDelete = [];
        let index = 0;
        for (; index <= constraints.length - 1; index++) {
            if (constraints[index]._id === constraintId) {
                fatherConstraint = { ...constraints[index] };
                break;
            }
        }

        let numOfConstraintToDelete = 1;
        if (fatherConstraint.subjectGrouping && fatherConstraint.lessonSplit) {
            numOfConstraintToDelete = fatherConstraint.subjectNumOfMix * fatherConstraint.numOfSplits;
        } else if (fatherConstraint.subjectGrouping) {
            numOfConstraintToDelete = fatherConstraint.subjectNumOfMix;
        } else if (fatherConstraint.lessonSplit) {
            numOfConstraintToDelete = fatherConstraint.numOfSplits;
        }

        for (let i = 1; i <= numOfConstraintToDelete; i++) {
            constraintsIdToDelete = [...constraintsIdToDelete, this.state.constraints[index]._id];
            index--;
        }
        // console.log(fatherConstraint.subject);
        // console.log(this.state.allSubjects);
        // console.log(fatherConstraint.subjectGrouping);
        // console.log(fatherConstraint.groupingTeachers);
        let gmol = 0;
        let allSubjects = [...this.state.allSubjects];
        for (let i = 0; i <= allSubjects.length - 1; i++) {
            if (allSubjects[i].subjectName === fatherConstraint.subject && allSubjects[i].bagrut) {
                gmol = this.getGmol(allSubjects[i].gmol);
                // console.log(gmol);
                break;
            }
        }

        // console.log(parseInt(fatherConstraint.hours) + gmol);
        // console.log(fatherConstraint);

        let newCurrentTeachHours = (parseInt(fatherConstraint.hours) + gmol) * (-1);
        if (fatherConstraint.lessonSplit) {
            newCurrentTeachHours = (fatherConstraint.firstLesson + fatherConstraint.secondlesson + fatherConstraint.thirdlesson + gmol) * (-1);
        }
        // console.log(newCurrentTeachHours);
        for (let i = 0; i <= fatherConstraint.groupingTeachers.length - 1; i++) {
            axios.post('http://localhost:4000/data/updateTeacherByName/', { name: fatherConstraint.groupingTeachers[i], hours: newCurrentTeachHours })
                .then(res => {
                    let teachers = [...this.state.allTeachers];
                    for (let i = 0; i <= teachers.length - 1; i++) {
                        if (teachers[i]._id === res.data._id) {
                            teachers[i] = { ...res.data };
                        }
                    }
                    this.setState({
                        allTeachers: [...teachers]
                    }, function () {
                        // console.log(this.state.newCurrentTeachHours);
                        // console.log(this.state.allTeachers);
                    });
                });
        }

        for (let i = 0; i <= constraintsIdToDelete.length - 1; i++) {
            axios.post('http://localhost:4000/data/deleteConstraint/' + constraintsIdToDelete[i])
                .then(response => {
                    let constraints = [...this.state.constraints];
                    for (let j = 0; j <= constraints.length - 1; j++) {
                        if (constraints[j]._id === constraintsIdToDelete[i]) {
                            constraints = [...constraints.slice(0, j).concat(constraints.slice(j + 1, constraints.length))];
                            break;
                        }
                    }
                    this.setState({ constraints: [...constraints] });
                })
                .catch(function (error) {
                    console.log(error);
                })
        }
    }

    getConstraint(constraintId) {
        let fatherConstraint = {};
        let constraints = [...this.state.constraints];
        for (let index = 0; index <= constraints.length - 1; index++) {
            if (constraints[index]._id === constraintId) {
                fatherConstraint = { ...constraints[index] };
                break;
            }
        }
        // console.log(fatherConstraint);
        this.setState({
            buttonType: 'ערוך',
            mainButtonDisable: true
        });

        let hours = parseInt(fatherConstraint.hours);
        if (fatherConstraint.lessonSplit) {
            hours = fatherConstraint.firstLesson + fatherConstraint.secondlesson + fatherConstraint.thirdlesson;
        }
        this.setState({
            beforeEditConstraint: { ...fatherConstraint },
            teacher: fatherConstraint.teacher,
            hours: hours,
            num: fatherConstraint.num
        }, function () {
            this.setSubjects(null, 0);
            this.setState({
                subject: fatherConstraint.subject
            }, function () {
                this.setGrades(null);
                this.setState({ grade: fatherConstraint.grade },
                    function () {
                        this.setClasses(null);
                        this.setState({
                            classNumber: [...fatherConstraint.classNumber],
                            lessonSplit: fatherConstraint.lessonSplit
                        }, function () {
                            this.setState({
                                numOfSplits: fatherConstraint.numOfSplits,
                                groupingTeachers: [...fatherConstraint.groupingTeachers]
                            }, function () {
                                this.setState({
                                    firstLesson: fatherConstraint.firstLesson
                                }, function () {
                                    this.setState({
                                        secondlesson: fatherConstraint.secondlesson
                                    }, function () {
                                        this.setState({
                                            thirdlesson: fatherConstraint.thirdlesson,
                                            subjectGrouping: fatherConstraint.subjectGrouping,

                                            subjectFeatures: [...fatherConstraint.subjectFeatures],
                                            constraintSplitsBros: [...fatherConstraint.constraintSplitsBros],
                                            constraintCopyBros: [...fatherConstraint.constraintCopyBros]
                                        }, function () {
                                            // console.log(this.state.newCurrentTeachHours);
                                            let newCurrentTeachHours = (this.state.newCurrentTeachHours + hours) * (-1);
                                            // console.log(newCurrentTeachHours);
                                            let teacherDetails = { ...this.state.teacherDetails };
                                            teacherDetails.currentTeachHours += newCurrentTeachHours;
                                            // console.log(teacherDetails.currentTeachHours);
                                            this.setState({ teacherDetails: { ...teacherDetails } }, function () {
                                                // console.log(this.state.teacherDetails);
                                                this.setTeacherAlertMessage(teacherDetails);
                                            });
                                            for (let i = 0; i <= fatherConstraint.groupingTeachers.length - 1; i++) {
                                                axios.post('http://localhost:4000/data/updateTeacherByName/', { name: fatherConstraint.groupingTeachers[i], hours: newCurrentTeachHours })
                                                    .then(res => {
                                                        let teachers = [...this.state.allTeachers];
                                                        for (let i = 0; i <= teachers.length - 1; i++) {
                                                            if (teachers[i]._id === res.data._id) {
                                                                teachers[i] = { ...res.data };
                                                                // console.log(hours);
                                                            }
                                                        }
                                                        this.setState({
                                                            allTeachers: [...teachers],
                                                            newCurrentTeachHours: (this.state.newCurrentTeachHours + hours)
                                                        }, function () {
                                                            // console.log(this.state.newCurrentTeachHours);
                                                            // console.log(this.state.allTeachers);
                                                        });
                                                    });
                                            }
                                            this.deleteConstraint(constraintId);
                                        });

                                    })
                                });
                            });
                        })
                    });
            });
        });
        // }.bind(this));
        /* axios.post('http://localhost:4000/data/dropConstraints/')
            .then(response => {
               console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            }) */
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
                    onClassSelected={this.setClass}>
                </Constraint>
                {this.CopyConstraint()}
                {this.lesoonSplit()}
                <div style={{ "textAlign": "right" }}>
                    <button type="button" className="btn btn-outline-dark ml-2 my-2" onClick={() => this.setTeacherButtonType()}>{this.state.teacherButtonType}</button>
                    <button type="button" className="btn btn-outline-dark ml-2 my-2" onClick={() => this.setSubjectButtonType()}>{this.state.subjectButtonType}</button>
                </div>
                <div className="row mt-4">
                    <div className="col-6" >
                        {this.showTeacherDetails()}
                    </div>
                    <div className="col-6" >
                        {this.showSubjectDetails()}
                    </div>
                </div>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => this.setConstraints()}
                    disabled={this.state.mainButtonDisable}>
                    {this.state.buttonType}
                </button>
                {this.alertMessage()}
                <DataTable
                    constraints={this.state.constraints}
                    table="constraints"
                    onDelete={this.deleteConstraint}
                    onEdit={this.getConstraint}>
                </DataTable>
            </div>
        );
    }
}

export default Constraints;