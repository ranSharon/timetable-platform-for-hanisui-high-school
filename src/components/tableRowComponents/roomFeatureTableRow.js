import React from 'react';

const roomFeatureTableRow = (props) => {
    return (
        <tr className="text-center">
            <td>{props.FeatureName}</td>
            <td className="text-left">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => props.onDelete(props.FeatureName)}>מחק</button>
            </td>
        </tr>
    );
};

export default roomFeatureTableRow; 