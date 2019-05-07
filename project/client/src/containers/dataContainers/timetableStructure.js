import React, { Component } from 'react';
//import WeekTable from './tableStructure/weekTable';
import DataTable from '../dataContainers/tableDisplay/table';

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
                    <div className="input-group-append">
                        <label className="input-group-text" htmlFor="inputGroupSelect02">בחר יום בשבוע</label>
                    </div>
                    <select className="custom-select" id="inputGroupSelect02" onChange={(e) => this.onChangeDay(e)}>
                        <option >יום...</option>
                        <option value="ראשון">ראשון</option>
                        <option value="שני">שני</option>
                        <option value="שלישי">שלישי</option>
                        <option value="רביעי">רביעי</option>
                        <option value="חמישי">חמישי</option>
                        <option value="שישי">שישי</option>
                    </select>
                </div>
                <div className="input-group mt-3 mb-3">
                    <div className="input-group-append">
                        <label className="input-group-text" htmlFor="inputGroupSelect02">בחר שעת התחלת יום</label>
                    </div>
                    <select className="custom-select" id="inputGroupSelect02" onChange={(e) => this.onChangeStartTime(e)}>
                        <option >שעת התחלה...</option>
                        <option value="7:00">7:00</option>
                        <option value="8:00">8:00</option>
                        <option value="9:00">9:00</option>
                        <option value="10:00">10:00</option>
                        <option value="11:00">11:00</option>
                    </select>
                </div>
                <div className="input-group mt-3 mb-3">
                    <div className="input-group-append">
                        <label className="input-group-text" htmlFor="inputGroupSelect02">בחר שעת סיום יום</label>
                    </div>
                    <select className="custom-select" id="inputGroupSelect02" onChange={(e) => this.onChangeHours(e)}>
                        <option >שעת סיום...</option>
                        <option value="12:00">12:00</option>
                        <option value="12:00">13:00</option>
                        <option value="14:00">14:00</option>
                        <option value="15:00">15:00</option>
                        <option value="16:00">15:00</option>
                        <option value="17:00">16:00</option>
                        <option value="18:00">18:00</option>
                        <option value="19:00">19:00</option>
                        <option value="20:00">20:00</option>
                    </select>
                </div>
                <button type="button" className="btn btn-secondary" onClick={() => this.setDays()}>אישור</button>
                <DataTable days={this.state.days} table="week"></DataTable>
            </div>
        );
    }
}

export default TimetableStructure;
