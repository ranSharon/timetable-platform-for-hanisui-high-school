import React from 'react';

const roomFeatureTableRow = (props) => {
    return (
        <tr className="text-center">
            <td>{props.FeatureName}</td>
            <td className="text-left">
                <button onClick={() => props.onDelete(props.FeatureName)}>מחק</button>
            </td>
        </tr>
    );
};

export default roomFeatureTableRow; 