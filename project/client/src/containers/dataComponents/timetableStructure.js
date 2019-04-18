import React, { Component } from 'react';
import WeekTable from '../dataContainers/tableStructure/weekTable';

class TimetableStructure extends Component {
    state = {
        day: '',
        startTime: 0,
        hours: 0,
        days: []
    };

    onChangeDay(e) {
        console.log(e.target.value);
        this.setState({ day: e.target.value });
    }

    onChangeStartTime(e) {
        console.log(e.target.value);
        this.setState({ startTime: e.target.value });
    }

    onChangeHours(e) {
        console.log(e.target.value);
        this.setState({ hours: e.target.value });
    }

    setDays() {
        console.log(this.state.day);
        console.log(this.state.startTime);
        console.log(this.state.hours);
        console.log(this.state.days);
        this.setState({ days: [...this.state.days, { day: this.state.day, startTime: this.state.startTime, hours: this.state.hours }] });
    }

    render() {
        return (
            <div>
                <div className="input-group mt-3 mb-3">
                    <select className="custom-select" id="inputGroupSelect02" onChange={(e) => this.onChangeDay(e)}>
                        <option >...יום</option>
                        <option value="sunday">ראשון</option>
                        <option value="monday">שני</option>
                        <option value="tuesday">שלישי</option>
                        <option value="tuesday">רביעי</option>
                        <option value="tuesday">חמישי</option>
                        <option value="tuesday">שישי</option>
                    </select>
                    <div className="input-group-append">
                        <label className="input-group-text" htmlFor="inputGroupSelect02">בחר יום בשבוע</label>
                    </div>
                </div>
                <div className="input-group mt-3 mb-3">
                    <select className="custom-select" id="inputGroupSelect02" onChange={(e) => this.onChangeStartTime(e)}>
                        <option >...שעת התחלה</option>
                        <option value="7:00">7:00</option>
                        <option value="8:00m">8:00</option>
                        <option value="9:00">9:00</option>
                        <option value="10:00">10:00</option>
                        <option value="11:00">11:00</option>
                        <option value="12:00">12:00</option>
                    </select>
                    <div className="input-group-append">
                        <label className="input-group-text" htmlFor="inputGroupSelect02">בחר שעת התחלת יום</label>
                    </div>
                </div>
                <div className="input-group mt-3 mb-3">
                    <select className="custom-select" id="inputGroupSelect02" onChange={(e) => this.onChangeHours(e)}>
                        <option >...מספר שעות</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                    <div className="input-group-append">
                        <label className="input-group-text" htmlFor="inputGroupSelect02">בחר מספר שעות לימוד לאותו יום</label>
                    </div>
                </div>
                <button type="button" className="btn btn-secondary" onClick={() => this.setDays()}>אישור</button>
                <WeekTable days={this.state.days}></WeekTable>
            </div>
        );
    }
}

export default TimetableStructure;
