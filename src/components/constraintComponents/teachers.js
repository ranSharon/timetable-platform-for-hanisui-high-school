import React from 'react';

const teachers = (props) => {
    let teachers = [...props.teachers];
    return (
        <div className="col-3 border border-dark p-0">
            <div className="border border-dark ">מורה</div>
            <select className="custom-select rounded-0" id="inputGroupSelect02" value={props.teacher} onChange={(e) => props.onTeacherSelected(e, props.groupNum)} >
                <option value="">מורה...</option>
                {teachers.sort().map((teacher, index) =>
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