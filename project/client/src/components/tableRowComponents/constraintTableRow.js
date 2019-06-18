import React from 'react';



const constraintsTableRow = (props) => {
    const showClasses = () => {
        let array = [...props.constraint.classNumber];
        let text = ``;
        array.forEach(element => {
            text = `${text} ${element},`;
        });
        return text.substr(0, text.length - 1);
    }

    const showTeachers = () => {
        let array = [...props.constraint.groupingTeachers];
        let text = ``;
        array.forEach(element => {
            text = `${text} ${element},`;
        });
        return text.substr(0, text.length - 1);
    }


    const actionButtons = () => {
        if (!props.constraint.mainConstraint) {
            return <td></td>;
        } else {
            return (
                <td className="border-top border-dark text-left">
                    <button onClick={() => props.onEdit(props.constraint._id)}>ערוך</button>
                    <div style={{ display: "inline" }}> </div>
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

    // if ((props.constraint.lessonSplit &&
    //     props.constraint.constraintSplitsBros.length === 0) ||
    //     props.constraint.copyConstraint
    // ) {
    if ((props.constraint.lessonSplit &&
        props.constraint.constraintSplitsBros.length === 0)
    ) {
        return (
            <tr className="text-center">
                {/* <td>{props.constraint.num}</td> */}
                <td>{props.constraint.hours}</td>
                <td>{showTeachers()}</td>
                <td>{props.constraint.subject}</td>
                <td>{props.constraint.grade}</td>
                <td>{showClasses()}</td>
                <td>{yesOrNo(props.constraint.lessonSplit)}</td>
                <td>{yesOrNo(props.constraint.subjectGrouping)}</td>
                {actionButtons()}
            </tr>
        );
    } else {
        return (
            <tr className="text-center">
                {/* <td className="border-top border-dark">{props.constraint.num}</td> */}
                <td className="border-top border-dark">{props.constraint.hours}</td>
                <td className="border-top border-dark">{showTeachers()}</td>
                <td className="border-top border-dark">{props.constraint.subject}</td>
                <td className="border-top border-dark">{props.constraint.grade}</td>
                <td className="border-top border-dark" >{showClasses()}</td>
                <td className="border-top border-dark">{yesOrNo(props.constraint.lessonSplit)}</td>
                <td className="border-top border-dark">{yesOrNo(props.constraint.subjectGrouping)}</td>
                {actionButtons()}
            </tr>
        );
    }
};

export default constraintsTableRow; 