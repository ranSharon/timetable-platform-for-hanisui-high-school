import React from 'react';
import Hours from './hours';
import Teachers from './teachers';
import Subjects from './subjects';
import Grades from './grades';
import Classes from './classes';

const constraint = (props) => {
    if (props.copyConstraint) {
        const showClassesNumber = () => {
            let array = [...props.classNumber];
            let text = ``;
            array.forEach(element => {
                //console.log(element);
                text = `${text} ${element},`;
            });
            return text.substr(0, text.length - 1);
        }
        return (
            <div className="row mt-0" style={{ "textAlign": "center" }}>
                <div className="col-2 border border-dark p-0">
                    <div className="border border-dark ">שעות לימוד</div>
                    <div>{props.hours}</div>
                </div>
                {/* <div className="col-3 border border-dark p-0">
                    <div className="border border-dark ">מורה</div>
                    <div>{props.teacher}</div>
                </div> */}
                <Teachers
                    teacher={props.teacher}
                    teachers={props.teachers}
                    onTeacherSelected={props.onTeacherSelected}
                    groupNum={props.groupNum}>
                </Teachers>
                <div className="col-3 border border-dark p-0">
                    <div className="border border-dark ">מקצוע</div>
                    <div>{props.subject}</div>
                </div>
                <div className="col-2 border border-dark p-0">
                    <div className="border border-dark ">שכבה</div>
                    <div>{props.grade}</div>
                </div>
                <div className="col-2 border border-dark p-0">
                    <div className="border border-dark ">כיתה</div>
                    <div>{showClassesNumber()}</div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="row mt-0" style={{ "textAlign": "center" }}>
                <Hours
                    hours={props.hours}
                    onHoursSelected={props.onHoursSelected}>
                </Hours>
                <Teachers
                    teacher={props.teacher}
                    teachers={props.teachers}
                    onTeacherSelected={props.onTeacherSelected}
                    groupNum={props.groupNum}>
                </Teachers>
                <Subjects
                    subject={props.subject}
                    subjects={props.subjects}
                    onSubjectSelected={props.onSubjectSelected}>
                </Subjects>
                <Grades
                    grade={props.grade}
                    grades={props.grades}
                    onGradeSelected={props.onGradeSelected}
                >
                </Grades>
                <Classes
                    classNumber={props.classNumber}
                    classes={props.classes}
                    onClassSelected={props.onClassSelected}
                >
                </Classes>
            </div>
        );
    }
}

export default constraint;