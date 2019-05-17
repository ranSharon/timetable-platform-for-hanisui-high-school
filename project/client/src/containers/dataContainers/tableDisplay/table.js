import React, { Component } from 'react';
import GradeTableRow from '../../../components/gradeTableRow';
import WeekTableRow from '../../../components/weekTableRow';
import SubjectTableRow from '../../../components/subjectTableRow';
import RoomTableRow from '../../../components/roomTableRow';
import SubjectToChoseTableRow from '../../../components/subjetToChoseTableRow';
import TeacherTableRow from '../../../components/teacherTableRow';



class DataTable extends Component {
    render() {
        if (this.props.table === 'grades') {
            return (
                <div>
                    <h3 className="mt-3 float-right">שכבות קיימות</h3>
                    <table className="table table-striped" style={{ marginTop: 20 }} >
                        <thead>
                            <tr>
                                <th >שכבה</th>
                                <th >כיתה 1</th>
                                <th >כיתה 2</th>
                                <th >כיתה 3</th>
                                <th >כיתה 4</th>
                                <th >action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.grades.map((grade, index) =>
                                <GradeTableRow
                                    key={index}
                                    grade={grade.grade}
                                    numOfClasses={grade.numOfClasses}
                                    onEdit={this.props.onEdit}
                                    onDelete={this.props.onDelete}
                                    disableButtons={this.props.disableButtons}
                                    id={grade._id}>
                                </GradeTableRow>
                            )}
                        </tbody>
                    </table>
                </div>
            );
        } else if (this.props.table === 'week') {
            return (
                <div>
                    <h3 className="mt-3 float-right">ימי לימוד</h3>
                    <table className="table table-striped " style={{ marginTop: 20 }} >
                        <thead>
                            <tr >
                                <th>יום</th>
                                <th>שעת התחלת היום</th>
                                <th>שעת סיום היום</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.days.map((day, index) =>
                                <WeekTableRow
                                    key={index}
                                    day={day.day}
                                    startTime={day.startTime}
                                    endTime={day.endTime}
                                    onEdit={this.props.onEdit}
                                    onDelete={this.props.onDelete}
                                    disableButtons={this.props.disableButtons}
                                    id={day._id}>
                                </WeekTableRow>
                            )}
                        </tbody>
                    </table>
                </div>
            );
        } else if (this.props.table === 'subjects') {
            return (
                <div style={{ textAlign: "center" }}>
                    <h3 className="mt-3 float-right">מקצועות</h3>
                    <table className="table table-striped " style={{ marginTop: 20 }} >
                        <thead>
                            <tr>
                                <th>מקצוע</th>
                                <th>נלמד בכיתות</th>
                                <th>מקצוע לבגרות</th>
                                <th>גמול</th>
                                <th>מקצוע שמערבב שכבה</th>
                                <th>מקצוע שמחלוק להקבצות</th>
                                <th>מספר הקבצות</th>
                                <th>כיתה יעודית</th>
                                <th>כיתת מחשב</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.subjects.map((subject, index) =>
                                <SubjectTableRow
                                    key={index}
                                    subjectName={subject.subjectName}
                                    grades={subject.grades}
                                    bagrut={subject.bagrut}
                                    gmol={subject.gmol}
                                    mix={subject.mix}
                                    grouping={subject.grouping}
                                    numOfMix={subject.numOfMix}
                                    specificRoom={subject.specificRoom}
                                    computerRoom={subject.computerRoom}>
                                </SubjectTableRow>
                            )}
                        </tbody>
                    </table>
                </div>
            );
        } else if (this.props.table === 'rooms') {
            return (
                <div>
                    <h3 className="mt-3 float-right">חדרי לימוד קיימים</h3>
                    <table className="table table-striped" style={{ marginTop: 20 }} >
                        <thead>
                            <tr>
                                <th >חדר לימוד</th>
                                <th >יעודי</th>
                                <th >מחשב</th>
                                <th >action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.classRooms.map((classRoom, index) =>
                                <RoomTableRow
                                    key={index}
                                    classRoomName={classRoom.classRoomName}
                                    specificRoom={classRoom.specificRoom}
                                    computerRoom={classRoom.computerRoom}>
                                </RoomTableRow>
                            )}
                        </tbody>
                    </table>
                </div>
            );
        } else if (this.props.table === 'subjetsTochose') {
            return (
                <div>
                    {/* <h3 className="mt-3 float-right"></h3> */}
                    <table className="table table-striped" style={{ marginTop: 20 }} >
                        <thead>
                            <tr>
                                <th >מקצוע</th>
                            </tr>
                        </thead>
                        <tbody style={{ 'width': '100%', 'height': '300px', overflowX: 'hidden', overflowY: 'scroll', 'display': 'block', 'textAlign': 'center' }}>
                            {this.props.subjects.map((subject, index) => {
                                return (
                                    <SubjectToChoseTableRow
                                        key={index}
                                        subjectName={subject}
                                        chosenSubjects={this.props.chosenSubjects}
                                        allSubject={this.props.subjects}
                                        onChose={this.props.onChose}
                                        rowNum={index}
                                        numOfRow={this.props.subjects.length}
                                    >
                                    </SubjectToChoseTableRow>)
                            }
                            )}
                        </tbody>
                    </table>
                </div>
            )
        } else if (this.props.table === 'teachers') {
            return (
                <div>
                    {/* <h3 className="mt-3 float-right"></h3> */}
                    <table className="table table-striped" style={{ marginTop: 20 }} >
                        <thead>
                            <tr>
                                <th >שם המורה</th>
                                <th >מלמד ב...</th>
                                <th >מלמד בכיתות</th>
                                <th >מקצועות שמלמד</th>
                                <th >יום חופש רצוי</th>
                                <th >מספר שעות הוראה שבועיות</th>
                                <th >action</th>
                            </tr>
                        </thead>
                        {<tbody >
                            {this.props.teachers.map((teacher, index) => {
                                return (
                                    <TeacherTableRow
                                        key={index}
                                        teacherName={teacher.name}
                                        school={[teacher.juniorHighSchool, teacher.highSchool]}
                                        grades={teacher.grades}
                                        subjects={teacher.subjectsForTeacher}
                                        dayOff={teacher.dayOff}
                                        maxTeachHours={teacher.maxTeachHours}
                                        //onChose={this.props.onChose}
                                        id={teacher._id}
                                        onEdit={this.props.onEdit}
                                        onDelete={this.props.onDelete}
                                        disableButtons={this.props.disableButtons}
                                    >
                                    </TeacherTableRow>)
                            }
                            )}
                        </tbody>}
                    </table>
                </div>
            )
        }
    }
};

export default DataTable;