import React, { Component } from 'react';

class ConstraintBox extends Component {
    constructor(props) {
        super(props);
    }

    setStyle() {
        let height = 50;
        let numOfLesson = parseInt(this.props.data.hours);
        height = height * numOfLesson;
        height = height + 'px';
        this.setState({
            style: {...this.state.style, "height":height}
        }, function(){
            return this.state.style;
        });
    }

    render() {
        let height = 50;
        let numOfLesson = parseInt(this.props.data.hours);
        height = height * numOfLesson;
        height = height + 'px';
        let boxStyle = {
            "cursor": "pointer", 
            "width": "162px" , 
            "height":height
        };
        return (
            <div className="d-inline-block card text-center m-1" style={boxStyle}>
                <span>{this.props.data.subject+' ,'}</span>
                <span>{this.props.data.teacher+' ,'}</span>
                <span>{this.props.data.hours}</span>
            </div>
        );
    }
}

export default ConstraintBox;