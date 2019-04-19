import React from 'react';

const weekTableRow = (props) => {
    let row = [];
    let numOfClasses = parseInt(props.numOfClasses);
    console.log(parseInt(props.numOfClasses));
    for (let i = 1; i <= numOfClasses; i++) {
        row = [...row, <td key={i}>{props.grade + i}</td>];
        console.log(row);
    }

    if (numOfClasses < 4) {
        for (let i = numOfClasses + 1; i <= 4; i++) {
            row = [...row, <td key={i}></td>];
            console.log(row);
        }
    }

    return (
        <tr>
            <td>{props.grade}</td>
            {row}
            <td>
                <a href="#">ערוך</a>
                <div style={{display :"inline"}}> </div>
                <a href="#">מחק</a>
            </td>
        </tr>
    );
};

export default weekTableRow; 