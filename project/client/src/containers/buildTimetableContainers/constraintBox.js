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
        this.props.click(this.props.data);
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

    showTeachers() {
        let array = [...this.props.data.groupingTeachers];
        let text = ``;
        array.forEach(element => {
            text = `${text} ${element},`;
        });
        return text.substr(0, text.length - 1);
    }

    showGrouping() {
        let text = ``;
        if (this.props.data.subjectGrouping) {
            text = `הקבצות ,`
        }
        return text;
    }

    showClasses() {
        let array = [...this.props.data.classNumber];
        let text = ``;
        array.forEach(element => {
            text = `${text} ${element},`;
        });
        return text.substr(0, text.length - 1);
    }

    render() {
        let height = 50;
        let numOfLesson = parseInt(this.props.data.hours);
        height = height * numOfLesson;
        height = height + 'px';
        const opacity = this.props.isDragging ? 0 : 1;
        let fontSize = "100%";
        if (height === "50px") {
            fontSize = "80%"
        }
        let boxStyle = {
            "cursor": "pointer",
            "width": "162px",
            "height": height,
            "opacity": opacity,
            "fontSize": fontSize
        };

        return (
            <div
                className={"d-inline-block card text-center m-1 " + this.state.border}
                style={boxStyle}
                onClick={() => this.ConstraintBoxClicked()}>
                {this.props.data.subject + ', '}
                {this.showTeachers() + ', '}
                {this.showClasses() + ', '}
                {this.showGrouping()}
            </div>

        );
    }
}

export default ConstraintBox;
// export default DragSource('constraint', constraintSource, collect)(ConstraintBox);
