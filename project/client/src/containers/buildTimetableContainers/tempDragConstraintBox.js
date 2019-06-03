import React, { Component } from 'react';
import { DragSource } from 'react-dnd';

let subject = '';
let teacher = '';
let hours = '';
let classRoom = '';

const constraintSource = {
    endDrag(props, monitor, component) {
        // return props.endDrag();
    },
    beginDrag(props, monitor, component) {
        // if (props.inTable) { // darg function not called when DragConstraintBox not in table
        // props.isDrag(true);
        // props.drag(props.inTable, props.data, props.classRoom, props.row, props.col);
        // }

        // props.drag(monitor.isDragging());
        return { dummy: true };
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

class TempDragConstraintBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            border: 'border border-primary'
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // if (this.props.didDrop && this.state.border === 'border border-primary') {
        //     this.setState({ border: 'border border-dark' });
        //     console.log('didDrop')
        // }
    }

    setStyle() {
        let height = 50;
        // let numOfLesson = parseInt(this.props.data.hours);
        // height = height * numOfLesson;
        height = height + 'px';
        this.setState({
            style: { ...this.state.style, "height": height }
        }, function () {
            return this.state.style;
        });
    }

    // ConstraintBoxClicked() {
    //     this.props.click(this.props.data);
    // }

    render() {
        let height = 50;
        // let numOfLesson = parseInt(this.props.data.hours);
        // height = height * numOfLesson;
        height = height + 'px';
        // const opacity = this.props.isDragging ? 0 : 1;
        // console.log(this.props.isDragging);
        let boxStyle = {
            "cursor": "pointer",
            "width": "162px",
            "height": height,
            // "opacity": opacity
            "opacity": 1
        };
        return this.props.connectDragSource(

            <div
                className={"d-inline-block card text-center  " + "border border-dark"}
                style={boxStyle}
            // style={{opacity}}
            // onClick={() => this.props.click(this.props.inTable, this.props.data, this.props.classRoom)}

            >
                {/* <span>{this.props.data.subject + ' ,'}</span> */}
                {/* <span>{this.props.data.teacher + ' ,'}</span> */}
                {/* <span>{this.props.data.hours}</span> */}
                {/* <div>{this.props.classRoom}</div> */}
            </div>

        );
    }
}

// export default ConstraintBox;
export default DragSource('tempConstraint', constraintSource, collect)(TempDragConstraintBox);
