import React from 'react';

const classes = (props) => {
    //console.log(props.teachers);
    const showClassesNumber = () => {
        let array = [...props.classNumber];
        let text = ``;
        array.forEach(element => {
            //console.log(element);
            text = `${text} ${element},`;
        });
        return text.substr(0, text.length - 1);
    }

    if (props.classNumber.length > 1) {
        //console.log(props.classNumber);
        return (
            <div className="col-2 border border-dark p-0">
                <div className="border border-dark ">כיתה</div>
                <div>
                    {showClassesNumber()}
                </div>
            </div>
        );
    } else {
        return (
            <div className="col-2 border border-dark p-0">
                <div className="border border-dark ">כיתה</div>
                <select
                    className="custom-select rounded-0"
                    id="inputGroupSelect02"
                    value={props.classNumber[0]}
                    onChange={(e) => props.onClassSelected(e)} >
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

}

export default classes;