import React from 'react';

const weekTableRow = (props) => (
    <tr>
        <td >{props.day}</td>
        <td >{props.startTime}</td>
        <td >{props.hours}</td>
        <td>
            edit
        </td>
    </tr>
);

export default weekTableRow; 