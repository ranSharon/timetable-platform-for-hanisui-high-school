import React from 'react';

const weekTableRow = (props) => (
    <tr>
        <td >{props.day}</td>
        <td >{props.startTime + ':00'}</td>
        <td >{props.endTime + ':00'}</td>
        <td>
            <button onClick={() => props.onEdit(props.id)} disabled={props.disableButtons}>ערוך</button>
            <div style={{ display: "inline" }}>  </div>
            <button onClick={() => props.onDelete(props.id)} disabled={props.disableButtons}>מחק</button>
        </td>
    </tr>
);

export default weekTableRow; 