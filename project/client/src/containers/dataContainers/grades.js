import React, { Component } from 'react';
//import GradesTable from '../dataContainers/grades/gradeTable'
import DataTable from '../dataContainers/tableDisplay/table';
import axios from 'axios';

class Grades extends Component {
    state = {
        grade: '',
        numOfClasses: 0,
        grades: []
    };

    componentDidMount() {
        axios.get('http://localhost:4000/data/getGrades')
            .then(response => {
                this.setState({ grades: [...response.data] });
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    onChangeGeade(e) {
        console.log(e.target.value);
        this.setState({ grade: e.target.value });
    }

    onChangeNumOfClasses(e) {
        console.log(e.target.value);
        this.setState({ numOfClasses: e.target.value });
    }

    setGrades() {
        console.log(this.state.grades);

        const newGrade = {
            grade: this.state.grade,
            numOfClasses: this.state.numOfClasses
        };

        axios.post('http://localhost:4000/data/addGrade', newGrade)
            .then(res => console.log(res.data));

        this.setState({ grades: [...this.state.grades, { grade: this.state.grade, numOfClasses: this.state.numOfClasses }] });
    }

    render() {
        return (
            <div>
                <div className="input-group mt-3 mb-3">
                    <div className="input-group-append">
                        <label className="input-group-text" htmlFor="inputGroupSelect02">הגדר שכבה חדשה</label>
                    </div>
                    <select className="custom-select" id="inputGroupSelect02" onChange={(e) => this.onChangeGeade(e)}>
                        <option >...שכבה</option>
                        <option value="ז">ז'</option>
                        <option value="ח">'ח</option>
                        <option value="ט">'ט</option>
                        <option value="י">'י</option>
                        <option value="יא">י"א</option>
                        <option value="יב">י"ב</option>
                    </select>
                </div>
                <div className="input-group mt-3 mb-3">
                    <div className="input-group-append">
                        <label className="input-group-text" htmlFor="inputGroupSelect02">מספר כיתות</label>
                    </div>
                    <select className="custom-select" id="inputGroupSelect02" onChange={(e) => this.onChangeNumOfClasses(e)}>
                        <option >...מספר כיתות</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
                <button type="button" className="btn btn-secondary" onClick={() => this.setGrades()}>אישור</button>
                <DataTable grades={this.state.grades} table="grades"></DataTable>
            </div>
        );
    }
}

export default Grades;