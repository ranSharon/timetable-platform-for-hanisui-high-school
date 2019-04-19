import React from 'react';

const weekTableRow = (props) => (
    <tr>
        <td >{props.day}</td>
        <td >{props.startTime}</td>
        <td >{props.hours}</td>
        <td>
            <a href="#">ערוך</a>
            <div style={{display: "inline"}}>  </div>
            <a href="#">מחק</a>
        </td>
    </tr>
);

export default weekTableRow; 