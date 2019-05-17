import React from 'react';

const roomFeatureTableRow = (props) => {
    return (
        <tr>
            <td>{props.FeatureName}</td>
            <td>
                {/* <button onClick={() => props.onEdit(props.id)} disabled={props.disableButtons}>ערוך</button>
                <div style={{ display: "inline" }}>  </div>
                <button onClick={() => props.onDelete(props.id)} disabled={props.disableButtons}>מחק</button> */}
                <button onClick={() => props.onDelete(props.FeatureName)}>מחק</button>
            </td>
        </tr>
    );
};

export default roomFeatureTableRow; 