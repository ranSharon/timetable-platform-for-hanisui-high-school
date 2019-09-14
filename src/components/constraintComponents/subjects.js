import React from 'react';

const subjects = (props) => {
    //console.log(props.teachers);
    let subjects = [...props.subjects];
    return (
        <div className="col-3 border border-dark p-0">
            <div className="border border-dark ">מקצוע</div>
            <select className="custom-select" id="inputGroupSelect02" value={props.subject} onChange={(e) => props.onSubjectSelected(e)} >
                <option value="">מקצוע...</option>
                {subjects.sort().map((subject, index) =>
                    <option
                        key={index}
                        value={subject}
                        >
                        {subject}
                    </option>
                )}
            </select>
        </div>
    );
}

export default subjects;