import React, { Component } from 'react';
import { DragSource } from 'react-dnd';

const constraintSource = {
    endDrag(props, monitor, component) {
        // return props.endDrag();
        if (!monitor.didDrop()) {
            console.log('!didDrop')
            console.log('cant be added');
            props.endDrag(false);
            return;
        }
    },
    beginDrag(props, monitor, component) {
        if (props.inTable) { // darg function not called when DragConstraintBox not in table
            // props.isDrag(true);
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
        didDrop: monitor.didDrop()
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
        if (this.state.border === 'border border-dark') {
            this.setState({ border: 'border border-primary' });
        } else if (this.state.border === 'border border-primary') {
            this.setState({ border: 'border border-dark' });
        }
    }

    render() {
        // if (!this.props.temp) {
        // let height = 50;
        let numOfLesson = parseInt(this.props.data.hours);
        // height = height * numOfLesson;
        // height = height + 'px';
        const opacity = this.props.isDragging ? 0 : 1;
        let height = this.props.isDragging ? 50 : 50 * numOfLesson;
        height = height + 'px';
        // console.log(this.props.isDragging);
        // let fontSize = "100%";
        // if (height === "50px") {
        //     fontSize = "80%"
        // }
        let boxStyle = {
            "float": "left",
            "cursor": "pointer",
            "width": "100%",
            "height": height,
            "opacity": opacity,
            "fontSize": '11px',
        };

        let shadow = '';
        if (!this.props.inTable) {
            shadow = 'shadow-lg bg-white rounded';
        }

        return this.props.connectDragSource(
            <div
                className={"m-auto card text-center " + this.props.border + ' ' + shadow}
                style={boxStyle}
                // onClick={() => this.props.click(this.props.inTable, this.props.data, this.props.classRoom)}
                onClick={() => this.handleClick()}
            >
                {this.props.data.subject + ', '}
                {this.showTeachers() + ', '}
                {this.showClasses() + ', '}
                {this.showGrouping()}
                {this.props.classRoom}
            </div>
        );
    }
}

export default DragSource('constraint', constraintSource, collect)(DragConstraintBox);
