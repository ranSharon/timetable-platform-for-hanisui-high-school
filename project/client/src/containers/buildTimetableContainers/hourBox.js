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
        return props.hover(props.data, props.day);
    },

    drop(props, monitor, component) {
        // if (monitor.didDrop()) {
        //     // If you want, you can check whether some nested
        //     // target already handled drop
        //     return
        // }
        
        // Obtain the dragged item
        const item = monitor.getItem();
        console.log(item);
        if (!props.validToAdd) {
            console.log('cant be added');
            return;
        }

        // console.log(item);
        // You can do something with it
        // ChessActions.movePiece(item.fromPosition, props.position)

        // You can also do nothing and return a drop result,
        // which will be available as monitor.getDropResult()
        // in the drag source's endDrag() method
        // return { moved: true }
        return props.drop(props.data, props.day);
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
            constraints: []
        }
    }

    // componentDidUpdate(prevProps, prevState){
    //     if(this.props.data.constraints.length !== prevState.data.constraints.length){
    //         this.setState({constraints: [...this.props.data.constraints]})
    //     }
    // }

    hourBoxCliced() {
        this.props.click(this.props.data, this.props.day)
    }

    handleConstraintClick() {
        console.log('click');
    }
    handleConstraintDrag() {
        console.log('drag');
        // this.props.drag(true, this.props.data.constraints[0], this.props.data.constraints[0].classRoom);
    }

    removeForHourBox(){

    }


    sohwHourData() {
        if (this.props.data.constraints.length > 0 && this.props.show) {
            // console.log(this.props.data.constraints);
            return (
                <div className="w-100 h-100">
                    <DragConstraintBox
                        data={this.props.data.constraints[0]}
                        currentConstraint={this.props.data.constraints[0]}
                        click={this.handleConstraintClick}
                        // drag={this.handleConstraintDrag}
                        drag={this.props.drag}
                        endDrag={this.props.endDrag}
                        classRoom={this.props.data.constraints[0].classRoom}
                        inTable={true}
                        >
                    </DragConstraintBox>
                </div>
                // <div className="text-center">
                //     <span>{this.props.data.constraints[0].subject + ' ,'}</span>
                //     <span>{this.props.data.constraints[0].teacher + ' ,'}</span>
                //     <span>{this.props.data.constraints[0].classRoom}</span>
                // </div>
            );
        } else {
            return null;
        }
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
        if (this.props.isOver && this.props.validToAdd) {
            backgroundColor = 'rgb(171, 218, 182)';
        }

        // if (this.props.show && this.props.data.constraints.length > 0) {
        //     let hours = parseInt(this.props.data.constraints[0].hours);
        //     height = hours * height;
        // }

        // if (!this.props.show) {
        //     return null;
        // }

        return this.props.connectDropTarget(
            <div
                className={"row text-center " + border}
                style={{ "height": height + "px", "width": "162px", "backgroundColor": backgroundColor }}
                onClick={() => this.hourBoxCliced()}>
                {/* {'[' + this.props.col + ', ' + this.props.row + ']'} */}
                {/* {JSON.stringify(this.props.data.constraints.length)} */}
                {this.sohwHourData()}
            </div>
        );
    }
}

// export default HourBox;
// export default DropTarget('constraint', {}, collect)(HourBox);
export default DropTarget('constraint', hourTarget, collect)(HourBox);