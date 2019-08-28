import React, { Component } from 'react';
import GradeTableRow from '../../../components/tableRowComponents/gradeTableRow';
import WeekTableRow from '../../../components/tableRowComponents/weekTableRow';
import SubjectTableRow from '../../../components/tableRowComponents/subjectTableRow';
import RoomTableRow from '../../../components/tableRowComponents/roomTableRow';
import SubjectToChooseTableRow from './tableRowContainers/SubjectToChooseTableRow';
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
                                <th
                                    style={{ "cursor": "pointer" }}
                                    onClick={this.props.sortBySubject}>מקצוע
                                    <div style={{ display: "inline" }}>  </div>
                                    <img src={this.props.subjectSortImg} alt="arrow" style={{ "height": "1rem", "width": "1rem" }}></img>
                                </th>
                                <th
                                    style={{ "cursor": "pointer" }}
                                    onClick={this.props.sortByGrade}>נלמד בכיתות
                                    <div style={{ display: "inline" }}>  </div>
                                    <img src={this.props.gradeSortImg} alt="arrow" style={{ "height": "1rem", "width": "1rem" }}></img>
                                </th>
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
                                <th
                                    style={{ "cursor": "pointer" }}
                                    onClick={this.props.sortByClassroom}>חדר לימוד
                                    <div style={{ display: "inline" }}>  </div>
                                    <img src={this.props.classroomSortImg} alt="arrow" style={{ "height": "1rem", "width": "1rem" }}></img>
                                </th>
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

        } else if (this.props.table === 'subjetsToChoose') {
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
                                    <SubjectToChooseTableRow
                                        key={index}
                                        subjectName={subject}
                                        chosenSubjects={this.props.chosenSubjects}
                                        allSubject={this.props.subjects}
                                        onChose={this.props.onChose}
                                        rowNum={index}
                                        numOfRow={this.props.subjects.length}
                                    >
                                    </SubjectToChooseTableRow>)
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
                                <th
                                    style={{ "cursor": "pointer" }}
                                    onClick={this.props.sortByTeacher}>שם המורה
                                    <div style={{ display: "inline" }}>  </div>
                                    <img src={this.props.teacherSortImg} alt="arrow" style={{ "height": "1rem", "width": "1rem" }}></img>
                                </th>
                                <th >מלמד ב...</th>
                                <th style={{ "cursor": "pointer" }}
                                    onClick={this.props.sortByGrade}>מלמד בכיתות
                                    <div style={{ display: "inline" }}>  </div>
                                    <img src={this.props.gradeSortImg} alt="arrow" style={{ "height": "1rem", "width": "1rem" }}></img>
                                </th>
                                <th >מקצועות שמלמד</th>
                                <th >יום חופש רצוי</th>
                                <th >שעות הוראה שבועיות מקסימליות</th>
                                <th >שעות הוראה שבועיות נוכחיות</th>
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
                                        currentTeachHours={teacher.currentTeachHours}
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
                                {/* <th className="border-bottom-0">מספר</th> */}
                                <th className="border-bottom-0">שעות</th>
                                <th
                                    className="border-bottom-0"
                                    style={{ "cursor": "pointer" }}
                                    onClick={this.props.sortByTeacher}>מורה
                                    <div style={{ display: "inline" }}>  </div>
                                    <img src={this.props.teacherSortImg} alt="arrow" style={{ "height": "1rem", "width": "1rem" }}></img>
                                </th>
                                <th
                                    className="border-bottom-0"
                                    style={{ "cursor": "pointer" }}
                                    onClick={this.props.sortBySubject}>מקצוע
                                    <div style={{ display: "inline" }}>  </div>
                                    <img src={this.props.subjectSortImg} alt="arrow" style={{ "height": "1rem", "width": "1rem" }}></img>
                                </th>
                                <th
                                    className="border-bottom-0"
                                    style={{ "cursor": "pointer" }}
                                    onClick={this.props.sortByGrade}>שכבה
                                    <div style={{ display: "inline" }}>  </div>
                                    <img src={this.props.gradeSortImg} alt="arrow" style={{ "height": "1rem", "width": "1rem" }}></img>
                                </th>
                                <th
                                    className="border-bottom-0"
                                    style={{ "cursor": "pointer" }}
                                    onClick={this.props.sortByClass}>כיתות
                                    <div style={{ display: "inline" }}>  </div>
                                    <img src={this.props.classSortImg} alt="arrow" style={{ "height": "1rem", "width": "1rem" }}></img>
                                </th>
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