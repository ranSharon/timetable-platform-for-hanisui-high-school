import React, { Component } from 'react';

class ConstraintBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            border: ''
        }
    }

    setStyle() {
        let height = 50;
        let numOfLesson = parseInt(this.props.data.hours);
        height = height * numOfLesson;
        height = height + 'px';
        this.setState({
            style: { ...this.state.style, "height": height }
        }, function () {
            return this.state.style;
        });
    }

    ConstraintBoxClicked() {
        this.props.click(this.props.data)
    }

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(this.props.currentConstraint) === JSON.stringify(this.props.data) && this.state.border === '') {
            // border = 'border border-primary';
            this.setState({ border: 'border border-primary' });
        }
        if (JSON.stringify(this.props.currentConstraint) !== JSON.stringify(this.props.data) && this.state.border === 'border border-primary') {
            this.setState({ border: '' });
        }
    }

    render() {
        let height = 50;
        let numOfLesson = parseInt(this.props.data.hours);
        height = height * numOfLesson;
        height = height + 'px';
        let boxStyle = {
            "cursor": "pointer",
            "width": "162px",
            "height": height
        };
        

        return (
            <div
                className={"d-inline-block card text-center m-1 " + this.state.border}
                style={boxStyle}
                onClick={() => this.ConstraintBoxClicked()}>
                <span>{this.props.data.subject + ' ,'}</span>
                <span>{this.props.data.teacher + ' ,'}</span>
                <span>{this.props.data.hours}</span>
            </div>
        );
    }
}

export default ConstraintBox;