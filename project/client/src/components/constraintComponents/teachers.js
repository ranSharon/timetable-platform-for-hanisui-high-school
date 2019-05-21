import React from 'react';

const teachers = (props) => {
    //console.log(props.teachers);
    return (
        <div className="col-3 border border-dark p-0">
            <div className="border border-dark ">מורה</div>
            <select className="custom-select" id="inputGroupSelect02" onChange={(e) => props.onTeacherSelected(e)} >
                <option value="">מורה...</option>
                {props.teachers.map((teacher, index) =>
                    <option
                        key={index}
                        value={teacher}
                        >
                        {teacher}
                    </option>
                )}
            </select>
        </div>
    );
}

export default teachers;