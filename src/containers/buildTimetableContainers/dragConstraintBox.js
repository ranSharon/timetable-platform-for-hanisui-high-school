import React, { Component } from 'react';
import { DragSource } from 'react-dnd';

const constraintSource = {
    // canDrag(props, monitor) {
    //     return props.canDrag;
    // },
    endDrag(props, monitor, component) {
        if (!monitor.didDrop()) {
            console.log('!didDrop')
            console.log('cant be added');
            props.endDrag(false);
            return;
        }
    },
    beginDrag(props, monitor, component) {
        if (props.inTable) { // darg function not called when DragConstraintBox not in table
            props.drag(props.inTable, props.data, props.classRoom, props.row, props.col);
        }

        // props.drag(monitor.isDragging());
        return props.data;
    }
}

function collect(connect, monitor) {
    return {
        // Call this function inside render()
        // to let React DnD handle the drag events:
        connectDragSource: connect.dragSource(),
        // You can ask the monitor about the current drag state:
        isDragging: monitor.isDragging(),
        didDrop: monitor.didDrop(),
    }
}

class DragConstraintBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            border: 'border border-dark'
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.didDrop && this.state.border === 'border border-primary') {
            this.setState({ border: 'border border-dark' });
            console.log('didDrop')
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

    handleClick() {
        this.props.click(this.props.inTable, this.props.data, this.props.classRoom)
    }

    objectEmpty(obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    render() {
        let numOfLesson = parseInt(this.props.data.hours);
        const opacity = this.props.isDragging ? 0 : 1;
        let height = this.props.isDragging ? 50 : 50 * numOfLesson;
        let width = '100%';
        let fontSize = numOfLesson > 1 ? '12px' : '10px';

        if (this.props.towConstraintsInBox) {
            width = '50%';
        } else if (
            !this.objectEmpty(this.props.currentConstraint)
            && this.props.inTable
            && JSON.stringify(this.props.data) !== JSON.stringify(this.props.currentConstraint)
        ) {
            if (this.props.currentConstraint.subjectMix
                && !this.props.currentConstraint.subjectGrouping
                && this.props.data.subjectMix
                && !this.props.data.subjectGrouping
                && this.props.currentConstraint.hours === this.props.data.hours) {
                width = '50%'
            }
        }

        height = height + 'px';
        let boxStyle = {
            "float": "left",
            "cursor": "pointer",
            "width": width,
            "height": height,
            "opacity": opacity,
            "fontSize": fontSize,
        };

        let shadow = '';
        if (!this.props.inTable) {
            shadow = 'shadow-lg bg-white rounded';
        }

        return this.props.connectDragSource(
            <div
                className={"card " + this.props.border + ' ' + shadow}
                style={boxStyle}
                onClick={() => this.handleClick()}
            // data-toggle="tooltip" 
            // title="Disabled tooltip"
            >
                <p className="m-auto card-text">
                    <span className="font-weight-bold">{this.props.data.subject + ', '}</span>
                    <span className="font-italic">{this.showTeachers()}</span>
                    <br/>
                    {this.showClasses() + ', '}
                    {this.showGrouping()}
                    {this.props.classRoom}
                </p>
            </div>
        );
    }
}

export default DragSource('constraint', constraintSource, collect)(DragConstraintBox);
