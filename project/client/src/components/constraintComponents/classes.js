import React from 'react';

const classes = (props) => {
    //console.log(props.teachers);
    return (
        <div className="col-2 border border-dark p-0">
            <div className="border border-dark ">כיתה</div>
            <select className="custom-select" id="inputGroupSelect02" onChange={(e) => props.onClassSelected(e)} >
                <option value="">כיתה...</option>
                {props.classes.map((classItem, index) =>
                    <option
                        key={index}
                        value={classItem}
                        >
                        {classItem}
                    </option>
                )}
            </select>
        </div>
    );
}

export default classes;