import React from 'react';

const weekTableRow = (props) => (
    <tr className="text-center">
        <td >{props.day}</td>
        <td >{props.startTime + ':00'}</td>
        <td >{props.endTime + ':00'}</td>
        <td className="text-left">
            <button type="button" className="btn btn-secondary btn-sm mb-1" onClick={() => props.onEdit(props.id)} disabled={props.disableButtons}>ערוך</button>
            <div style={{ display: "inline" }}>  </div>
            <button type="button" className="btn btn-secondary btn-sm mb-1" onClick={() => props.onDelete(props.id)} disabled={props.disableButtons}>מחק</button>
        </td>
    </tr>
);

export default weekTableRow; 