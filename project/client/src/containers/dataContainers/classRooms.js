import React, { Component } from 'react';
import DataTable from '../dataContainers/tableDisplay/table';
import RoomFeatures from '../../components/classRoomsComponents/roomFeatures';
import RoomFeatureCheckBox from '../../components/classRoomsComponents/roomFeatureCheckBox';
import AlertMessage from '../../components/alertMessage';
import axios from 'axios';
import down from '../../assets/sort-down.png';
import up from '../../assets/sort-up.png';

let classRoomToEdit = '';
let classRoomToEditId = '';

class ClassRooms extends Component {
    mounted = false;

    constructor(props) {
        super(props);
        this.state = {
            classRoomName: '',
            classRoomFeatures: [],

            roomFeatures: [],
            roomFeature: '',
            classRooms: [],
            alertMessage: '',
            messageStatus: false,
            alertMessageForFeatures: '',
            alertMessageForFeaturesStatus: false,
            roomFeaturesChecked: [],
            buttonType: 'אישור',
            disableButtons: false,
            waitingToSave: false,
            featureWaitingToSave: false,
            classRoomsFetched: false,
            featuresFetched: false,

            showRoomFeatures: false,
            RoomFeaturesButtonType: 'הצג הגדרת מאפייני חדר',

            classroomSortImg: down
        }
        this.HandleRoomFeatureChange = this.HandleRoomFeatureChange.bind(this);
        this.HandleAddRoomFeature = this.HandleAddRoomFeature.bind(this);
        this.HandleRoomFeatureCheck = this.HandleRoomFeatureCheck.bind(this);
        this.handleDeleteRoomFeature = this.handleDeleteRoomFeature.bind(this);
        this.getClassRoom = this.getClassRoom.bind(this);
        this.deleteClassRoom = this.deleteClassRoom.bind(this);
        this.sortByClassroom = this.sortByClassroom.bind(this);
        this.compareClassroom = this.compareClassroom.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
        axios.get('http://localhost:4000/data/getClassRooms')
            .then(response => {
                if (this.mounted) {
                    console.log(response.data);
                    this.setState({ classRooms: [...response.data], classRoomsFetched: true });
                }
            })
            .catch(function (error) {
                console.log(error);
            })
        axios.get('http://localhost:4000/data/getRoomFeatures')
            .then(response => {
                if (this.mounted) {
                    let roomFeatures = [];
                    for (let i = 0; i <= response.data.length - 1; i++) {
                        roomFeatures.push(response.data[i].roomFeature);
                    }
                    this.setState({ roomFeatures: [...roomFeatures] }, function () {
                        this.initRoomFeaturesChecked();
                        if (this.state.roomFeatures.length === 0) {
                            this.setState({
                                showRoomFeatures: true,
                                RoomFeaturesButtonType: 'הסתר הגדרת מאפייני חדר',
                            });
                        }
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

    initRoomFeaturesChecked() {
        let roomFeaturesChecked = [];
        let roomFeatures = [...this.state.roomFeatures];
        for (let i = 0; i <= roomFeatures.length - 1; i++) {
            let featuresChecked = { roomFeature: roomFeatures[i], checked: false };
            roomFeaturesChecked = [...roomFeaturesChecked, featuresChecked];
        }
        this.setState({ roomFeaturesChecked: [...roomFeaturesChecked], featuresFetched: true });
    }

    onClassRoomNameChange(e) {
        this.setState({ classRoomName: e.target.value });
    }

    setClassRooms() {
        if (!this.checkIfInputValid()) {
            return;
        }
        if (this.classRoomNameIsTaken()) {
            return;
        }
        const newClassRoom = {
            classRoomName: this.state.classRoomName,
            classRoomFeatures: [...this.state.classRoomFeatures]
        };
        if (this.state.buttonType === 'אישור') {
            let classRoom = {};
            this.setState({ waitingToSave: true }, () => {
                axios.post('http://localhost:4000/data/addClassRoom', newClassRoom)
                    .then(res => {
                        if (this.mounted) {
                            classRoom = { ...res.data };
                            this.setState({
                                classRooms: [...this.state.classRooms, classRoom],
                                waitingToSave: false
                            });
                            this.resetInputs();
                        }
                    });
            });
        } else if (this.state.buttonType === 'סיים עריכה') {
            this.setState({ waitingToSave: true }, () => {
                axios.post('http://localhost:4000/data/updateClassRoom/' + classRoomToEditId, newClassRoom)
                    .then(res => {
                        if (this.mounted) {
                            let classRooms = [...this.state.classRooms];
                            for (let i = 0; i <= classRooms.length - 1; i++) {
                                if (classRooms[i]._id === res.data._id) {
                                    classRooms[i] = { ...res.data };
                                }
                            }
                            this.setState({
                                classRooms: [...classRooms],
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
        let classRoomName = this.state.classRoomName;
        let message = 'ישנה בעיה עם לפחות אחד מן השדות:$';
        let originalMessage = message;
        if (classRoomName === '') {
            message += 'לא הוזנה כיתת לימוד$';
        }
        if (message === originalMessage) {
            return true;
        } else {
            this.setState({ alertMessage: message, messageStatus: false });
            this.alertMessage();
            return false;
        }
    }

    classRoomNameIsTaken() {
        let message = '';
        let classRooms = [...this.state.classRooms];
        let currClassRoomName = this.state.classRoomName;
        for (let i = 0; i <= classRooms.length - 1; i++) {
            if (currClassRoomName === classRooms[i].classRoomName && this.state.buttonType === 'אישור') {
                message = 'הוזנה כבר כיתה כזאת';
                this.setState({ alertMessage: message, messageStatus: false });
                this.alertMessage();
                return true;
            } else if (currClassRoomName === classRooms[i].classRoomName && currClassRoomName !== classRoomToEdit && this.state.buttonType === 'סיים עריכה') {
                message = 'הוזנה כבר כיתה כזאת';
                this.setState({ alertMessage: message, messageStatus: false });
                this.alertMessage();
                return true;
            }
        }
        return false;
    }

    resetInputs() {
        clearTimeout(this.timeoutID);
        let classRoomName = this.state.classRoomName;
        let classRoomFeatures = [...this.state.classRoomFeatures];
        let alertMessage = this.state.alertMessage;
        for (let i = 0; i <= classRoomFeatures.length - 1; i++) {
            this.setRoomFeaturesChecked(classRoomFeatures[i], false);
        }
        classRoomFeatures = [];
        classRoomName = '';
        alertMessage = 'הערך נשמר - אפשר להזין כיתת לימוד חדשה';
        this.setState({
            classRoomName: classRoomName,
            classRoomFeatures: classRoomFeatures,
            alertMessage: alertMessage,
            messageStatus: true
        }, () => {
            this.timeoutID = setTimeout(() => { this.setState({ alertMessage: '' }) }, 1500);
        });
    }

    HandleRoomFeatureChange(roomFeature) {
        this.setState({ roomFeature: roomFeature });
    }

    HandleAddRoomFeature() {
        console.log(this.state.roomFeature);
        let roomFeatures = [...this.state.roomFeatures];
        if (this.checkIfFeatureTaken()) {
            this.setState({
                alertMessageForFeatures: 'מאפיין זה כבר הוגדר',
                alertMessageForFeaturesStatus: false
            })
        }
        else if (this.state.roomFeature === '') {
            this.setState({
                alertMessageForFeatures: 'לא הוזן מאפיין בשדה הגדרת המאפיין',
                alertMessageForFeaturesStatus: false
            })
        }
        else {
            let roomFeatureChecked = { roomFeature: this.state.roomFeature, checked: false };
            let roomFeaturesChecked = [...this.state.roomFeaturesChecked];
            roomFeaturesChecked = [...roomFeaturesChecked, roomFeatureChecked];
            let newRoomFeature = {
                roomFeature: this.state.roomFeature
            };
            axios.post('http://localhost:4000/data/addRoomFeature', newRoomFeature)
                .then(res => {
                    if (this.mounted) {
                        this.setState({
                            roomFeatures: [...roomFeatures, this.state.roomFeature],
                            alertMessageForFeatures: 'המאפיין הוגדר',
                            alertMessageForFeaturesStatus: true,
                            roomFeature: '',
                            roomFeaturesChecked: [...roomFeaturesChecked]
                        });
                        this.resetInputs();
                        this.setState({ alertMessage: '' });
                    }
                });

        }
    }

    checkIfFeatureTaken() {
        let roomFeature = this.state.roomFeature;
        let roomFeatures = [...this.state.roomFeatures];
        for (let i = 0; i <= roomFeatures.length - 1; i++) {
            if (roomFeature === roomFeatures[i]) {
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

    handleDeleteRoomFeature(roomFeature) {
        axios.post('http://localhost:4000/data/deleteRoomFeature/' + roomFeature)
            .then(response => {
                if (this.mounted) {
                    let roomFeatures = [...this.state.roomFeatures];
                    for (let i = 0; i <= roomFeatures.length - 1; i++) {
                        if (roomFeatures[i] === response.data.roomFeature) {
                            roomFeatures = [...roomFeatures.slice(0, i).concat(roomFeatures.slice(i + 1, roomFeatures.length))];
                            break;
                        }
                    }
                    let roomFeaturesChecked = [...this.state.roomFeaturesChecked]
                    for (let i = 0; i <= roomFeaturesChecked.length - 1; i++) {
                        if (roomFeaturesChecked[i].roomFeature === response.data.roomFeature) {
                            roomFeaturesChecked = [...roomFeaturesChecked.slice(0, i).concat(roomFeaturesChecked.slice(i + 1, roomFeaturesChecked.length))];
                            break;
                        }
                    }
                    this.resetInputs();
                    this.setState({
                        roomFeatures: [...roomFeatures],
                        roomFeaturesChecked: [...roomFeaturesChecked],
                        alertMessage: '',
                        alertMessageForFeatures: ''
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    HandleRoomFeatureCheck(roomFeature) {
        let classRoomFeatures = [...this.state.classRoomFeatures];
        let i = this.checkIfRoomFeatureUnCheckd(roomFeature);
        if (i !== -1) {
            classRoomFeatures = [...classRoomFeatures.slice(0, i).concat(classRoomFeatures.slice(i + 1, classRoomFeatures.length))];
            this.setRoomFeaturesChecked(roomFeature, false);
            this.setState({
                classRoomFeatures: [...classRoomFeatures]
            })
        } else {
            this.setRoomFeaturesChecked(roomFeature, true);
            this.setState({
                classRoomFeatures: [...classRoomFeatures, roomFeature],
            })
        }
    }

    checkIfRoomFeatureUnCheckd(roomFeature) {
        let classRoomFeatures = [...this.state.classRoomFeatures];
        for (let i = 0; i <= classRoomFeatures.length - 1; i++) {
            if (roomFeature === classRoomFeatures[i]) {
                return i;
            }
        }
        return -1;
    }

    setRoomFeaturesChecked(roomFeature, checked) {
        let roomFeaturesChecked = [...this.state.roomFeaturesChecked];
        for (let i = 0; i <= roomFeaturesChecked.length - 1; i++) {
            if (roomFeaturesChecked[i].roomFeature === roomFeature) {
                roomFeaturesChecked[i].checked = checked;
            }
        }
        this.setState({ roomFeaturesChecked: [...roomFeaturesChecked] });
    }

    getCheckStatus(roomFeature) {
        let roomFeaturesChecked = [...this.state.roomFeaturesChecked];
        for (let i = 0; i <= roomFeaturesChecked.length - 1; i++) {
            if (roomFeaturesChecked[i].roomFeature === roomFeature) {
                return roomFeaturesChecked[i].checked;
            }
        }
    }

    setCheckStatus(classRoomFeatures) {
        let roomFeaturesChecked = [...this.state.roomFeaturesChecked];
        for (let i = 0; i <= classRoomFeatures.length - 1; i++) {
            for (let j = 0; j <= roomFeaturesChecked.length - 1; j++) {
                if (classRoomFeatures[i] === roomFeaturesChecked[j].roomFeature) {
                    roomFeaturesChecked[j].checked = true;
                }
            }
        }
        this.setState({ roomFeaturesChecked: [...roomFeaturesChecked] });
    }

    getClassRoom(classRoomId) {
        window.scrollTo(0, 0);
        clearTimeout(this.timeoutID);
        // console.log(this.state.roomFeaturesChecked);
        classRoomToEditId = classRoomId;
        axios.get('http://localhost:4000/data/getClassRoom/' + classRoomId)
            .then(response => {
                if (this.mounted) {
                    let alertMessage = 'עריכת כיתה: ' + response.data.classRoomName;
                    classRoomToEdit = response.data.classRoomName;
                    this.setCheckStatus(response.data.classRoomFeatures);
                    let classRoomFeatures = [...this.setClassRoomFeaturesForEdit(response.data.classRoomFeatures)];
                    this.setState({
                        classRoomName: response.data.classRoomName,
                        classRoomFeatures: [...classRoomFeatures],
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

    deleteClassRoom(classRoomId) {
        axios.post('http://localhost:4000/data/deleteClassRoom/' + classRoomId)
            .then(response => {
                if (this.mounted) {
                    let classRooms = [...this.state.classRooms];
                    for (let i = 0; i <= classRooms.length - 1; i++) {
                        if (classRooms[i]._id === classRoomId) {
                            classRooms = [...classRooms.slice(0, i).concat(classRooms.slice(i + 1, classRooms.length))];
                            break;
                        }
                    }
                    this.setState({ classRooms: [...classRooms] });
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    setClassRoomFeaturesForEdit(classRoomFeatures) {
        let classRoomFeaturesForEdit = [];
        let roomFeatures = [...this.state.roomFeatures];
        for (let i = 0; i <= classRoomFeatures.length - 1; i++) {
            for (let j = 0; j <= roomFeatures.length - 1; j++) {
                if (classRoomFeatures[i] === roomFeatures[j]) {
                    classRoomFeaturesForEdit = [...classRoomFeaturesForEdit, classRoomFeatures[i]];
                }
            }
        }
        return classRoomFeaturesForEdit;
    }

    showRoomFeatures() {
        if (!this.state.showRoomFeatures) {
            return null;
        }
        return (
            <RoomFeatures
                roomFeature={this.state.roomFeature}
                roomFeatures={this.state.roomFeatures}
                roomFeatureChange={this.HandleRoomFeatureChange}
                addRoomFeature={this.HandleAddRoomFeature}
                alertMessage={this.state.alertMessageForFeatures}
                alertMessageForFeaturesStatus={this.state.alertMessageForFeaturesStatus}
                onDelete={this.handleDeleteRoomFeature}
            >
            </RoomFeatures>
        );
    }

    setShowRoomFeatures() {
        this.setState({ showRoomFeatures: !this.state.showRoomFeatures });
        let RoomFeaturesButtonType = this.state.RoomFeaturesButtonType;
        if (RoomFeaturesButtonType === 'הצג הגדרת מאפייני חדר') {
            RoomFeaturesButtonType = 'הסתר הגדרת מאפייני חדר';
        } else {
            RoomFeaturesButtonType = 'הצג הגדרת מאפייני חדר';
            this.setState({
                alertMessageForFeatures: '',
                roomFeature: '',
            });
        }
        this.setState({ RoomFeaturesButtonType: RoomFeaturesButtonType });
    }

    sortByClassroom() {
        let imgSrc = this.state.classroomSortImg;
        if (imgSrc === down) {
            imgSrc = up;
        } else if (imgSrc === up) {
            imgSrc = down;
        }
        this.setState({
            classRooms: [...this.state.classRooms.sort(this.compareClassroom)],
            classroomSortImg: imgSrc
        });
    }

    compareClassroom(a, b) {
        const classroomA = a.classRoomName;
        const classroomB = b.classRoomName;

        let comparison = 0;
        if (this.state.classroomSortImg === down) {
            if (classroomA > classroomB) {
                comparison = 1;
            } else if (classroomA < classroomB) {
                comparison = -1;
            }
        } else if (this.state.classroomSortImg === up) {
            if (classroomA < classroomB) {
                comparison = 1;
            } else if (classroomA > classroomB) {
                comparison = -1;
            }
        }
        return comparison;
    }

    saveButton() {
        if (!this.state.waitingToSave) {
            return (
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => this.setClassRooms()}>
                    {this.state.buttonType}
                </button>);
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
                <h4 style={{ "textAlign": "right" }}>הגדרת נתונים ושיעורים/ חדרי לימוד</h4>
                <div style={{ "textAlign": "right" }}>
                    <button type="button" className="btn btn-outline-dark ml-2 my-2" onClick={() => this.setShowRoomFeatures()}>{this.state.RoomFeaturesButtonType}</button>
                </div>
                {this.showRoomFeatures()}
                {/* <RoomFeatures
                    roomFeature={this.state.roomFeature}
                    roomFeatures={this.state.roomFeatures}
                    roomFeatureChange={this.HandleRoomFeatureChange}
                    addRoomFeature={this.HandleAddRoomFeature}
                    alertMessage={this.state.alertMessageForFeatures}
                    alertMessageForFeaturesStatus={this.state.alertMessageForFeaturesStatus}
                    onDelete={this.handleDeleteRoomFeature}
                >
                </RoomFeatures> */}
                <div >
                    <div className="input-group mt-3 mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">הגדר חדר לימוד חדש</span>
                        </div>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="חדר לימוד..."
                            value={this.state.classRoomName}
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            onChange={(e) => (this.onClassRoomNameChange(e))}>
                        </input>
                    </div>
                </div>
                <div >
                    <h5 style={{ "textAlign": "right" }}>מאפייני חדר</h5>
                    {/* {this.state.roomFeatures.map((roomFeature, index) => { */}
                    {this.state.featuresFetched ?
                        (
                            <div>
                                {this.state.roomFeaturesChecked.map((roomFeature, index) => {
                                    return (
                                        <RoomFeatureCheckBox
                                            key={index}
                                            roomFeature={roomFeature.roomFeature}
                                            roomFeatureCheck={this.HandleRoomFeatureCheck}
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
                    {/* {this.state.roomFeaturesChecked.map((roomFeature, index) => {
                        return (
                            <RoomFeatureCheckBox
                                key={index}
                                roomFeature={roomFeature.roomFeature}
                                roomFeatureCheck={this.HandleRoomFeatureCheck}
                                // checked={this.getCheckStatus(roomFeature)}>
                                checked={roomFeature.checked}>
                            </RoomFeatureCheckBox>
                        )
                    })} */}
                </div>
                {/* <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => this.setClassRooms()}>
                    {this.state.buttonType}
                </button> */}
                {this.saveButton()}
                {this.alertMessage()}
                {this.state.classRoomsFetched ?
                    (<DataTable
                        classRooms={this.state.classRooms}
                        table="rooms"
                        onEdit={this.getClassRoom}
                        onDelete={this.deleteClassRoom}
                        disableButtons={this.state.disableButtons}
                        sortByClassroom={this.sortByClassroom}
                        classroomSortImg={this.state.classroomSortImg}>
                    </DataTable>) :
                    (<div className="text-center mt-5">
                        <div className="spinner-border" style={{ "width": "3rem", "height": "3rem" }} role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>)
                }
                {/* <DataTable
                    classRooms={this.state.classRooms}
                    table="rooms"
                    onEdit={this.getClassRoom}
                    onDelete={this.deleteClassRoom}
                    disableButtons={this.state.disableButtons}
                    sortByClassroom={this.sortByClassroom}
                    classroomSortImg={this.state.classroomSortImg}>
                </DataTable> */}
            </div>
        )
    }
}

export default ClassRooms;
