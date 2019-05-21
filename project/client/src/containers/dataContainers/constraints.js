import React, { Component } from 'react';
import axios from 'axios';
import Constraint from '../../components/constraintComponents/constraint';

class Constraints extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teacher: '',
            subject: '',
            grade: '',
            hours: '',

            teachers: [],
            subjects: [],
            grades: [],
            classes: [],

            allGrades: [],
            allSubjects: [],
            allTeachers: [],
        }
        this.setSubjects = this.setSubjects.bind(this);
        this.setGrades = this.setGrades.bind(this);
        this.setClasses = this.setClasses.bind(this);
        this.setClass = this.setClass.bind(this);
        this.setHours = this.setHours.bind(this);
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

    setTeachers() {
        let teachers = [];
        this.state.allTeachers.forEach(teacher => {
            teachers.push(teacher.name);
        });
        //console.log(teachers);
        this.setState({ teachers: [...teachers] });
    }

    setHours(e){
        this.setState({hours: e.target.value});
        console.log(e.target.value);
    }

    setSubjects(e) {
        let teacher = e.target.value;
        let subjects = [];
        for (let i = 0; i <= this.state.allTeachers.length - 1; i++) {
            if (this.state.allTeachers[i].name === teacher) {
                subjects = [...this.state.allTeachers[i].subjectsForTeacher];
                break;
            }
        }
        console.log(subjects);
        this.setState({ teacher: teacher, subjects: [...subjects] });
    }

    setGrades(e) {
        let subject = e.target.value;
        //let teacher = this.state.teacher;
        let allteacherGrades = [...this.getAllteacherGrades()];
        let allSubjectGrades = [...this.getAllSubjectGrades(subject)];
        let grades = allteacherGrades.filter(grade => allSubjectGrades.includes(grade));
        this.setState({ subject: subject, grades: [...grades] });
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
        this.setState({ grade: grade, classes: [...classes] });
    }

    setClass(e) {
        console.log(e.target.value);
    }

    render() {
        return (
            <div style={{ "textAlign": "center" }}>
                <h3 style={{ "textAlign": "right" }}>הגדרת אילוצים</h3>
                <Constraint
                    onHoursSelected={this.setHours}
                    teachers={this.state.teachers}
                    onTeacherSelected={this.setSubjects}
                    subjects={this.state.subjects}
                    onSubjectSelected={this.setGrades}
                    grades={this.state.grades}
                    onGradeSelected={this.setClasses}
                    classes={this.state.classes}
                    onClassSelected={this.setClass}
                >
                </Constraint>
            </div>
        );
    }
}

export default Constraints;
