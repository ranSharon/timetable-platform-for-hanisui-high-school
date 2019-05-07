import React, { Component } from 'react';
import DataTable from '../dataContainers/tableDisplay/table';
import axios from 'axios';

class ClassRooms extends Component {
    state = {
        classRoomName: '',
        specificRoom: false,
        computerRoom: false,
        classRooms: []
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
    }

    onClassRoomNameChange(e) {
        this.setState({ classRoomName: e.target.value });
        console.log(this.state.classRoomName);
    }

    onSpecificRoomCheck() {
        this.setState({ specificRoom: !this.state.specificRoom });
        console.log(this.state.specificRoom);
    }

    onComputerRoomCheck() {
        this.setState({ computerRoom: !this.state.computerRoom });
        console.log(this.state.computerRoom);
    }

    setClassRooms() {
        const newClassRoom = {
            classRoomName: this.state.classRoomName,
            specificRoom: this.state.specificRoom,
            computerRoom: this.state.computerRoom
        };

        axios.post('http://localhost:4000/data/addClassRoom', newClassRoom)
            .then(res => console.log(res.data));


        this.setState({
            classRooms: [...this.state.classRooms, {
                classRoomName: this.state.classRoomName,
                specificRoom: this.state.specificRoom,
                computerRoom: this.state.computerRoom
            }]
        });
        console.log(this.state.classRooms);
    }

    render() {
        return (
            <div>
                <div >
                    <div className="input-group mt-3 mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">הגדר חדר לימוד חדש</span>
                        </div>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="חדר לימוד..."
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            onChange={(e) => (this.onClassRoomNameChange(e))}>
                        </input>
                    </div>
                    <div className="pt-3" style={{ textAlign: "right" }}>
                        <input type="checkbox"  onClick={() => this.onSpecificRoomCheck()}/>
                        <div style={{ display: "inline" }}> {'חדר יעודי'}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <input type="checkbox" onClick={() => this.onComputerRoomCheck()}/>
                        <div style={{ display: "inline" }}> {'חדר עם מחשבים'}</div>
                    </div>
                </div>
                <div >

                </div>

                <div></div>

                <button type="button" className="btn btn-secondary"  onClick={() => this.setClassRooms()}>אישור</button>
                <DataTable classRooms={this.state.classRooms} table="rooms"></DataTable>
            </div>
        )
    }
}

export default ClassRooms;
