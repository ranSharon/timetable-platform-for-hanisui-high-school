import React, { Component } from 'react';
import DataTable from '../dataContainers/tableDisplay/table';
import axios from 'axios';
import AlertMessage from '../../components/alertMessage';

let dayToEditId = '';

class TimetableStructure extends Component {
    constructor(props) {
        super(props);
        this.state = {
            day: '',
            startTime: '',
            endTime: '',

            days: [],
            buttonType: 'אישור',
            alertMessage: '',
            disableButtons: false
        };
        this.getDay = this.getDay.bind(this);
        this.deleteDay = this.deleteDay.bind(this);
    }


    componentDidMount() {
        axios.get('http://localhost:4000/data/getDays')
            .then(response => {
                this.setState({ days: [...response.data] });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    onChangeDay(e) {
        console.log(e.target.value);
        this.setState({ day: e.target.value });
    }

    onChangeStartTime(e) {
        console.log(e.target.value);
        this.setState({ startTime: e.target.value });
    }

    onChangeEndTime(e) {
        this.setState({ endTime: e.target.value });
    }

    setDays() {
        if (!this.checkIfInputValid()) {
            return;
        }
        if (this.dayIsTaken() && this.state.buttonType === 'אישור') {
            return;
        }
        const newDay = {
            day: this.state.day,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
        };
        if (this.state.buttonType === 'אישור') {
            let day = {};
            axios.post('http://localhost:4000/data/addDay', newDay)
                .then(res => {
                    day = { ...res.data };
                    this.setState({
                        days: [...this.state.days, day]
                    });
                    this.resetInputs();
                });
        } else if (this.state.buttonType === 'ערוך') {
            axios.post('http://localhost:4000/data/updateDay/' + dayToEditId, newDay)
                .then(res => {
                    let days = [...this.state.days];
                    for (let i = 0; i <= days.length - 1; i++) {
                        if (days[i]._id === res.data._id) {
                            days[i] = { ...res.data };
                        }
                    }
                    this.setState({
                        days: [...days],
                        buttonType: 'אישור',
                        disableButtons: false
                    });
                    this.resetInputs();
                });
        }
    }

    checkIfInputValid() {
        let day = this.state.day;
        let startTime = this.state.startTime;
        let endTime = this.state.endTime;
        let message = 'ישנה בעיה עם לפחות אחד מן השדות:,';
        let originalMessage = message;
        if (day === '') {
            message += 'לא נבחר יום בשבוע,';
        }
        if (startTime === '') {
            message += 'לא נבחרה שעת התחלת יום,';
        }
        if (endTime === '') {
            message += 'לא נבחרה שעת סיום יום,';
        }

        if (message === originalMessage) {
            return true;
        } else {
            this.setState({ alertMessage: message });
            this.alertMessage();
            return false;
        }
    }

    alertMessage() {
        let alertMessage = this.state.alertMessage;
        return <AlertMessage message={this.state.alertMessage}></AlertMessage>;
    }

    resetInputs() {
        let day = '';
        let startTime = '';
        let endTime = '';
        let alertMessage = this.state.alertMessage;
        alertMessage = 'הערך נשמר - אפשר להזין יום חדש';
        this.setState({
            day: day,
            startTime: startTime,
            endTime: endTime,
            alertMessage: alertMessage
        });
    }

    dayIsTaken() {
        let message = '';
        let originalMessage = message;
        let days = [...this.state.days];
        let currDay = this.state.day;
        for (let i = 0; i <= days.length - 1; i++) {
            if (currDay === days[i].day) {
                message = 'יום זה כבר הוגדר,';
                this.setState({ alertMessage: message });
                this.alertMessage();
                return true;
            }
        }
        return false;
    }

    getDay(dayId) {
        dayToEditId = dayId;
        axios.get('http://localhost:4000/data/getDay/' + dayId)
            .then(response => {
                let alertMessage = 'עריכת יום: ' + response.data.day;
                this.setState({
                    day: response.data.day,
                    startTime: response.data.startTime,
                    endTime: response.data.endTime,
                    alertMessage: alertMessage,
                    buttonType: 'ערוך',
                    disableButtons: true
                })
                this.alertMessage();
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    deleteDay(dayId) {
        axios.post('http://localhost:4000/data/deleteDay/' + dayId)
            .then(response => {
                let days = [...this.state.days];
                for (let i = 0; i <= days.length - 1; i++) {
                    if (days[i]._id === dayId) {
                        days = [...days.slice(0, i).concat(days.slice(i + 1, days.length))];
                        break;
                    }
                }
                this.setState({ days: [...days] });
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    render() {
        return (
            <div>
                <div className="input-group mt-3 mb-3">
                    <div className="input-group-append">
                        <label className="input-group-text" htmlFor="inputGroupSelect02">בחר יום בשבוע</label>
                    </div>
                    <select className="custom-select" id="inputGroupSelect02" value={this.state.day} onChange={(e) => this.onChangeDay(e)}>
                        <option value="">יום...</option>
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
                    <select className="custom-select" id="inputGroupSelect02" value={this.state.startTime} onChange={(e) => this.onChangeStartTime(e)}>
                        <option value="">שעת התחלה...</option>
                        <option value="7">7:00</option>
                        <option value="8">8:00</option>
                        <option value="9">9:00</option>
                        <option value="10">10:00</option>
                        <option value="11">11:00</option>
                    </select>
                </div>
                <div className="input-group mt-3 mb-3">
                    <div className="input-group-append">
                        <label className="input-group-text" htmlFor="inputGroupSelect02">בחר שעת סיום יום</label>
                    </div>
                    <select className="custom-select" id="inputGroupSelect02" value={this.state.endTime} onChange={(e) => this.onChangeEndTime(e)}>
                        <option value="">שעת סיום...</option>
                        <option value="12">12:00</option>
                        <option value="13">13:00</option>
                        <option value="14">14:00</option>
                        <option value="15">15:00</option>
                        <option value="16">15:00</option>
                        <option value="17">16:00</option>
                        <option value="18">18:00</option>
                        <option value="19">19:00</option>
                        <option value="20">20:00</option>
                    </select>
                </div>
                <button type="button" className="btn btn-secondary" onClick={() => this.setDays()}>{this.state.buttonType}</button>
                {this.alertMessage()}
                <DataTable
                    days={this.state.days}
                    table="week"
                    onEdit={this.getDay}
                    onDelete={this.deleteDay}
                    disableButtons={this.state.disableButtons}>
                </DataTable>
            </div>
        );
    }
}

export default TimetableStructure;