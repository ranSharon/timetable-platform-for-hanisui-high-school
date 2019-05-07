import React from 'react';

const subjectTableRow = (props) => {
    const showGrades = () => {
        let grades = ``;
        props.grades.forEach(element => {
            console.log(element);
            grades = `${grades}${element},` ;
        });
        return grades.substr(0,grades.length-1);
    }

    const yesOrNo = (bool) => {
        if (bool)
            return 'כן';
        else
            return 'לא';
    }
    return (
        <tr>
            <td >{props.subjectName}</td>
            <td >{showGrades()}</td>
            <td >{yesOrNo(props.bagrut)}</td>
            <td >{props.gmol}</td>
            <td >{yesOrNo(props.mix)}</td>
            <td >{yesOrNo(props.grouping)}</td>
            <td >{props.numOfMix}</td>
            <td >{yesOrNo(props.specificRoom)}</td>
            <td >{yesOrNo(props.computerRoom)}</td>
            <td>
                <a href="#">ערוך</a>
                <div style={{ display: "inline" }}>  </div>
                <a href="#">מחק</a>
            </td>
        </tr>
    )
}

export default subjectTableRow;