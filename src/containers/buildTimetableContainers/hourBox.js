import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import DragConstraintBox from './dragConstraintBox';

const hourTarget = {
    // canDrop(props, monitor) {
    //     // You can disallow drop based on props or item
    //     const item = monitor.getItem();
    //     backgroundColor = 'green';
    //     // return canMakeChessMove(item.fromPosition, props.position)
    //     // return () => {backgroundColor = 'green'}
    //     // return true;
    // },

    hover(props, monitor, component) {
        // This is fired very often and lets you perform side effects
        // in response to the hover. You can't handle enter and leave
        // here—if you need them, put monitor.isOver() into collect() so you
        // can just use componentDidUpdate() to handle enter/leave.
        //props.updateFather(props.validToAdd,monitor.isOver());
        // You can access the coordinates if you need them
        // const clientOffset = monitor.getClientOffset()
        // const componentRect = findDOMNode(component).getBoundingClientRect()
        //console.log(component);
        // // You can check whether we're over a nested drop target
        // const isJustOverThisOne = monitor.isOver({ shallow: true })

        // // You will receive hover() even for items for which canDrop() is false
        // const canDrop = monitor.canDrop()
        // return props.hover(props.data, props.day);
    },

    drop(props, monitor, component) {
        // if (monitor.didDrop()) {
        //     // If you want, you can check whether some nested
        //     // target already handled drop
        //     return
        // }

        // Obtain the dragged item
        // const item = monitor.getItemType();
        if (!props.validToAdd) {
            console.log('cant be added');
            props.endDrag(false);
            return;
        }

        return props.drop(props.data, props.day, props.row, props.col);
    }
};


function collect(connect, monitor) {
    return {
        // Call this function inside render()
        // to let React DnD handle the drag events:
        connectDropTarget: connect.dropTarget(),
        // You can ask the monitor about the current drag state:
        isOver: monitor.isOver(),
        //isOverCurrent: monitor.isOver({ shallow: true }),
        //canDrop: monitor.canDrop(),
        itemType: monitor.getItemType(),
    }
}

class HourBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            constraints: [],
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.data.constraints.length > this.props.data.constraints) {
            this.setState({ constraints: [...prevProps.data.constraints] });
        }
    }

    handleConstraintClick() {
        console.log('click');
    }

    handleConstraintDrag() {
        console.log('drag');
    }

    showHourData() {
        if (this.props.data.constraints.length > 0 && this.props.show) {
            const towConstraintsInBox = (this.props.data.constraints.length === 2);
            return (
                <div className="w-100 h-100">
                    {this.props.data.constraints.map((constraint, index) => {
                        let border = 'border border-dark';   
                        let canDrag = !(towConstraintsInBox && index === 0);                     
                        if (JSON.stringify(constraint) === JSON.stringify(this.props.currentConstraint)) {
                            border = 'border border-primary';
                        }
                        return (
                            <DragConstraintBox
                                key={index}
                                data={constraint}
                                click={this.props.click}
                                border={border}
                                drag={this.props.drag}
                                endDrag={this.props.endDrag}
                                classRoom={constraint.classRoom}
                                inTable={true}
                                row={this.props.row}
                                col={this.props.col}
                                currentConstraint={this.props.currentConstraint}
                                towConstraintsInBox={towConstraintsInBox}
                                canDrag={canDrag}
                            >
                            </DragConstraintBox>
                        );
                    }
                    )}
                </div>
            );
        } else {
            return null;
        }
    }

    render() {
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
        if (this.props.isOver && this.props.validToAdd) {
            backgroundColor = 'rgb(171, 218, 182)';
        }

        return this.props.connectDropTarget(
            <div
                className={"row text-center  " + border}
                style={{ "height": "50px", "marginRight": "-15px", "marginLeft": "-15px", "backgroundColor": backgroundColor }}
            >
                {this.showHourData()}
            </div>
        );
    }
}

export default DropTarget('constraint', hourTarget, collect)(HourBox);