import React, { Component } from 'react';

class Teachers extends Component {
    render() {
        return (
            <div>
                <div className="input-group mt-3 mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">הגדר מורה חדש</span>
                    </div>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="מורה..."
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                    >
                    </input>
                </div>
                <div className="w-50" style={{ float: "right" }}>
                    <h5 style={{ textAlign: "right" }}>{'פרטים'}</h5>
                    <div style={{ textAlign: "right" }}>
                        <input type="checkbox" value="חטיבה" />
                        <div style={{ display: "inline" }}> {'חטיבה'}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <input type="checkbox" value="תיכון" />
                        <div style={{ display: "inline" }}> {'תיכון'}</div>
                    </div>
                    <div className="input-group mt-3 mb-3 pl-5">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">מספר שעות הוראה מקסימלי</span>
                        </div>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="שעות הוראה..."
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                        >
                        </input>
                    </div>
                    <div className="input-group mt-3 mb-3 pl-5">
                        <div className="input-group-append">
                            <label className="input-group-text" htmlFor="inputGroupSelect02">יום חופש רצוי</label>
                        </div>
                        <select className="custom-select" id="inputGroupSelect02" >
                            <option >יום...</option>
                            <option value="ראשון">ראשון</option>
                            <option value="שני">שני</option>
                            <option value="שלישי">שלישי</option>
                            <option value="רביעי">רביעי</option>
                            <option value="חמישי">חמישי</option>
                            <option value="שישי">שישי</option>
                        </select>
                    </div>

                </div>
                <div className="w-50" style={{ float: "right" }}>
                    <h5 style={{ textAlign: "right" }}>{'מלמד בכיתות'}</h5>
                    <div style={{ textAlign: "right" }}>
                        <input type="checkbox" lable="ז" value="ז" />
                        <div style={{ display: "inline" }}> {'ז'}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <input type="checkbox" lable="ח" value="ח" />
                        <div style={{ display: "inline" }}> {'ח'}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <input type="checkbox" lable="ט" value="ט" />
                        <div style={{ display: "inline" }}> {'ט'}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <input type="checkbox" lable="י" value="י" />
                        <div style={{ display: "inline" }}> {'י'}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <input type="checkbox" lable="יא" value="יא" />
                        <div style={{ display: "inline" }}> {'יא'}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <input type="checkbox" lable="יב" value="יב" />
                        <div style={{ display: "inline" }}> {'יב'}</div>
                    </div>
                </div>
                <div className="w-50" style={{ float: "right" }}>
                    
                </div>
                <div></div>

                <button type="button" className="btn btn-secondary"  >אישור</button>
                {/* <DataTable subjects={this.state.subjects} table="subjects"></DataTable> */}
            </div>
        )
    }
}

export default Teachers;
