import React from 'react';

const roomTableRow = (props) => {
    const yesOrNo = (bool) => {
        if (bool)
            return 'כן';
        else
            return 'לא';
    }
    return (
        <tr>
            <td >{props.classRoomName}</td>
            <td >{yesOrNo(props.specificRoom)}</td>
            <td >{yesOrNo(props.computerRoom)}</td>
            <td>
                <a href="#">ערוך</a>
                <div style={{ display: "inline" }}>  </div>
                <a href="#">מחק</a>
            </td>
        </tr>
    )
};

export default roomTableRow; 