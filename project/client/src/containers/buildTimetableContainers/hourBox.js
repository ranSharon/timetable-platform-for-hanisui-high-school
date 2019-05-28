import React, { Component } from 'react';

class HourBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            constraints: []
        }
    }

    hourBoxCliced() {
        this.props.click(this.props.data, this.props.day)
    }

    render() {
        let height = 50;
        let backgroundColor = '#f8d7da';

        let border = 'border-top border-dark';
        if (this.props.data.hour === this.props.endHour) {
            border = 'border-top border-bottom border-dark';
        }

        if (this.props.validToAdd) {
            backgroundColor = '#d4edda';
        }
        if (this.props.currentConstraintEmpty) {
            backgroundColor = 'white';
        }
        
        if (this.props.show && this.props.data.constraints.length > 0) {
            let hours = parseInt(this.props.data.constraints[0].hours);
            // console.log(hours);
            // console.log(height);
            // console.log(hours * height);
            height = hours * height;
        }

        if (!this.props.show) {
            return null;
        }

        return (
            <div
                className={"row text-center " + border}
                style={{ "height": height + "px", "width": "162px", "backgroundColor": backgroundColor }}
                onClick={() => this.hourBoxCliced()}>
                {/* {'[' + this.props.col + ', ' + this.props.row + ']'} */}
                {JSON.stringify(this.props.data.constraints.length) + ' ' + this.props.show}
            </div>
        );
    }
}

export default HourBox;