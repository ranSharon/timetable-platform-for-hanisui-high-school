import React from 'react';

const grades = (props) => {
    //console.log(props.teachers);
    return (
        <div className="col-2 border border-dark p-0">
            <div className="border border-dark ">שכבה</div>
            <select className="custom-select" id="inputGroupSelect02" onChange={(e) => props.onGradeSelected(e)} >
                <option value="">שכבה...</option>
                {props.grades.map((grade, index) =>
                    <option
                        key={index}
                        value={grade}
                        >
                        {grade}
                    </option>
                )}
            </select>
        </div>
    );
}

export default grades;