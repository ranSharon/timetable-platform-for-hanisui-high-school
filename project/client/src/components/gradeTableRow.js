import React from 'react';

const weekTableRow = (props) => {
    let row = [];
    let numOfClasses = parseInt(props.numOfClasses);
    for (let i = 1; i <= numOfClasses; i++) {
        row = [...row, <td key={i}>{props.grade + i}</td>];
    }

    if (numOfClasses < 4) {
        for (let i = numOfClasses + 1; i <= 4; i++) {
            row = [...row, <td key={i}></td>];
        }
    }

    return (
        <tr>
            <td>{props.grade}</td>
            {row}
            <td>
            <button onClick={() => props.onEdit(props.id)} disabled={props.disableButtons}>ערוך</button>
            <div style={{ display: "inline" }}>  </div>
            <button onClick={() => props.onDelete(props.id)} disabled={props.disableButtons}>מחק</button>
            </td>
        </tr>
    );
};

export default weekTableRow; 