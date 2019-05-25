import React from 'react';



const constraintsTableRow = (props) => {
    const showClasses = () => {
        let array = [...props.constraint.classNumber];
        let text = ``;
        array.forEach(element => {
            //console.log(element);
            text = `${text} ${element},`;
        });
        return text.substr(0, text.length - 1);
    }


    const actionButtons = () => {
        if ((props.constraint.lessonSplit &&
            props.constraint.constraintSplitsBros.length === 0) ||
            props.constraint.copyConstraint
        ) {
            return <td></td>;
        } else {
            return (
                <td className="border-top border-dark">
                    <button >ערוך</button>
                    <div style={{ display: "inline" }}></div>
                    <button onClick={() => props.onDelete(props.constraint._id)}>מחק</button>
                </td>
            );
        }

    }

    const yesOrNo = (bool) => {
        if (bool)
            return 'כן';
        else
            return 'לא';
    }

    if ((props.constraint.lessonSplit &&
        props.constraint.constraintSplitsBros.length === 0) ||
        props.constraint.copyConstraint
    ) {
        return (
            <tr >
                <td>{props.constraint.num}</td>
                <td>{props.constraint.hours}</td>
                <td>{props.constraint.teacher}</td>
                <td>{props.constraint.subject}</td>
                <td>{props.constraint.grade}</td>
                <td>{showClasses()}</td>
                <td>{yesOrNo(props.constraint.lessonSplit)}</td>
                <td>{yesOrNo(props.constraint.subjectMix)}</td>
                {actionButtons()}
                {/* <button onClick={() => props.onEdit(props.id)} disabled={props.disableButtons}>ערוך</button>
                <div style={{ display: "inline" }}>  </div>
                <button onClick={() => props.onDelete(props.id)} disabled={props.disableButtons}>מחק</button> */}
                {/* <button onClick={() => props.onDelete(props.FeatureName)}>מחק</button> */}

            </tr>
        );
    } else {
        return (
            <tr >
                <td className="border-top border-dark">{props.constraint.num}</td>
                <td className="border-top border-dark">{props.constraint.hours}</td>
                <td className="border-top border-dark">{props.constraint.teacher}</td>
                <td className="border-top border-dark">{props.constraint.subject}</td>
                <td className="border-top border-dark">{props.constraint.grade}</td>
                <td className="border-top border-dark" >{showClasses()}</td>
                <td className="border-top border-dark">{yesOrNo(props.constraint.lessonSplit)}</td>
                <td className="border-top border-dark">{yesOrNo(props.constraint.subjectMix)}</td>
                {actionButtons()}
                {/* <button onClick={() => props.onEdit(props.id)} disabled={props.disableButtons}>ערוך</button>
                <div style={{ display: "inline" }}>  </div>
                <button onClick={() => props.onDelete(props.id)} disabled={props.disableButtons}>מחק</button> */}
                {/* <button onClick={() => props.onDelete(props.FeatureName)}>מחק</button> */}

            </tr>
        );
    }

    // return (
    //     <tr>
    //         <td>{props.constraint.hours}</td>
    //         <td>{props.constraint.teacher}</td>
    //         <td>{props.constraint.subject}</td>
    //         <td>{props.constraint.grade}</td>
    //         <td>{showClasses()}</td>
    //         <td>{yesOrNo(props.constraint.lessonSplit)}</td>
    //         <td>{yesOrNo(props.constraint.subjectMix)}</td>
    //         {actionButtons()}
    //         {/* <button onClick={() => props.onEdit(props.id)} disabled={props.disableButtons}>ערוך</button>
    //             <div style={{ display: "inline" }}>  </div>
    //             <button onClick={() => props.onDelete(props.id)} disabled={props.disableButtons}>מחק</button> */}
    //         {/* <button onClick={() => props.onDelete(props.FeatureName)}>מחק</button> */}

    //     </tr>
    // );
};

export default constraintsTableRow; 