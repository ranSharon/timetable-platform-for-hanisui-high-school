import React, { Component } from 'react';
import DataTable from '../../containers/dataContainers/tableDisplay/table';
import AlertMessage from '../alertMessage';

class RoomFeatures extends Component {
    state = {
        roomFeature: ''
    }

    onRoomFeatureChange(e) {
        this.props.roomFeatureChange(e.target.value);
    }

    render() {
        return (
            <div className="card">
                <h5 className="mt-3" style={{ "textAlign": "center" }}>לפני הגדרת חדרי לימוד ומקצועות יש להגדיר מאפייני חדרי לימוד כלליים (מאפיין לדוגמא: חדר לימוד המצריך מקרן)</h5>
                <div className="card-body">
                    <div className="row">
                        <div className="col-6">
                            <div className="input-group mt-3 mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1">הגדר מאפיין חדש</span>
                                </div>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="מאפיין..."
                                    value={this.props.roomFeature}
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    onChange={(e) => (this.onRoomFeatureChange(e))}>
                                </input>
                            </div>
                            <button type="button" className="btn btn-secondary" onClick={() => this.props.addRoomFeature()}>הוסף מאפיין</button>
                        </div>
                        <div className="col-6">
                            <DataTable
                                table="roomFeatures"
                                roomFeatures={this.props.roomFeatures}
                                onDelete={this.props.onDelete}
                            >
                            </DataTable>
                        </div>
                    </div>
                </div>
                <AlertMessage
                    message={this.props.alertMessage}
                    messageStatus={this.props.alertMessageForFeaturesStatus}>
                </AlertMessage>
            </div>
        );
    }
}

export default RoomFeatures; 