import React from 'react';
import Hours from './hours';
import Teachers from './teachers';
import Subjects from './subjects';
import Grades from './grades';
import Classes from './classes';

const constraint = (props) => {
    return (
        <div className="row mt-3">
            <Hours
                onHoursSelected={props.onHoursSelected}>
            </Hours>
            <Teachers
                teachers={props.teachers}
                onTeacherSelected={props.onTeacherSelected}>
            </Teachers>
            <Subjects
                subjects={props.subjects}
                onSubjectSelected={props.onSubjectSelected}>
            </Subjects>
            <Grades
                grades={props.grades}
                onGradeSelected={props.onGradeSelected}
            >
            </Grades>
            <Classes
                classes={props.classes}
                onClassSelected={props.onClassSelected}
            >
            </Classes>
        </div>
    );
}

export default constraint;