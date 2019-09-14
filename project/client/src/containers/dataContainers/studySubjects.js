import React, { Component } from 'react';
import DataTable from '../dataContainers/tableDisplay/table';
import RoomFeatureCheckBox from '../../components/classRoomsComponents/roomFeatureCheckBox';
import AlertMessage from '../../components/alertMessage';
import axios from 'axios';
import down from '../../assets/sort-down.png';
import up from '../../assets/sort-up.png';

let subjectToEdit = '';
let subjectToEditId = '';

class StudySubjects extends Component {
    mounted = false;
    timeoutID;

    constructor(props) {
        super(props);
        this.state = {
            subjectName: '',
            grades: [],
            bagrut: false,
            gmol: '',
            mix: false,
            numOfMix: '',
            grouping: false,
            subjectFeatures: [],

            subjects: [],
            roomFeatures: [],
            checked: {
                'ז': false,
                'ח': false,
                'ט': false,
                'י': false,
                'יא': false,
                'יב': false
            },
            alertMessage: '',
            messageStatus: false,
            featuresChecked: [],
            buttonType: 'אישור',
            disableButtons: false,
            waitingToSave: false,
            subjectsFetched: false,
            featuresFetched: false,

            subjectSortImg: down,
            gradeSortImg: down,
        }
        this.handleFeatureCheck = this.handleFeatureCheck.bind(this);
        this.getSubject = this.getSubject.bind(this);
        this.deleteSubject = this.deleteSubject.bind(this);
        this.sortBySubject = this.sortBySubject.bind(this);
        this.compareSubject = this.compareSubject.bind(this);
        this.sortByGrade = this.sortByGrade.bind(this);
        this.compareGrade = this.compareGrade.bind(this);

    }

