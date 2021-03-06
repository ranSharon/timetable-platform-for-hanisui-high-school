import React from 'react';

const roomTableRow = (props) => {
    const showClassRoomFeatures = () => {
        let array = [...props.classRoomFeatures];
        let text = ``;
        array.forEach(element => {
            text = `${text} ${element},`;
        });
        return text.substr(0, text.length - 1);
    }

    return (
        <tr className="text-center">
            <td >{props.classRoomName}</td>
            <td >{showClassRoomFeatures()}</td>
            <td className="text-left">
                <button type="button" className="btn btn-secondary btn-sm mb-1" onClick={() => props.onEdit(props.id)} disabled={props.disableButtons}>ערוך</button>
                <div style={{ display: "inline" }}>  </div>
                <button type="button" className="btn btn-secondary btn-sm mb-1" onClick={() => props.onDelete(props.id)} disabled={props.disableButtons}>מחק</button>
            </td>
        </tr>
    )
};

export default roomTableRow; 