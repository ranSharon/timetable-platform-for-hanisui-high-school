import React, { Component } from 'react';
import DataTable from '../dataContainers/tableDisplay/table';
import axios from 'axios';
import AlertMessage from '../../components/alertMessage';

let gradeToEditId = '';
let greadeToEdit = '';

class Grades extends Component {
    mounted = false;

    constructor(props) {
        super(props);
        this.state = {
            grade: '',
            numOfClasses: '',
            grades: [],

            buttonType: 'אישור',
            alertMessage: '',
            messageStatus: false,
            disableButtons: false,
            waitingToSave: false,
            gradesFetched: false
        };
        this.getGrade = this.getGrade.bind(this);
        this.deleteGrade = this.deleteGrade.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
        axios.get('http://localhost:4000/data/getGrades')
            .then(response => {
                if (this.mounted) {
                    this.setState({ grades: [...response.data], gradesFetched: true });
                    //console.log(response.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    componentWillUnmount() {
        this.mounted = false;
        clearTimeout(this.timeoutID);
    }

    onChangeGeade(e) {
        this.setState({ grade: e.target.value });
    }

    onChangeNumOfClasses(e) {
        this.setState({ numOfClasses: e.target.value });
    }

    setGrades() {
        if (!this.checkIfInputValid()) {
            return;
        }
        if (this.gradeIsTaken()) {
            return;
        }
        const newGrade = {
            grade: this.state.grade,
            numOfClasses: this.state.numOfClasses
        };

        if (this.state.buttonType === 'אישור') {
            let grade = {};
            this.setState({ waitingToSave: true }, () => {
                axios.post('http://localhost:4000/data/addGrade', newGrade)
                    .then(res => {
                        if (this.mounted) {
                            grade = { ...res.data };
                            this.setState({
                                grades: [...this.state.grades, grade],
                                waitingToSave: false
                            });
                            this.resetInputs();
                        }
                    });
            });
        } else if (this.state.buttonType === 'סיים עריכה') {
            this.setState({ waitingToSave: true }, () => {
                axios.post('http://localhost:4000/data/updateGrade/' + gradeToEditId, newGrade)
                    .then(res => {
                        if (this.mounted) {
                            let grades = [...this.state.grades];
                            for (let i = 0; i <= grades.length - 1; i++) {
                                if (grades[i]._id === res.data._id) {
                                    grades[i] = { ...res.data };
                                }
                            }
                            this.setState({
                                grades: [...grades],
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

    checkIfInputValid() {
        clearTimeout(this.timeoutID);
        let grade = this.state.grade;
        let numOfClasses = this.state.numOfClasses;
        let message = 'ישנה בעיה עם לפחות אחד מן השדות:$';
        let originalMessage = message;
        if (grade === '') {
            message += 'לא נבחרה שכבה$';
        }
        if (numOfClasses === '') {
            message += 'לא נחברו מספר כיתות בשכבה$';
        }

        if (message === originalMessage) {
            return true;
        } else {
            this.setState({ alertMessage: message, messageStatus: false });
            this.alertMessage();
            return false;
        }
    }

    gradeIsTaken() {
        let message = '';
        let grades = [...this.state.grades];
        let currDrade = this.state.grade;
        for (let i = 0; i <= grades.length - 1; i++) {
            if (currDrade === grades[i].grade && this.state.buttonType === 'אישור') {
                message = 'שכבה זו כבר הוגדרה';
                this.setState({ alertMessage: message, messageStatus: false });
                this.alertMessage();
                return true;
            } else if (currDrade === grades[i].grade && currDrade !== greadeToEdit && this.state.buttonType === 'סיים עריכה') {
                message = 'שכבה זו כבר הוגדרה';
                this.setState({ alertMessage: message, messageStatus: false });
                this.alertMessage();
                return true;
            }
        }
        return false;
    }

    alertMessage() {
        return <AlertMessage
            message={this.state.alertMessage}
            messageStatus={this.state.messageStatus}>
        </AlertMessage>;
    }

    resetInputs() {
        clearTimeout(this.timeoutID);
        let grade = '';
        let numOfClasses = '';
        let alertMessage = this.state.alertMessage;
        alertMessage = 'הערך נשמר - אפשר להזין שכבה חדש';
        this.setState({
            grade: grade,
            numOfClasses: numOfClasses,
            alertMessage: alertMessage,
            messageStatus: true
        }, () => {
            this.timeoutID = setTimeout(() => { this.setState({ alertMessage: '' }) }, 1500);
        });
    }

    getGrade(gradeId) {
        window.scrollTo(0, 0);
        clearTimeout(this.timeoutID);
        gradeToEditId = gradeId;
        axios.get('http://localhost:4000/data/getGrade/' + gradeId)
            .then(response => {
                if (this.mounted) {
                    let alertMessage = 'עריכת שכבה: ' + response.data.grade;
                    greadeToEdit = response.data.grade;
                    this.setState({
                        grade: response.data.grade,
                        numOfClasses: response.data.numOfClasses,
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

    deleteGrade(gradeId) {
        axios.post('http://localhost:4000/data/deleteGrade/' + gradeId)
            .then(response => {
                if (this.mounted) {
                    let grades = [...this.state.grades];
                    for (let i = 0; i <= grades.length - 1; i++) {
                        if (grades[i]._id === gradeId) {
                            grades = [...grades.slice(0, i).concat(grades.slice(i + 1, grades.length))];
                            break;
                        }
                    }
                    this.setState({ grades: [...grades] });
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    saveButton() {
        if (!this.state.waitingToSave) {
            return (
                <button type="button" className="btn btn-secondary" onClick={() => this.setGrades()}>{this.state.buttonType}</button>
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
                <h4 style={{ "textAlign": "right" }}>הגדרת נתונים ושיעורים/ שכבות וכיתות</h4>
                <div className="input-group mt-3 mb-3">
                    <div className="input-group-append">
                        <label className="input-group-text" htmlFor="inputGroupSelect02">הגדר שכבה חדשה</label>
                    </div>
                    <select className="custom-select" id="inputGroupSelect02" value={this.state.grade} onChange={(e) => this.onChangeGeade(e)}>
                        <option value="">שכבה...</option>
                        <option value="ז">ז'</option>
                        <option value="ח">ח'</option>
                        <option value="ט">ט'</option>
                        <option value="י">י'</option>
                        <option value="יא">י"א</option>
                        <option value="יב">י"ב</option>
                    </select>
                </div>
                <div className="input-group mt-3 mb-3">
                    <div className="input-group-append">
                        <label className="input-group-text" htmlFor="inputGroupSelect02">מספר כיתות</label>
                    </div>
                    <select className="custom-select" id="inputGroupSelect02" value={this.state.numOfClasses} onChange={(e) => this.onChangeNumOfClasses(e)}>
                        <option value="">מספר כיתות...</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
                {/* <button type="button" className="btn btn-secondary" onClick={() => this.setGrades()}>{this.state.buttonType}</button> */}
                {this.saveButton()}
                {this.alertMessage()}
                {this.state.gradesFetched ?
                    (<DataTable
                        grades={this.state.grades}
                        table="grades"
                        onEdit={this.getGrade}
                        onDelete={this.deleteGrade}
                        disableButtons={this.state.disableButtons}>
                    </DataTable>) :
                    (<div className="text-center mt-5">
                        <div className="spinner-border" style={{ "width": "3rem", "height": "3rem" }} role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>)
                }
                {/* <DataTable
                    grades={this.state.grades}
                    table="grades"
                    onEdit={this.getGrade}
                    onDelete={this.deleteGrade}
                    disableButtons={this.state.disableButtons}>
                </DataTable> */}
            </div>
        );
    }
}

export default Grades;