    componentDidMount() {
        this.mounted = true;
        axios.get('http://localhost:4000/data/getSubjects')
            .then(response => {
                if (this.mounted) {
                    console.log(response.data);
                    this.setState({ subjects: [...response.data], subjectsFetched: true });
                }
            })
            .catch(function (error) {
                console.log(error);
            })
        axios.get('http://localhost:4000/data/getRoomFeatures')
            .then(response => {
                if (this.mounted) {

                    let featuresChecked = [];
                    response.data.forEach(feature => {
                        let featureChecked = { roomFeature: feature.roomFeature, checked: false };
                        featuresChecked = [...featuresChecked, featureChecked];
                    });
                    let roomFeatures = [];
                    for (let i = 0; i <= response.data.length - 1; i++) {
                        roomFeatures.push(response.data[i].roomFeature);
                    }
                    this.setState({
                        roomFeatures: [...roomFeatures],
                        featuresChecked: [...featuresChecked],
                        featuresFetched: true
                    });
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

    componentDidUpdate(){
        console.log(this.state.featuresFetched);
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
                this.updateGradeChecked(grade);
                return;
            }
        }
        this.setState({ grades: [...currGrades, grade] });
        this.updateGradeChecked(grade);
    }

    updateGradeChecked(grade) {
        let checked = { ...this.state.checked };
        checked[grade] = !checked[grade];
        this.setState({ checked: checked })
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
                    <select className="custom-select" id="inputGroupSelect02" value={this.state.gmol} onChange={(e) => this.onChangeGmol(e)}>
                        <option value='' >גמול...</option>
                        <option value="0:15">0:15</option>
                        <option value="0:30">0:30</option>
                        <option value="0:45">0:45</option>
                        <option value="1:00">1:00</option>
                        <option value="1:15">1:15</option>
                        <option value="1:30">1:30</option>
                        <option value="1:45">1:45</option>
                        <option value="2:00">2:00</option>
                        <option value="2:45">2:45</option>
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
                        <input type="checkbox" checked={this.state.grouping} onChange={() => this.onGroupingCheck()} />
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
    }

    GroupingIsCheked() {
        if (this.state.grouping === true) {
            return (
                <div className="input-group mt-3 mb-3 pr-5">
                    <div className="input-group-append">
                        <label className="input-group-text" htmlFor="inputGroupSelect02">מספר הקבצות</label>
                    </div>
                    <select className="custom-select" id="inputGroupSelect02" value={this.state.numOfMix} onChange={(e) => this.onChangeNumOfMix(e)}>
                        <option value="">מספר הקבצות...</option>
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

    setSubjects() {
        if (!this.checkIfInputValid()) {
            return;
        }
        if (this.subjectNameIsTaken()) {
            return;
        }
        console.log(this.state.subjectFeatures);
        const newSubject = {
            subjectName: this.state.subjectName,
            grades: [...this.state.grades],
            bagrut: this.state.bagrut,
            gmol: this.state.gmol,
            mix: this.state.mix,
            numOfMix: this.state.numOfMix,
            grouping: this.state.grouping,
            subjectFeatures: [...this.state.subjectFeatures]
        };
        if (this.state.buttonType === 'אישור') {
            let subject = {};
            this.setState({ waitingToSave: true }, () => {
                axios.post('http://localhost:4000/data/addSubject', newSubject)
                    .then(res => {
                        if (this.mounted) {
                            subject = { ...res.data };
                            this.setState({
                                subjects: [...this.state.subjects, subject],
                                waitingToSave: false
                            });
                            this.resetInputs();
                        }
                    });
            })
        } else if (this.state.buttonType === 'סיים עריכה') {
            if (!this.state.grouping) {
                newSubject.numOfMix = '';
            }
            this.setState({ waitingToSave: true }, () => {
                axios.post('http://localhost:4000/data/updateSubject/' + subjectToEditId, newSubject)
                    .then(res => {
                        if (this.mounted) {
                            let subjects = [...this.state.subjects];
                            for (let i = 0; i <= subjects.length - 1; i++) {
                                if (subjects[i]._id === res.data._id) {
                                    subjects[i] = { ...res.data };
                                }
                            }
                            this.setState({
                                subjects: [...subjects],
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
        let subjectName = this.state.subjectName;
        let grades = [...this.state.grades];
        let bagrut = this.state.bagrut;
        let gmol = this.state.gmol;
        let grouping = this.state.grouping;
        let numOfMix = this.state.numOfMix;
        let message = 'ישנה בעיה עם לפחות אחד מן השדות:$';
        let originalMessage = message;
        if (subjectName === '') {
            message += 'לא הוזן מקצוע$';
        }
        if (bagrut === true && gmol === '') {
            message += 'המקצוע נבחר כנלמד לבגרות אך לא צוין גמול$';
        }
        if (grouping === true && numOfMix === '') {
            message += 'המקצוע סומן כנלמד להקבצות אך לא ציונו מספר הקבצות$';
        }
        if (grades.length === 0) {
            message += 'לא נבחרו כיתות שכבות את המקצוע$';
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

    subjectNameIsTaken() {
        let message = '';
        let subjects = [...this.state.subjects];
        let currSubjectName = this.state.subjectName;
        for (let i = 0; i <= subjects.length - 1; i++) {
            if (currSubjectName === subjects[i].subjectName && this.state.buttonType === 'אישור') {
                message = 'מקצוע זה כבר הוגדר';
                this.setState({ alertMessage: message, messageStatus: false });
                this.alertMessage();
                return true;
            } else if (currSubjectName === subjects[i].subjectName && currSubjectName !== subjectToEdit && this.state.buttonType === 'סיים עריכה') {
                message = 'מקצוע זה כבר הוגדר';
                this.setState({ alertMessage: message, messageStatus: false });
                this.alertMessage();
                return true;
            }
        }
        return false;
    }

    resetInputs() {
        clearTimeout(this.timeoutID);
        let checked = { ...this.state.checked };
        for (let grade in checked) {
            checked[grade] = false;
        }
        let subjectName = '';
        let grades = [];
        let bagrut = false;
        let gmol = '';
        let mix = false;
        let numOfMix = '';
        let grouping = false;
        let subjectFeatures = [];
        // console.log(this.state.featuresChecked);
        let featuresChecked = [...this.state.featuresChecked];
        for (let i = 0; i <= featuresChecked.length - 1; i++) {
            featuresChecked[i].checked = false;
        }
        // console.log(featuresChecked);
        subjectFeatures = [...this.state.subjectFeatures];
        let alertMessage = 'הערך נשמר - אשפר להזין מקצוע חדש';
        this.setState({
            subjectName: subjectName,
            grades: [...grades],
            bagrut: bagrut,
            checked: checked,
            gmol: gmol,
            mix: mix,
            numOfMix: numOfMix,
            grouping: grouping,
            subjectFeatures: [...subjectFeatures],
            alertMessage: alertMessage,
            messageStatus: true,
            featuresChecked: [...featuresChecked]
        }, () => {
            console.log(this.state.featuresChecked);
            this.timeoutID = setTimeout(() => { this.setState({ alertMessage: '' }) }, 1500);
        });
    }

    handleFeatureCheck(feature) {
        // console.log(feature);
        let i = this.checkIfFeatureUnCheckd(feature);
        let subjectFeatures = [...this.state.subjectFeatures];
        if (i !== -1) {
            subjectFeatures = [...subjectFeatures.slice(0, i).concat(subjectFeatures.slice(i + 1, subjectFeatures.length))];
            this.setFeaturesChecked(feature, false);
            this.setState({
                subjectFeatures: [...subjectFeatures],
                featuresChecked: [...this.state.featuresChecked]
            })
        } else {
            this.setFeaturesChecked(feature, true);
            this.setState({
                subjectFeatures: [...subjectFeatures, feature],
                featuresChecked: [...this.state.featuresChecked]
            })
        }
    }

    checkIfFeatureUnCheckd(feature) {
        let subjectFeatures = [...this.state.subjectFeatures];
        for (let i = 0; i <= subjectFeatures.length - 1; i++) {
            if (feature === subjectFeatures[i]) {
                return i;
            }
        }
        return -1;
    }

    setFeaturesChecked(feature, checked) {
        let featuresChecked = [...this.state.featuresChecked];
        for (let i = 0; i <= featuresChecked.length - 1; i++) {
            if (featuresChecked[i].roomFeature === feature) {
                featuresChecked[i].checked = checked;
            }
        }
        this.setState({ featuresChecked: [...featuresChecked] });
    }

    getCheckStatus(feature) {
        let featuresChecked = [...this.state.featuresChecked];
        for (let i = 0; i <= featuresChecked.length - 1; i++) {
            if (featuresChecked[i].roomFeature === feature) {
                return featuresChecked[i].checked;
            }
        }
    }

    getSubject(subjectId) {
        window.scrollTo(0, 0);
        clearTimeout(this.timeoutID);
        console.log(this.state.featuresChecked);
        subjectToEditId = subjectId;
        axios.get('http://localhost:4000/data/getSubject/' + subjectId)
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
                    this.setFeaturesCheckStatus(response.data.subjectFeatures);

                    let alertMessage = 'עריכת פרטי המורה: ' + response.data.subjectName;
                    subjectToEdit = response.data.subjectName;
                    this.setState({
                        grades: [...response.data.grades],
                        subjectName: response.data.subjectName,
                        bagrut: response.data.bagrut,
                        checked: checked,
                        gmol: response.data.gmol,
                        grouping: response.data.grouping,
                        mix: response.data.mix,
                        numOfMix: response.data.numOfMix,
                        alertMessage: alertMessage,
                        messageStatus: true,
                        buttonType: 'סיים עריכה',
                        disableButtons: true,
                        subjectFeatures: [...response.data.subjectFeatures]
                    })
                    this.alertMessage();
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    setFeaturesCheckStatus(subjectFeatures) {
        // console.log(subjectFeatures);
        // console.log(this.state.featuresChecked);
        let featuresChecked = [...this.state.featuresChecked];
        for (let i = 0; i <= subjectFeatures.length - 1; i++) {
            for (let j = 0; j <= featuresChecked.length - 1; j++) {
                if (subjectFeatures[i] === featuresChecked[j].roomFeature) {
                    featuresChecked[j].checked = true;
                }
            }
        }
        this.setState({ featuresChecked: [...featuresChecked] }, function () {
            // console.log(this.state.featuresChecked);
        });
    }

    deleteSubject(subjectId) {
        axios.post('http://localhost:4000/data/deleteSubject/' + subjectId)
            .then(response => {
                if (this.mounted) {
                    let subjects = [...this.state.subjects];
                    for (let i = 0; i <= subjects.length - 1; i++) {
                        if (subjects[i]._id === subjectId) {
                            subjects = [...subjects.slice(0, i).concat(subjects.slice(i + 1, subjects.length))];
                            break;
                        }
                    }
                    this.setState({ subjects: [...subjects] });
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    sortBySubject() {
        let imgSrc = this.state.subjectSortImg;
        if (imgSrc === down) {
            imgSrc = up;
        } else if (imgSrc === up) {
            imgSrc = down;
        }
        this.setState({
            subjects: [...this.state.subjects.sort(this.compareSubject)],
            subjectSortImg: imgSrc
        });
    }

    compareSubject(a, b) {
        const subjectA = a.subjectName;
        const subjectB = b.subjectName;

        let comparison = 0;
        if (this.state.subjectSortImg === down) {
            if (subjectA > subjectB) {
                comparison = 1;
            } else if (subjectA < subjectB) {
                comparison = -1;
            }
        } else if (this.state.subjectSortImg === up) {
            if (subjectA < subjectB) {
                comparison = 1;
            } else if (subjectA > subjectB) {
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
            subjects: [...this.state.subjects.sort(this.compareGrade)],
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
                <button type="button" className="btn btn-secondary" onClick={() => this.setSubjects()}>{this.state.buttonType}</button>);
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
                <h4 style={{ "textAlign": "right" }}>הגדרת נתונים ושיעורים/ מקצועות</h4>
                <div className="input-group mt-3 mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">הגדר מקצוע חדש</span>
                    </div>
                    <input
                        type="text"
                        className="form-control"
                        value={this.state.subjectName}
                        placeholder="מקצוע..."
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        onChange={(e) => (this.onSubjectNameChange(e))}>
                    </input>
                </div>
                <div className="w-50" style={{ float: "right" }}>
                    <h5 style={{ textAlign: "right" }}>{'כיתות הלומדות את המקצוע '}</h5>
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
                <div className="w-50" style={{ float: "right" }}>
                    <h5 style={{ textAlign: "right" }}>{'פרטים נוספים על המקצוע'}</h5>
                    <div style={{ textAlign: "right" }}>
                        <input type="checkbox" checked={this.state.bagrut} onChange={() => this.onBagrutCheck()} />
                        <div style={{ display: "inline" }}> {'נלמד לבגרות'}</div>
                    </div>
                    {this.bagrutIsCheked()}
                    <div className="pt-3" style={{ textAlign: "right" }}>
                        <input type="checkbox" checked={this.state.mix} onChange={() => this.onMixCheck()} />
                        <div style={{ display: "inline" }}> {'מקצוע שמערבב את כל הכיתות בשכבה'}</div>
                    </div>
                    {this.mixIsCheked()}
                    <h6 className="pt-2 mb-0" style={{ "textAlign": "right" }}>המקצוע דורש:</h6>
                    {/* {this.state.roomFeatures.map((roomFeature, index) => { */}
                    {this.state.featuresFetched ?
                        (<div>
                            {this.state.featuresChecked.map((roomFeature, index) => {
                                return (
                                    <RoomFeatureCheckBox
                                        key={index}
                                        roomFeature={roomFeature.roomFeature}
                                        roomFeatureCheck={this.handleFeatureCheck}
                                        // checked={this.getCheckStatus(roomFeature)}>
                                        checked={roomFeature.checked}>
                                    </RoomFeatureCheckBox>
                                )
                            })}
                        </div>) :
                        (<div className="clearfix mt-5">
                            <div className="spinner-border float-right" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>)
                    }
                    {/* {this.state.featuresChecked.map((roomFeature, index) => {
                        return (
                            <RoomFeatureCheckBox
                                key={index}
                                roomFeature={roomFeature.roomFeature}
                                roomFeatureCheck={this.handleFeatureCheck}
                                // checked={this.getCheckStatus(roomFeature)}>
                                checked={roomFeature.checked}>
                            </RoomFeatureCheckBox>
                        )
                    })} */}
                </div>
                <div></div>
                {/* <button type="button" className="btn btn-secondary" onClick={() => this.setSubjects()}>{this.state.buttonType}</button> */}
                {this.saveButton()}
                {this.alertMessage()}
                {this.state.subjectsFetched ?
                    (<DataTable
                        subjects={this.state.subjects}
                        table="subjects"
                        onEdit={this.getSubject}
                        onDelete={this.deleteSubject}
                        disableButtons={this.state.disableButtons}
                        sortBySubject={this.sortBySubject}
                        subjectSortImg={this.state.subjectSortImg}
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
                    subjects={this.state.subjects}
                    table="subjects"
                    onEdit={this.getSubject}
                    onDelete={this.deleteSubject}
                    disableButtons={this.state.disableButtons}
                    sortBySubject={this.sortBySubject}
                    subjectSortImg={this.state.subjectSortImg}
                    sortByGrade={this.sortByGrade}
                    gradeSortImg={this.state.gradeSortImg}>
                </DataTable> */}
            </div>
        );
    }
}

export default StudySubjects;