import React, { Component } from 'react';

class ClassRoomBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            border: ''
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(this.props.currentClassRoom) === JSON.stringify(this.props.data) && this.state.border === '') {
            // border = 'border border-primary';
            this.setState({ border: 'border border-primary' });
        }
        if (JSON.stringify(this.props.currentClassRoom) !== JSON.stringify(this.props.data) && this.state.border === 'border border-primary') {
            this.setState({ border: '' });
        }
    }

    render() {
        return (
            <div
                className={"col card text-right m-1 " + this.state.border}
                style={{ "height": "50px", "cursor": "pointer", "width": "120px" }}
                onClick={() => this.props.click(this.props.data)}>
                {this.props.data.classRoomName}
            </div>
        );
    }
}

export default ClassRoomBox;