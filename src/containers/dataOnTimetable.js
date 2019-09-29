import React, { Component } from 'react';
import axios from 'axios';

class DataOnTimetable extends Component {
    mounted = false;
    host = '';

    constructor(props) {
        super(props)
        this.state = {
            timeTable: [],
            classRooms: [],

            // parms for first query
            classNumber: '',
            teachersForClassNumber: [],

            // parms for second query
            teacher1: '',
            daysAndHoursForTeacher: [],

            // parms for third query
            teacher2: '',
            daysForTeacher: [],
            day1: '',
            freeHoursForDay: [],

            teacher3: '',
            subjectsForTeacher: [],

            day2: '',
            teachersForDay: [],

            timeTableFetched: false

            // day3: '',
            // freeClassRoomsForDay: []

        }
    }

    componentDidMount() {
        this.mounted = true;
        // if (process.env.NODE_ENV !== 'production') {
        //     this.host = 'http://localhost:4000'
        // }
        // axios.get('http://localhost:4000/data/getTimeTable')
        axios.get(this.host+'/data/getTimeTable')
            .then(response => {
                if (this.mounted) {
                    this.setState({ timeTable: [...response.data], timeTableFetched: true }, () => {
                        console.log('timeTable');
                        console.log(this.state.timeTable);
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    componentWillUnmount() {
        this.mounted = false;
        // clearTimeout(this.timeoutID);
    }

    firstQuery() {
        let classNumbers = [];
        let timeTable = [...this.state.timeTable];

        // for (let i = 0; i <= timeTable.length - 1; i++) {
        //     for (let j = 0; j <= timeTable[i].days.length - 1; j++) {
        //         for (let k = 0; k <= timeTable[i].days[j].hours.length - 1; k++) {
        //             for (let l = 0; l <= timeTable[i].days[j].hours[k].constraints.length - 1; l++){
        //                 classRooms = [...classRooms,timeTable[i].days[j].hours[k].constraints[l].classRoom];
        //             }
        //         }
        //     }
        // }
        // console.log(classRooms);
        // classRooms = classRooms.filter((item,index) => classRooms.indexOf(item) === index);
        // console.log(classRooms);

        for (let i = 0; i <= timeTable.length - 1; i++) {
            classNumbers = [...classNumbers, timeTable[i].classNumber];
        }
        // console.log(classNumbers);

        const showTeachersForClassNumber = () => {
            let array = [...this.state.teachersForClassNumber];
            let text = ``;
            array.forEach(element => {
                //console.log(element);
                text = `${text} ${element},`;
            });
            return text.substr(0, text.length - 1);
        }

        return (
            <div className="row w-100 h-100">
                <div className="col-3 mr-2 input-group mt-3 mb-3">
                    <div className="input-group-append">
                        <label className="input-group-text" htmlFor="inputGroupSelect02">כיתה</label>
                    </div>
                    <select className="custom-select" id="inputGroupSelect02" value={this.state.classNumber} onChange={(e) => this.handleClassNumberChange(e)} >
                        <option value="">כיתה...</option>
                        {classNumbers.sort().map((classNumber, index) =>
                            <option
                                key={index}
                                value={classNumber}
                            >
                                {classNumber}
                            </option>
                        )}
                    </select>
                </div>
                {/* <div className="col-7 border border-dark"></div> */}
                <div className="col-8">
                    {showTeachersForClassNumber()}
                </div>
            </div>
        );
    }

    secondQuery() {
        let teachers = [];
        let timeTable = [...this.state.timeTable];

        for (let i = 0; i <= timeTable.length - 1; i++) {
            for (let j = 0; j <= timeTable[i].days.length - 1; j++) {
                for (let k = 0; k <= timeTable[i].days[j].hours.length - 1; k++) {
                    for (let l = 0; l <= timeTable[i].days[j].hours[k].constraints.length - 1; l++) {
                        teachers = [...teachers, timeTable[i].days[j].hours[k].constraints[l].teacher];
                    }
                }
            }
        }
        // console.log(teachers);
        teachers = teachers.filter((item, index) => teachers.indexOf(item) === index);
        // console.log(teachers);



        return (
            <div className="row w-100 h-100">
                <div className="col-3 mr-2 input-group mt-3 mb-3">
                    <div className="input-group-append">
                        <label className="input-group-text" htmlFor="inputGroupSelect02">מורה</label>
                    </div>
                    <select className="custom-select" id="inputGroupSelect02" value={this.state.teacher1} onChange={(e) => this.handleTeacherChangeSecondQuery(e)} >
                        <option value="">מורה...</option>
                        {teachers.sort().map((teacher, index) =>
                            <option
                                key={index}
                                value={teacher}
                            >
                                {teacher}
                            </option>
                        )}
                    </select>
                </div>
                {/* <div className="col-7 border border-dark"></div> */}
                <div className="col-8 text-center">
                    {/* {showDaysAndHoursForTeacher()} */}
                    {this.state.daysAndHoursForTeacher.map((element, index) => {
                        return (
                            <div key={index}>
                                {element}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    thirdQuery() {
        let teachers = [];
        let timeTable = [...this.state.timeTable];

        for (let i = 0; i <= timeTable.length - 1; i++) {
            for (let j = 0; j <= timeTable[i].days.length - 1; j++) {
                for (let k = 0; k <= timeTable[i].days[j].hours.length - 1; k++) {
                    for (let l = 0; l <= timeTable[i].days[j].hours[k].constraints.length - 1; l++) {
                        teachers = [...teachers, timeTable[i].days[j].hours[k].constraints[l].teacher];
                    }
                }
            }
        }
        // console.log(teachers);
        teachers = teachers.filter((item, index) => teachers.indexOf(item) === index);
        // console.log(teachers);

        return (
            <div className="row w-100 h-100">
                <div className="col-3 mr-2 input-group mt-3 mb-3">
                    <div className="input-group-append">
                        <label className="input-group-text" htmlFor="inputGroupSelect02">מורה</label>
                    </div>
                    <select className="custom-select" id="inputGroupSelect02" value={this.state.teacher2} onChange={(e) => this.handleTeacherChangeThirdQuery(e)} >
                        <option value="">מורה...</option>
                        {teachers.sort().map((teacher, index) =>
                            <option
                                key={index}
                                value={teacher}
                            >
                                {teacher}
                            </option>
                        )}
                    </select>
                </div>
                <div className="col-3 mr-2 input-group mt-3 mb-3">
                    <div className="input-group-append">
                        <label className="input-group-text" htmlFor="inputGroupSelect02">יום</label>
                    </div>
                    <select className="custom-select" id="inputGroupSelect02" value={this.state.day1} onChange={(e) => this.handleDayChangeThirdQuery(e)} >
                        <option value="">יום...</option>
                        {this.state.daysForTeacher.map((day, index) =>
                            <option
                                key={index}
                                value={day}
                            >
                                {day}
                            </option>
                        )}
                    </select>
                </div>
                {/* <div className="col-7 border border-dark"></div> */}
                <div className="col-5 text-center">
                    {this.state.freeHoursForDay.map((element, index) => {
                        return (
                            <div key={index}>
                                {element}
                            </div>
                        );
                    })}


                </div>
            </div>
        );
    }

    fourthQuery() {
        let teachers = [];
        let timeTable = [...this.state.timeTable];

        for (let i = 0; i <= timeTable.length - 1; i++) {
            for (let j = 0; j <= timeTable[i].days.length - 1; j++) {
                for (let k = 0; k <= timeTable[i].days[j].hours.length - 1; k++) {
                    for (let l = 0; l <= timeTable[i].days[j].hours[k].constraints.length - 1; l++) {
                        teachers = [...teachers, timeTable[i].days[j].hours[k].constraints[l].teacher];
                    }
                }
            }
        }
        // console.log(teachers);
        teachers = teachers.filter((item, index) => teachers.indexOf(item) === index);
        // console.log(teachers);

        const showSubjectForTeacher = () => {
            let array = [...this.state.subjectsForTeacher];
            let text = ``;
            array.forEach(element => {
                //console.log(element);
                text = `${text} ${element},`;
            });
            return text.substr(0, text.length - 1);
        }

        return (
            <div className="row w-100 h-100">
                <div className="col-3 mr-2 input-group mt-3 mb-3">
                    <div className="input-group-append">
                        <label className="input-group-text" htmlFor="inputGroupSelect02">מורה</label>
                    </div>
                    <select className="custom-select" id="inputGroupSelect02" value={this.state.teacher3} onChange={(e) => this.handleTeacherChangeFourthQuery(e)} >
                        <option value="">מורה...</option>
                        {teachers.sort().map((teacher, index) =>
                            <option
                                key={index}
                                value={teacher}
                            >
                                {teacher}
                            </option>
                        )}
                    </select>
                </div>
                {/* <div className="col-7 border border-dark"></div> */}
                <div className="col-8 text-center">
                    {showSubjectForTeacher()}
                </div>
            </div>
        );
    }

    fifthQuery() {
        let days = [];
        let timeTable = [...this.state.timeTable];

        for (let i = 0; i <= timeTable.length - 1; i++) {
            for (let j = 0; j <= timeTable[i].days.length - 1; j++) {
                days = [...days, timeTable[i].days[j].day];
            }
        }
        // console.log(teachers);
        days = days.filter((item, index) => days.indexOf(item) === index);
        // console.log(teachers);

        const showTeachersForDay = () => {
            let array = [...this.state.teachersForDay];
            let text = ``;
            array.forEach(element => {
                //console.log(element);
                text = `${text} ${element},`;
            });
            return text.substr(0, text.length - 1);
        }

        return (
            <div className="row w-100 h-100">
                <div className="col-3 mr-2 input-group mt-3 mb-3">
                    <div className="input-group-append">
                        <label className="input-group-text" htmlFor="inputGroupSelect02">מורה</label>
                    </div>
                    <select className="custom-select" id="inputGroupSelect02" value={this.state.day2} onChange={(e) => this.handleDayChangeFifthQuery(e)} >
                        <option value="">יום...</option>
                        {days.map((day, index) =>
                            <option
                                key={index}
                                value={day}
                            >
                                {day}
                            </option>
                        )}
                    </select>
                </div>
                {/* <div className="col-7 border border-dark"></div> */}
                <div className="col-8 text-center">
                    {showTeachersForDay()}
                </div>
            </div>
        );
    }

    // sixthQuery() {
    //     let days = [];
    //     let timeTable = [...this.state.timeTable];

    //     for (let i = 0; i <= timeTable.length - 1; i++) {
    //         for (let j = 0; j <= timeTable[i].days.length - 1; j++) {
    //             days = [...days, timeTable[i].days[j].day];
    //         }
    //     }
    //     // console.log(teachers);
    //     days = days.filter((item, index) => days.indexOf(item) === index);
    //     // console.log(teachers);

    //     const showTeachersForDay = () => {
    //         let array = [...this.state.teachersForDay];
    //         let text = ``;
    //         array.forEach(element => {
    //             //console.log(element);
    //             text = `${text} ${element},`;
    //         });
    //         return text.substr(0, text.length - 1);
    //     }

    //     return (
    //         <div className="row w-100 h-100">
    //             <div className="col-3 mr-2 input-group mt-3 mb-3">
    //                 <div className="input-group-append">
    //                     <label className="input-group-text" htmlFor="inputGroupSelect02">מורה</label>
    //                 </div>
    //                 <select className="custom-select" id="inputGroupSelect02" value={this.state.day3} onChange={(e) => this.handleDayChangeSixthQuery(e)} >
    //                     <option value="">יום...</option>
    //                     {days.map((day, index) =>
    //                         <option
    //                             key={index}
    //                             value={day}
    //                         >
    //                             {day}
    //                         </option>
    //                     )}
    //                 </select>
    //             </div>
    //             {/* <div className="col-7 border border-dark"></div> */}
    //             <div className="col-8 text-center">
    //                 {/* {showTeachersForDay()} */}
    //             </div>
    //         </div>
    //     );
    // }

    handleClassNumberChange(e) {
        this.setState({ classNumber: e.target.value });
        if (e.target.value === '') {
            this.setState({ teachersForClassNumber: [] });
            return;
        }
        let classNumber = e.target.value;
        let teachersForClassNumber = [];
        let timeTable = [...this.state.timeTable];
        for (let i = 0; i <= timeTable.length - 1; i++) {
            if (timeTable[i].classNumber === classNumber) {
                for (let j = 0; j <= timeTable[i].days.length - 1; j++) {
                    for (let k = 0; k <= timeTable[i].days[j].hours.length - 1; k++) {
                        for (let l = 0; l <= timeTable[i].days[j].hours[k].constraints.length - 1; l++) {
                            teachersForClassNumber = [...teachersForClassNumber, timeTable[i].days[j].hours[k].constraints[l].teacher];
                        }
                    }
                }
            }
        }

        teachersForClassNumber = teachersForClassNumber.filter((item, index) => teachersForClassNumber.indexOf(item) === index);
        // console.log(teachersForClassNumber);
        this.setState({ teachersForClassNumber: [...teachersForClassNumber] })
    }

    handleTeacherChangeSecondQuery(e) {
        this.setState({ teacher1: e.target.value });
        if (e.target.value === '') {
            this.setState({ daysAndHoursForTeacher: [] });
            return;
        }
        let teacher = e.target.value;
        let daysAndHoursForTeacher = [];
        let timeTable = [...this.state.timeTable];

        for (let i = 0; i <= timeTable.length - 1; i++) {
            for (let j = 0; j <= timeTable[i].days.length - 1; j++) {
                for (let k = 0; k <= timeTable[i].days[j].hours.length - 1; k++) {
                    for (let l = 0; l <= timeTable[i].days[j].hours[k].constraints.length - 1; l++) {
                        if (teacher === timeTable[i].days[j].hours[k].constraints[l].teacher) {
                            daysAndHoursForTeacher = [...daysAndHoursForTeacher, timeTable[i].days[j].day + ' ' + timeTable[i].days[j].hours[k].hour];
                        }
                    }
                }
            }
        }

        daysAndHoursForTeacher = daysAndHoursForTeacher.filter((item, index) => daysAndHoursForTeacher.indexOf(item) === index);
        console.log(daysAndHoursForTeacher);
        let newDaysAndHoursForTeacher = [];
        daysAndHoursForTeacher.forEach(dayAndHour => {
            let day = dayAndHour.split(' ')[0];
            let hour = dayAndHour.split(' ')[1];
            let intHour = parseInt(hour);
            hour = (intHour - 1) + ':00-' + intHour + ':00';
            newDaysAndHoursForTeacher = [...newDaysAndHoursForTeacher, day + ' ' + hour];
        })
        console.log(newDaysAndHoursForTeacher);

        this.setState({ daysAndHoursForTeacher: [...newDaysAndHoursForTeacher] })
    }

    handleTeacherChangeThirdQuery(e) {
        this.setState({ teacher2: e.target.value, day: '' });
        if (e.target.value === '') {
            this.setState({ daysForTeacher: [] });
            return;
        }
        let teacher = e.target.value;
        let daysForTeacher = [];
        let timeTable = [...this.state.timeTable];

        for (let i = 0; i <= timeTable.length - 1; i++) {
            for (let j = 0; j <= timeTable[i].days.length - 1; j++) {
                for (let k = 0; k <= timeTable[i].days[j].hours.length - 1; k++) {
                    for (let l = 0; l <= timeTable[i].days[j].hours[k].constraints.length - 1; l++) {
                        if (teacher === timeTable[i].days[j].hours[k].constraints[l].teacher) {
                            daysForTeacher = [...daysForTeacher, timeTable[i].days[j].day];
                        }
                    }
                }
            }
        }

        daysForTeacher = daysForTeacher.filter((item, index) => daysForTeacher.indexOf(item) === index);

        this.setState({ daysForTeacher: [...daysForTeacher] });
    }

    handleDayChangeThirdQuery(e) {
        this.setState({ day1: e.target.value });
        if (e.target.value === '') {
            this.setState({ freeHoursForDay: [] });
            return;
        }
        let day = e.target.value;
        let teacher = this.state.teacher2;
        let freeHoursForDay = [];
        let dayHours = [];
        let hoursForTeacher = [];

        let timeTable = [...this.state.timeTable];

        for (let i = 0; i <= timeTable.length - 1; i++) {
            for (let j = 0; j <= timeTable[i].days.length - 1; j++) {
                if (timeTable[i].days[j].day === day) {
                    for (let k = 0; k <= timeTable[i].days[j].hours.length - 1; k++) {
                        dayHours = [...dayHours, timeTable[i].days[j].hours[k].hour];
                        for (let l = 0; l <= timeTable[i].days[j].hours[k].constraints.length - 1; l++) {
                            if (teacher === timeTable[i].days[j].hours[k].constraints[l].teacher) {
                                hoursForTeacher = [...hoursForTeacher, timeTable[i].days[j].hours[k].hour];
                            }
                        }
                    }
                }
            }
        }

        dayHours = dayHours.filter((item, index) => dayHours.indexOf(item) === index);
        hoursForTeacher = hoursForTeacher.filter((item, index) => hoursForTeacher.indexOf(item) === index);

        // freeHoursForDay = dayHours.filter(x => hoursForTeacher.includes(x));
        freeHoursForDay = dayHours.filter(x => !hoursForTeacher.includes(x));

        let newFreeHoursForDay = [];
        freeHoursForDay.forEach(freeHour => {
            let intHour = parseInt(freeHour);
            let hour = (intHour - 1) + ':00-' + intHour + ':00';
            newFreeHoursForDay = [...newFreeHoursForDay, hour];
        })

        this.setState({ freeHoursForDay: [...newFreeHoursForDay] })
    }

    handleTeacherChangeFourthQuery(e) {
        this.setState({ teacher3: e.target.value });
        if (e.target.value === '') {
            this.setState({ subjectsForTeacher: [] });
            return;
        }
        let teacher = e.target.value;
        let subjectsForTeacher = [];
        let timeTable = [...this.state.timeTable];

        for (let i = 0; i <= timeTable.length - 1; i++) {
            for (let j = 0; j <= timeTable[i].days.length - 1; j++) {
                for (let k = 0; k <= timeTable[i].days[j].hours.length - 1; k++) {
                    for (let l = 0; l <= timeTable[i].days[j].hours[k].constraints.length - 1; l++) {
                        if (teacher === timeTable[i].days[j].hours[k].constraints[l].teacher) {
                            subjectsForTeacher = [...subjectsForTeacher, timeTable[i].days[j].hours[k].constraints[l].subject];
                        }
                    }
                }
            }
        }

        subjectsForTeacher = subjectsForTeacher.filter((item, index) => subjectsForTeacher.indexOf(item) === index);
        console.log(subjectsForTeacher);


        this.setState({ subjectsForTeacher: [...subjectsForTeacher] })
    }

    handleDayChangeFifthQuery(e) {
        this.setState({ day2: e.target.value });
        if (e.target.value === '') {
            this.setState({ teachersForDay: [] });
            return;
        }
        let day = e.target.value;

        let teachersForDay = [];

        let timeTable = [...this.state.timeTable];

        for (let i = 0; i <= timeTable.length - 1; i++) {
            for (let j = 0; j <= timeTable[i].days.length - 1; j++) {
                if (timeTable[i].days[j].day === day) {
                    for (let k = 0; k <= timeTable[i].days[j].hours.length - 1; k++) {
                        for (let l = 0; l <= timeTable[i].days[j].hours[k].constraints.length - 1; l++) {
                            teachersForDay = [...teachersForDay, timeTable[i].days[j].hours[k].constraints[l].teacher];
                        }
                    }
                }
            }
        }

        teachersForDay = teachersForDay.filter((item, index) => teachersForDay.indexOf(item) === index);

        this.setState({ teachersForDay: [...teachersForDay] })
    }

    // handleDayChangeSixthQuery(e) {
    //     this.setState({ day3: e.target.value });
    //     if (e.target.value === '') {
    //         this.setState({ freeClassRoomsForDay: [] });
    //         return;
    //     }
    //     let day = e.target.value;

    //     let freeClassRoomsForDay = [];

    //     let timeTable = [...this.state.timeTable];

    //     for (let i = 0; i <= timeTable.length - 1; i++) {
    //         for (let j = 0; j <= timeTable[i].days.length - 1; j++) {
    //             if (timeTable[i].days[j].day === day) {
    //                 for (let k = 0; k <= timeTable[i].days[j].hours.length - 1; k++) {
    //                     for (let l = 0; l <= timeTable[i].days[j].hours[k].constraints.length - 1; l++) {
    //                         teachersForDay = [...teachersForDay, timeTable[i].days[j].hours[k].constraints[l].teacher];
    //                     }
    //                 }
    //             }
    //         }
    //     }

    //     teachersForDay = teachersForDay.filter((item, index) => teachersForDay.indexOf(item) === index);

    //     this.setState({ teachersForDay: [...teachersForDay] })
    // }

    render() {
        if (!this.state.timeTableFetched) {
            return (
                <div className="text-center mt-5">
                    <div className="spinner-border" style={{ "width": "3rem", "height": "3rem" }} role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            );
        }
        return <div>
            <h3 className="text-right">מידע על מערכת השעות שנבנתה</h3>

            <div className="w-100 text-right p-0 card mb-3">
                <h6 className="text-center">אילו מורים מלמדים כיתה מסויימת</h6>
                <div className="w-100 h-100">
                    {this.firstQuery()}
                </div>
            </div>
            <div
                className="w-100 text-right p-0 card mb-3">
                <h6 className="text-center">באילו שעות וימים מורה מסוים מלמד</h6>
                <div className="w-100 h-100">
                    {this.secondQuery()}
                </div>
            </div>
            <div className="w-100 text-right p-0 card mb-3">
                <h6 className="text-center">אילו מורים מלמדים ביום מסויים</h6>
                {this.fifthQuery()}
            </div>
            <div className="w-100 text-right p-0 card mb-3">
                <h6 className="text-center">באילו שעות מורה שמלמד ביום מסוים פנוי</h6>
                <div className="w-100 h-100">
                    {this.thirdQuery()}
                </div>
            </div>
            <div className="w-100 text-right p-0 card mb-3">
                <h6 className="text-center">אילו מקצועות מורה מסוים מלמד</h6>
                <div className="w-100 h-100">
                    {this.fourthQuery()}
                </div>
            </div>

            {/* <div
                className="w-100 text-right p-0 card mb-3">
                <h6 className="text-center">איזה כיתות פנויות יש עבור כל יום ובאיזה שעה</h6>
                {this.sixthQuery()}
            </div> */}
        </div>
    }
}

export default DataOnTimetable;
