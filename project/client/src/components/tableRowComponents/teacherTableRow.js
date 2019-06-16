import React from 'react';

const teacherTableRow = (props) => {

    const showGrades = (arrayType) => {
        let array = [];
        if (arrayType === 'subjects') {
            array = [...props.subjects];
        } else if (arrayType === 'grades') {
            array = [...props.grades];
        }
        let text = ``;
        array.forEach(element => {
            text = `${text} ${element},`;
        });
        return text.substr(0, text.length - 1);
    }

    const schoolsType = (school) => {
        let schoolType = '';
        if (school[0] === true && school[1] === true) {
            schoolType += 'חטיבה, תיכון'
        } else if (school[0] === true && school[1] === false) {
            schoolType += 'חטיבה'
        }
        else if (school[0] === false && school[1] === true) {
            schoolType += 'תיכון'
        }
        return schoolType;
    }
    return (
        <tr className="text-center">
            <td >{props.teacherName}</td>
            <td >{schoolsType(props.school)}</td>
            <td >{showGrades('grades')}</td>
            <td >{showGrades('subjects')}</td>
            <td >{props.dayOff}</td>
            <td >{props.maxTeachHours}</td>
            <td className="text-left">
                <button onClick={() => props.onEdit(props.id)} disabled={props.disableButtons}>ערוך</button>
                <div style={{ display: "inline" }}>  </div>
                <button onClick={() => props.onDelete(props.id)} disabled={props.disableButtons}>מחק</button>
            </td>
        </tr>
    )
}

export default teacherTableRow;