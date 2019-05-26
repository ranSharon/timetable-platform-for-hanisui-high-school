import React, { Component } from 'react';

class roomFeatureCheckBox extends Component {

    featureCheck(e) {
        console.log(e.target.value);
        // this.props.roomFeatureCheck(e.target.value, this.props.roomFeature);
        this.props.roomFeatureCheck(e.target.value);
    }

    render() {
        return (
            <div className="pt-2" style={{ textAlign: "right" }}>
                <input
                    type="checkbox"
                    //value={this.props.check}
                    value={this.props.roomFeature}
                    onChange={(e) => this.featureCheck(e)}
                    // onChange={() => this.roomFeatureCheck(this.props.roomFeature)}
                    checked={this.props.check}
                />
                <div style={{ display: "inline" }}>{this.props.roomFeature}</div>
            </div>
        );
    }
}

export default roomFeatureCheckBox; 