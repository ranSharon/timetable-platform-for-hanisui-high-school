import React, { Component } from 'react';

class ClassRoomBox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div
                className="col card text-right m-1" 
                style={{"height": "50px", "cursor": "pointer" ,"width":"120px" }}>
                {this.props.data.classRoomName}
            </div>
        );
    }
}

export default ClassRoomBox;