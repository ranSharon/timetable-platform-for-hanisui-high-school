import React, { Component } from 'react';

class Checkbox extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div style={{ textAlign: "right" }}>
                <input type="checkbox" lable={this.props.boxName} value={this.props.boxName} onClick={ this.props.check} />
                <div style={{ display: "inline" }}>  {this.props.boxName}</div>
            </div>
        )
    }
}

export default Checkbox;