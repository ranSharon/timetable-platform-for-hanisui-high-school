import React, { Component } from 'react';

class HourBox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let border = 'border-top border-dark';
        if(this.props.startTime === this.props.endTime){
            border = 'border-top border-bottom border-dark';
        }
        return (
            <div
                className={"row text-center "  + border}
                style={{ "height": "50px", "width": "162px" }}>
            </div>
        );
    }
}

export default HourBox;