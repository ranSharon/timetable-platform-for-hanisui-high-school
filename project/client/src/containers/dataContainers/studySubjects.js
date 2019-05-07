import React, { Component } from 'react';
import DataTable from '../dataContainers/tableDisplay/table';
import axios from 'axios';

class StudySubjects extends Component {
    state = {
        subjectName: '',
        grades: [],
        bagrut: false,
        gmol: 0,
        mix: false,
        numOfMix: 0,
        grouping: false,
        specificRoom: false,
        computerRoom: false,
        subjects: []
    }

    componentDidMount() {
        axios.get('http://localhost:4000/data/getSubjects')
            .then(response => {
                this.setState({ subjects: [...response.data] });
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    onSubjectNameChange(e) {
        this.setState({ subjectName: e.target.value });
    }

    onClassCheck(e) {
        const grade = e.target.value;
        let currGrades = [...this.state.grades];
        for (let i = 0; i <= currGrades.length - 1; i++) {
            if (currGrades[i] === grade) {
                currGrades = [...currGrades.slice(0, i).concat(currGrades.slice(i + 1, currGrades.length))];
                this.setState({ grades: [...currGrades] });
                return;
            }
        }
        this.setState({ grades: [...currGrades, grade] });
    }

    onBagrutCheck() {
        this.setState({ bagrut: !this.state.bagrut });
    }

    bagrutIsCheked() {
        if (this.state.bagrut === true) {
            return (
                <div className="input-group mt-3 mb-3 pr-5">
                    <div className="input-group-append">
                        <label className="input-group-text" htmlFor="inputGroupSelect02">גמול</label>
                    </div>
                    <select className="custom-select" id="inputGroupSelect02" onChange={(e) => this.onChangeGmol(e)}>
                        <option >... גמול</option>
                        <option value="0:15">0:15</option>
                        <option value="0:30">0:30</option>
                        <option value="1:00">1:00</option>
                        <option value="1:30">1:30</option>
                        <option value="2:00">2:00</option>
                        <option value="2:30">2:30</option>
                    </select>
                </div>
            )
        } else {
            return null;
        }
    }

    onChangeGmol(e) {
        this.setState({ gmol: e.target.value });
    }

    onMixCheck() {
        this.setState({ mix: !this.state.mix });
    }

    mixIsCheked() {
        if (this.state.mix === true) {
            return (
                <div className="pr-5">
                    <div style={{ textAlign: "right" }}>
                        <input type="checkbox" onClick={() => this.onGroupingCheck()} />
                        <div style={{ display: "inline" }}> {'מקצוע שמחולק להקבצות'}</div>
                    </div>
                    {this.GroupingIsCheked()}
                </div>
            );
        } else {
            return null;
        }
    }

    onGroupingCheck() {
        this.setState({ grouping: !this.state.grouping });
        console.log(this.state.grouping);
    }

    GroupingIsCheked() {
        if (this.state.grouping === true) {
            return (
                <div className="input-group mt-3 mb-3 pr-5">
                    <div className="input-group-append">
                        <label className="input-group-text" htmlFor="inputGroupSelect02">מספר הקבצות</label>
                    </div>
                    <select className="custom-select" id="inputGroupSelect02" onChange={(e) => this.onChangeNumOfMix(e)}>
                        <option >מספר הקבצות...</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>
            )
        } else {
            return null;
        }
    }
    onChangeNumOfMix(e) {
        this.setState({ numOfMix: e.target.value });
    }

    onSpecificRoomCheck() {
        this.setState({ specificRoom: !this.state.specificRoom });
        console.log(this.state.specificRoom);
    }

    onComputerRoomCheck() {
        this.setState({ computerRoom: !this.state.computerRoom });
        console.log(this.state.computerRoom);
    }

    setSubjects() {
        const newSubject = {
            subjectName: this.state.subjectName,
            grades: [...this.state.grades],
            bagrut: this.state.bagrut,
            gmol: this.state.gmol,
            mix: this.state.mix,
            numOfMix: this.state.numOfMix,
            grouping: this.state.grouping,
            specificRoom: this.state.specificRoom,
            computerRoom: this.state.computerRoom
        };

        axios.post('http://localhost:4000/data/addSubject', newSubject)
            .then(res => console.log(res.data));

        this.setState({
            subjects: [...this.state.subjects, {
                subjectName: this.state.subjectName,
                grades: [...this.state.grades],
                bagrut: this.state.bagrut,
                gmol: this.state.gmol,
                mix: this.state.mix,
                numOfMix: this.state.numOfMix,
                grouping: this.state.grouping,
                specificRoom: this.state.specificRoom,
                computerRoom: this.state.computerRoom
            }]
        });
        console.log(this.state.subjects);
    }

    render() {
        return (
            <div>
                <div className="input-group mt-3 mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">הגדר מקצוע חדש</span>
                    </div>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="מקצוע..."
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        onChange={(e) => (this.onSubjectNameChange(e))}>
                    </input>
                </div>
                <div className="w-50" style={{ float: "right" }}>
                    <h5 style={{ textAlign: "right" }}>{'כיתות הלומדות את המקצוע '}</h5>
                    <div style={{ textAlign: "right" }}>
                        <input type="checkbox" lable="ז" value="ז" onClick={(e) => this.onClassCheck(e)} />
                        <div style={{ display: "inline" }}> {'ז'}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <input type="checkbox" lable="ח" value="ח" onClick={(e) => this.onClassCheck(e)} />
                        <div style={{ display: "inline" }}> {'ח'}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <input type="checkbox" lable="ט" value="ט" onClick={(e) => this.onClassCheck(e)} />
                        <div style={{ display: "inline" }}> {'ט'}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <input type="checkbox" lable="י" value="י" onClick={(e) => this.onClassCheck(e)} />
                        <div style={{ display: "inline" }}> {'י'}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <input type="checkbox" lable="יא" value="יא" onClick={(e) => this.onClassCheck(e)} />
                        <div style={{ display: "inline" }}> {'יא'}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <input type="checkbox" lable="יב" value="יב" onClick={(e) => this.onClassCheck(e)} />
                        <div style={{ display: "inline" }}> {'יב'}</div>
                    </div>
                </div>
                <div className="w-50" style={{ float: "right" }}>
                    <h5 style={{ textAlign: "right" }}>{'פרטים נוספים על המקצוע'}</h5>
                    <div style={{ textAlign: "right" }}>
                        <input type="checkbox" onClick={() => this.onBagrutCheck()} />
                        <div style={{ display: "inline" }}> {'נלמד לבגרות'}</div>
                    </div>
                    {this.bagrutIsCheked()}
                    <div className="pt-3" style={{ textAlign: "right" }}>
                        <input type="checkbox" onClick={() => this.onMixCheck()} />
                        <div style={{ display: "inline" }}> {'מקצוע שמערבב את כל הכיתות בשכבה'}</div>
                    </div>
                    {this.mixIsCheked()}
                    <div className="pt-3" style={{ textAlign: "right" }}>
                        <input type="checkbox" onClick={() => this.onSpecificRoomCheck()} />
                        <div style={{ display: "inline" }}> {'האם המקצוע נלמד בכיתה יעודית'}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <input type="checkbox" onClick={() => this.onComputerRoomCheck()} />
                        <div style={{ display: "inline" }}> {'האם המקצוע דורש מחשב'}</div>
                    </div>
                </div>
                <div></div>

                <button type="button" className="btn btn-secondary" onClick={() => this.setSubjects()}>אישור</button>
                <DataTable subjects={this.state.subjects} table="subjects"></DataTable>
            </div>
        );
    }
}

export default StudySubjects;