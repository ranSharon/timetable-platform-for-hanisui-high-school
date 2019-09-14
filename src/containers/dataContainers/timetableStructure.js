import React, { Component } from 'react';
import DataTable from './tableDisplay/table';
import axios from 'axios';
import AlertMessage from '../../components/alertMessage';

let dayToEditId = '';
let dayToEdit = '';


class TimetableStructure extends Component {
    mounted = false;

    constructor(props) {
        super(props);
        this.state = {
            day: '',
            startTime: '',
            endTime: '',

            days: [],
            buttonType: 'אישור',
            alertMessage: '',
            messageStatus: false,
            disableButtons: false,
            waitingToSave: false,
            daysFetched: false
        };
        this.getDay = this.getDay.bind(this);
        this.deleteDay = this.deleteDay.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
        axios.get('http://localhost:4000/data/getDays')
            .then(response => {
                if (this.mounted) {
                    this.setState({ days: [...response.data], daysFetched: true, });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    componentWillUnmount() {
        this.mounted = false;
        clearTimeout(this.timeoutID);
    }

    onChangeDay(e) {
        this.setState({ day: e.target.value });
    }

    onChangeStartTime(e) {
        this.setState({ startTime: e.target.value });
    }

    onChangeEndTime(e) {
        this.setState({ endTime: e.target.value });
    }

    setDays() {
        if (!this.checkIfInputValid()) {
            return;
        }
        if (this.dayIsTaken()) {
            return;
        }
        const newDay = {
            day: this.state.day,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
        };
        if (this.state.buttonType === 'אישור') {
            let day = {};
            this.setState({ waitingToSave: true }, () => {
                axios.post('http://localhost:4000/data/addDay', newDay)
                    .then(res => {
                        if (this.mounted) {
                            day = { ...res.data };
                            this.setState({
                                days: [...this.state.days, day],
                                waitingToSave: false
                            });
                            this.resetInputs();
                        }
                    });
            });

        } else if (this.state.buttonType === 'סיים עריכה') {
            this.setState({ waitingToSave: true }, () => {
                axios.post('http://localhost:4000/data/updateDay/' + dayToEditId, newDay)
                    .then(res => {
                        if (this.mounted) {
                            let days = [...this.state.days];
                            for (let i = 0; i <= days.length - 1; i++) {
                                if (days[i]._id === res.data._id) {
                                    days[i] = { ...res.data };
                                }
                            }
                            this.setState({
                                days: [...days],
                                buttonType: 'אישור',
                                disableButtons: false,
                                waitingToSave: false
                            });
                            this.resetInputs();
                        }
                    });
            });
        }
    }

    checkIfInputValid() {
        clearTimeout(this.timeoutID);
        let day = this.state.day;
        let startTime = this.state.startTime;
        let endTime = this.state.endTime;
        let message = 'ישנה בעיה עם לפחות אחד מן השדות:$';
        let originalMessage = message;
        if (day === '') {
            message += 'לא נבחר יום בשבוע$';
        }
        if (startTime === '') {
            message += 'לא נבחרה שעת התחלת יום$';
        }
        if (endTime === '') {
            message += 'לא נבחרה שעת סיום יום$';
        }

        if (message === originalMessage) {
            return true;
        } else {
            this.setState({ alertMessage: message, messageStatus: false });
            this.alertMessage();
            return false;
        }
    }

    alertMessage() {
        return <AlertMessage
            message={this.state.alertMessage}
            messageStatus={this.state.messageStatus}
        ></AlertMessage>;
    }

    resetInputs() {
        clearTimeout(this.timeoutID);
        let day = '';
        let startTime = '';
        let endTime = '';
        let alertMessage = this.state.alertMessage;
        alertMessage = 'הערך נשמר - אפשר להזין יום חדש';
        this.setState({
            day: day,
            startTime: startTime,
            endTime: endTime,
            alertMessage: alertMessage,
            messageStatus: true
        }, () => {
            this.timeoutID = setTimeout(() => { this.setState({ alertMessage: '' }) }, 1500);
        });
    }

    dayIsTaken() {
        let message = '';
        let days = [...this.state.days];
        let currDay = this.state.day;
        for (let i = 0; i <= days.length - 1; i++) {
            if (currDay === days[i].day && this.state.buttonType === 'אישור') {
                message = 'יום זה כבר הוגדר';
                this.setState({ alertMessage: message, messageStatus: false });
                this.alertMessage();
                return true;
            } else if (currDay === days[i].day && currDay !== dayToEdit && this.state.buttonType === 'סיים עריכה') {
                message = 'יום זה כבר הוגדר';
                this.setState({ alertMessage: message, messageStatus: false });
                this.alertMessage();
                return true;
            }
        }
        return false;
    }

    getDay(dayId) {
        window.scrollTo(0, 0);
        clearTimeout(this.timeoutID);
        dayToEditId = dayId;
        axios.get('http://localhost:4000/data/getDay/' + dayId)
            .then(response => {
                if (this.mounted) {
                    let alertMessage = 'עריכת יום: ' + response.data.day;
                    dayToEdit = response.data.day;
                    this.setState({
                        day: response.data.day,
                        startTime: response.data.startTime,
                        endTime: response.data.endTime,
                        alertMessage: alertMessage,
                        messageStatus: true,
                        buttonType: 'סיים עריכה',
                        disableButtons: true
                    })
                    this.alertMessage();
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    deleteDay(dayId) {
        axios.post('http://localhost:4000/data/deleteDay/' + dayId)
            .then(response => {
                if (this.mounted) {
                    let days = [...this.state.days];
                    for (let i = 0; i <= days.length - 1; i++) {
                        if (days[i]._id === dayId) {
                            days = [...days.slice(0, i).concat(days.slice(i + 1, days.length))];
                            break;
                        }
                    }
                    this.setState({ days: [...days] });
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    saveButton() {
        if (!this.state.waitingToSave) {
            return (
                <button type="button" className="btn btn-secondary" onClick={() => this.setDays()}>{this.state.buttonType}</button>
            );
        }
        return (
            <button className="btn btn-secondary ml-2" type="button" disabled>
                אנא המתן...
                <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>
            </button>
        );
    }

    render() {

        return (
            <div>
                <h4 style={{ "textAlign": "right" }}>הגדרת נתונים ושיעורים/ שלד המערכת</h4>
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
                        <option value="16">16:00</option>
                        <option value="17">17:00</option>
                        <option value="18">18:00</option>
                        <option value="19">19:00</option>
                        <option value="20">20:00</option>
                    </select>
                </div>
                {/* <button type="button" className="btn btn-secondary" onClick={() => this.setDays()}>{this.state.buttonType}</button> */}
                {this.saveButton()}
                {this.alertMessage()}
                {this.state.daysFetched ?
                    (<DataTable
                        days={this.state.days}
                        table="week"
                        onEdit={this.getDay}
                        onDelete={this.deleteDay}
                        disableButtons={this.state.disableButtons}>
                    </DataTable>) :
                    (<div className="text-center mt-5">
                        <div className="spinner-border" style={{ "width": "3rem", "height": "3rem" }} role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>)
                }
                {/* <DataTable
                    isLoading={this.state.daysFetched}
                    days={this.state.days}
                    table="week"
                    onEdit={this.getDay}
                    onDelete={this.deleteDay}
                    disableButtons={this.state.disableButtons}>
                </DataTable> */}
            </div>
        );
    }
}

export default TimetableStructure;
