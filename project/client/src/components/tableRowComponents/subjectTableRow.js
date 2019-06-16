import React from 'react';

const subjectTableRow = (props) => {
    const showGrades = () => {
        let grades = ``;
        props.grades.forEach(element => {
            grades = `${grades}${element},`;
        });
        return grades.substr(0, grades.length - 1);
    }
    const showFeatures = () => {
        let features = ``;
        props.subjectFeatures.forEach(element => {
            features = `${features}${element},`;
        });
        return features.substr(0, features.length - 1);
    }

    const yesOrNo = (bool) => {
        if (bool)
            return 'כן';
        else
            return 'לא';
    }
    return (
        <tr className="text-center">
            <td >{props.subjectName}</td>
            <td >{showGrades()}</td>
            <td >{yesOrNo(props.bagrut)}</td>
            <td >{props.gmol}</td>
            <td >{yesOrNo(props.mix)}</td>
            <td >{yesOrNo(props.grouping)}</td>
            <td >{props.numOfMix}</td>
            <td >{showFeatures()}</td>
            <td className="text-left">
                <button onClick={() => props.onEdit(props.id)} disabled={props.disableButtons}>ערוך</button>
                <div style={{ display: "inline" }}>  </div>
                <button onClick={() => props.onDelete(props.id)} disabled={props.disableButtons}>מחק</button>
            </td>
        </tr>
    )
}

export default subjectTableRow;