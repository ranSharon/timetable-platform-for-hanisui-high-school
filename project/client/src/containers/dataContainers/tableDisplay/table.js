import React, { Component } from 'react';
import GradeTableRow from '../../../components/tableRowComponents/gradeTableRow';
import WeekTableRow from '../../../components/tableRowComponents/weekTableRow';
import SubjectTableRow from '../../../components/tableRowComponents/subjectTableRow';
import RoomTableRow from '../../../components/tableRowComponents/roomTableRow';
import SubjectToChoseTableRow from '../../../components/tableRowComponents/subjetToChoseTableRow';
import TeacherTableRow from '../../../components/tableRowComponents/teacherTableRow';
import RoomFeatureTableRow from '../../../components/tableRowComponents/roomFeatureTableRow';
import ConstraintTableRow from '../../../components/tableRowComponents/constraintTableRow';

class DataTable extends Component {

    constraintsRows() {
        let constraints = [];
        for (let i = this.props.constraints.length - 1; i >= 0; i--) {
            constraints = [...constraints,
            <ConstraintTableRow
                key={i}
                constraint={this.props.constraints[i]}
                onDelete={this.props.onDelete}
                onEdit={this.props.onEdit}>
            </ConstraintTableRow>
            ]
        }
        return constraints;
    }

    render() {
        if (this.props.table === 'grades') {
            return (
                <div>
                    <h5 className="mt-3 float-right">שכבות וכיתות שהוגדרו</h5>
                    <table className="table table-striped" style={{ marginTop: 20 }} >
                        <thead>
                            <tr className="text-center">
                                <th >שכבה</th>
                                <th >כיתה 1</th>
                                <th >כיתה 2</th>
                                <th >כיתה 3</th>
                                <th >כיתה 4</th>
                                <th ></th>
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
                    <h5 className="mt-3 float-right">ימי לימוד שהוגדרו</h5>
                    <table className="table table-striped " style={{ marginTop: 20 }} >
                        <thead>
                            <tr className="text-center">
                                <th>יום</th>
                                <th>שעת התחלת היום</th>
                                <th>שעת סיום היום</th>
                                <th></th>
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
                // <div style={{ textAlign: "center" }}>
                <div >
                    <h5 className="mt-3 float-right">מקצועות שהוגדרו</h5>
                    <table className="table table-striped " style={{ marginTop: 20 }} >
                        <thead>
                            <tr className="text-center">
                                <th>מקצוע</th>
                                <th>נלמד בכיתות</th>
                                <th>נלמד לבגרות</th>
                                <th>גמול</th>
                                <th>מערבב שכבה</th>
                                <th>מחולק להקבצות</th>
                                <th>מספר הקבצות</th>
                                <th>המקצוע דורש</th>
                                <th></th>
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
                                    subjectFeatures={subject.subjectFeatures}
                                    onEdit={this.props.onEdit}
                                    onDelete={this.props.onDelete}
                                    id={subject._id}
                                    disableButtons={this.props.disableButtons}>
                                </SubjectTableRow>
                            )}
                        </tbody>
                    </table>
                </div>
            );
        } else if (this.props.table === 'rooms') {
            return (
                <div>
                    <h5 className="mt-3 float-right">חדרי לימוד שהוגדרו</h5>
                    <table className="table table-striped" style={{ marginTop: 20 }} >
                        <thead>
                            <tr className="text-center">
                                <th >חדר לימוד</th>
                                <th >מאפיינים</th>
                                <th ></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.classRooms.map((classRoom, index) =>
                                <RoomTableRow
                                    key={index}
                                    classRoomName={classRoom.classRoomName}
                                    classRoomFeatures={classRoom.classRoomFeatures}
                                    onEdit={this.props.onEdit}
                                    onDelete={this.props.onDelete}
                                    disableButtons={this.props.disableButtons}
                                    id={classRoom._id}>
                                </RoomTableRow>
                            )}
                        </tbody>
                    </table>
                </div>
            );
        } else if (this.props.table === 'roomFeatures') {
            return (
                <div style={{ "position": "relative", "height": "200px", "overflow": "auto", "display": "block" }}>
                    <table className="table table-striped">
                        <thead >
                            <tr className="text-center">
                                <th >מאפיין</th>
                                <th ></th>
                            </tr>
                        </thead>
                        <tbody >
                            {this.props.roomFeatures.map((roomFeature, index) => {
                                return (
                                    <RoomFeatureTableRow
                                        key={index}
                                        FeatureName={roomFeature}
                                        onDelete={this.props.onDelete}
                                    >
                                    </RoomFeatureTableRow>)
                            }
                            )}
                        </tbody>
                    </table>
                </div>
            );

        } else if (this.props.table === 'subjetsTochose') {
            return (
                <div>
                    <table className="table table-striped" style={{ marginTop: 20 }} >
                        <thead>
                            <tr className="text-center">
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
                    <h5 className="mt-3 float-right">מורים שהוגדרו</h5>
                    <table className="table table-striped" style={{ marginTop: 20 }} >
                        <thead>
                            <tr className="text-center">
                                <th >שם המורה</th>
                                <th >מלמד ב...</th>
                                <th >מלמד בכיתות</th>
                                <th >מקצועות שמלמד</th>
                                <th >יום חופש רצוי</th>
                                <th >מספר שעות הוראה שבועיות</th>
                                <th ></th>
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
        } else if (this.props.table === 'constraints') {
            return (
                <div>
                    <h5 className="mt-3 float-right">שיעורים שהוגדרו</h5>
                    <table className="table table-striped" style={{ marginTop: 20 }} >
                        <thead >
                            <tr className="text-center">
                                <th className="border-bottom-0">מספר</th>
                                <th className="border-bottom-0">שעות</th>
                                <th className="border-bottom-0">מורה</th>
                                <th className="border-bottom-0">מקצוע</th>
                                <th className="border-bottom-0">שכבה</th>
                                <th className="border-bottom-0">כיתות</th>
                                <th className="border-bottom-0">חלק משיעור מפוצל</th>
                                <th className="border-bottom-0">הקבצה</th>
                                <th className="border-bottom-0"></th>
                            </tr>
                        </thead>
                        {<tbody >
                            {this.constraintsRows()}
                        </tbody>}
                    </table>
                </div>
            );
        }
    }
};

export default DataTable;