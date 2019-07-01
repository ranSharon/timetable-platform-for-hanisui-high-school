import React, { Component } from 'react';

class roomFeatureCheckBox extends Component {

    featureCheck(e) {
        this.props.roomFeatureCheck(e.target.value);
    }

    render() {
        return (
            <div className="pt-2" style={{ textAlign: "right" }}>
                <input
                    type="checkbox"
                    // value={this.props.checked}
                    // onChange={(e) => this.featureCheck(e)}
                    onChange={() => this.props.roomFeatureCheck(this.props.roomFeature)}
                    checked={this.props.checked}
                />
                <div style={{ display: "inline" }}>{this.props.roomFeature}</div>
            </div>
        );
    }
}

export default roomFeatureCheckBox; 