import React, { Component } from 'react';
import DataTable from '../dataContainers/tableDisplay/table';
import RoomFeatures from '../../components/roomFeatures';
import RoomFeatureCheckBox from '../../components/roomFeatureCheckBox';
import AlertMessage from '../../components/alertMessage';
import axios from 'axios';

let classRoomToEdit = '';
let classRoomToEditId = '';

class ClassRooms extends Component {
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
            disableButtons: false

        }
        this.HandleRoomFeatureChange = this.HandleRoomFeatureChange.bind(this);
        this.HandleAddRoomFeature = this.HandleAddRoomFeature.bind(this);
        this.HandleRoomFeatureCheck = this.HandleRoomFeatureCheck.bind(this);
        this.handleDeleteRoomFeature = this.handleDeleteRoomFeature.bind(this);
        this.getClassRoom = this.getClassRoom.bind(this);
        this.deleteClassRoom = this.deleteClassRoom.bind(this);
    }

    componentDidMount() {
        axios.get('http://localhost:4000/data/getClassRooms')
            .then(response => {
                this.setState({ classRooms: [...response.data] });
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            })
        axios.get('http://localhost:4000/data/getRoomFeatures')
            .then(response => {
                //console.log(response.data);
                let roomFeatures = [];
                for (let i = 0; i <= response.data.length - 1; i++) {
                    roomFeatures.push(response.data[i].roomFeature);
                }
                this.setState({ roomFeatures: [...roomFeatures] }, function () {
                    this.initRoomFeaturesChecked();
                });
                console.log(roomFeatures);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(this.state.roomFeaturesChecked);
    }

    initRoomFeaturesChecked() {
        let roomFeaturesChecked = [];
        let roomFeatures = [...this.state.roomFeatures];
        for (let i = 0; i <= roomFeatures.length - 1; i++) {
            let featuresChecked = { roomFeature: roomFeatures[i], checked: false };
            roomFeaturesChecked = [...roomFeaturesChecked, featuresChecked];
        }
        console.log(roomFeaturesChecked);
        console.log(this.state.roomFeaturesChecked);
        this.setState({ roomFeaturesChecked: [...roomFeaturesChecked] },
            function () {
                console.log(this.state.roomFeaturesChecked);
            });
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
            axios.post('http://localhost:4000/data/addClassRoom', newClassRoom)
                .then(res => {
                    classRoom = { ...res.data };
                    this.setState({
                        classRooms: [...this.state.classRooms, classRoom]
                    });
                    this.resetInputs();
                });
        } else if (this.state.buttonType === 'ערוך') {
            axios.post('http://localhost:4000/data/updateClassRoom/' + classRoomToEditId, newClassRoom)
                .then(res => {
                    let classRooms = [...this.state.classRooms];
                    for (let i = 0; i <= classRooms.length - 1; i++) {
                        if (classRooms[i]._id === res.data._id) {
                            classRooms[i] = { ...res.data };
                        }
                    }
                    this.setState({
                        classRooms: [...classRooms],
                        buttonType: 'אישור',
                        disableButtons: false
                    });
                    this.resetInputs();
                });
        }
    }

    checkIfInputValid() {
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
            } else if (currClassRoomName === classRooms[i].classRoomName && currClassRoomName !== classRoomToEdit && this.state.buttonType === 'ערוך') {
                message = 'הוזנה כבר כיתה כזאת';
                this.setState({ alertMessage: message, messageStatus: false });
                this.alertMessage();
                return true;
            }
        }
        return false;
    }

    resetInputs() {
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
        });
    }

    HandleRoomFeatureChange(roomFeature) {
        this.setState({ roomFeature: roomFeature });
    }

    HandleAddRoomFeature() {
        let roomFeatures = [...this.state.roomFeatures];
        if (this.checkIfFeatureTaken()) {
            this.setState({
                alertMessageForFeatures: 'מאפיין זה כבר הוגדר,',
                alertMessageForFeaturesStatus: false
            })
        }
        else if (this.state.roomFeature === '') {
            this.setState({
                alertMessageForFeatures: 'לא הוזן מאפיין בשדה הגרת המאפיין',
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
                    this.setState({
                        roomFeatures: [...roomFeatures, this.state.roomFeature],
                        alertMessageForFeatures: 'המאפיין הוגדר',
                        alertMessageForFeaturesStatus: true,
                        roomFeature: '',
                        roomFeaturesChecked: [...roomFeaturesChecked]
                    });
                    this.resetInputs();
                    this.setState({ alertMessage: '' });
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
                let roomFeatures = [...this.state.roomFeatures];
                for (let i = 0; i <= roomFeatures.length - 1; i++) {
                    if (roomFeatures[i] === response.data.roomFeature) {
                        roomFeatures = [...roomFeatures.slice(0, i).concat(roomFeatures.slice(i + 1, roomFeatures.length))];
                        break;
                    }
                }
                this.resetInputs();
                this.setState({
                    roomFeatures: [...roomFeatures],
                    alertMessage: '',
                    alertMessageForFeatures: ''
                });

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

    // HandleRoomFeatureCheck(state, roomFeature) {
    //     console.log(roomFeature);
        // this.setState({
        //     classRoomFeatures: [...classRoomFeatures, roomFeature],
        // })
        // if (state === true) {
        //     let classRoomFeatures = [...this.state.classRoomFeatures];
        //     let i = this.checkIfRoomFeatureUnCheckd(roomFeature);
        //     if (i !== -1) {
        //         classRoomFeatures = [...classRoomFeatures.slice(0, i).concat(classRoomFeatures.slice(i + 1, classRoomFeatures.length))];
        //         this.setRoomFeaturesChecked(roomFeature, state);
        //         this.setState({
        //             classRoomFeatures: [...classRoomFeatures]
        //         })
        //     } else {
        //         this.setRoomFeaturesChecked(roomFeature, state);
        //         this.setState({
        //             classRoomFeatures: [...classRoomFeatures, roomFeature],
        //         })
        //     }
            // let classRoomFeatures = [...this.state.classRoomFeatures];
            // let i = this.checkIfRoomFeatureUnCheckd(roomFeature);
            // if (i !== -1) {
            //     classRoomFeatures = [...classRoomFeatures.slice(0, i).concat(classRoomFeatures.slice(i + 1, classRoomFeatures.length))];
            //     this.setRoomFeaturesChecked(roomFeature, false);
            //     this.setState({
            //         classRoomFeatures: [...classRoomFeatures]
            //     })
            // } else {
            //     this.setRoomFeaturesChecked(roomFeature, true);
            //     this.setState({
            //         classRoomFeatures: [...classRoomFeatures, roomFeature],
            //     })
            // }
    //     }
    // }

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
        console.log(classRoomFeatures);
        console.log(this.state.roomFeatures);
        let roomFeaturesChecked = [...this.state.roomFeaturesChecked];
        for (let i = 0; i <= classRoomFeatures.length - 1; i++) {
            for (let j = 0; j <= roomFeaturesChecked.length - 1; j++) {
                if (classRoomFeatures[i] === roomFeaturesChecked[j].roomFeature) {
                    roomFeaturesChecked[j].checked = true;
                }
            }
        }
        this.setState({ roomFeaturesChecked: [...roomFeaturesChecked] }, function () {
            console.log(this.state.roomFeaturesChecked);
        }

        );
    }

    getClassRoom(classRoomId) {
        classRoomToEditId = classRoomId;
        axios.get('http://localhost:4000/data/getClassRoom/' + classRoomId)
            .then(response => {
                let alertMessage = 'עריכת כיתה: ' + response.data.classRoomName;
                classRoomToEdit = response.data.classRoomName;
                this.setCheckStatus(response.data.classRoomFeatures);
                let classRoomFeatures = [...this.setClassRoomFeaturesForEdit(response.data.classRoomFeatures)];
                this.setState({
                    classRoomName: response.data.classRoomName,
                    classRoomFeatures: [...classRoomFeatures],
                    alertMessage: alertMessage,
                    messageStatus: true,
                    buttonType: 'ערוך',
                    disableButtons: true
                })
                this.alertMessage();
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    deleteClassRoom(classRoomId) {
        axios.post('http://localhost:4000/data/deleteClassRoom/' + classRoomId)
            .then(response => {
                let classRooms = [...this.state.classRooms];
                for (let i = 0; i <= classRooms.length - 1; i++) {
                    if (classRooms[i]._id === classRoomId) {
                        classRooms = [...classRooms.slice(0, i).concat(classRooms.slice(i + 1, classRooms.length))];
                        break;
                    }
                }
                this.setState({ classRooms: [...classRooms] });
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

    render() {
        return (
            <div>
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
                    {this.state.roomFeatures.map((roomFeature, index) => {
                        return (
                            <RoomFeatureCheckBox
                                key={index}
                                roomFeature={roomFeature}
                                roomFeatureCheck={this.HandleRoomFeatureCheck}
                                check={this.getCheckStatus(roomFeature)}>
                            </RoomFeatureCheckBox>
                        )
                    })}
                </div>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => this.setClassRooms()}>
                    {this.state.buttonType}
                </button>
                {this.alertMessage()}
                <DataTable
                    classRooms={this.state.classRooms}
                    table="rooms"
                    onEdit={this.getClassRoom}
                    onDelete={this.deleteClassRoom}
                    disableButtons={this.state.disableButtons}>
                </DataTable>
            </div>
        )
    }
}

export default ClassRooms;
