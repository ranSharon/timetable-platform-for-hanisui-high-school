import React from 'react';



const hours = (props) => {
    return (
        <div className="col-2 border border-dark p-0">
            <div className="border border-dark ">שעות לימוד</div>
            <select className="custom-select" id="inputGroupSelect02" onChange={(e) => props.onHoursSelected(e)} >
                <option value="">שעות...</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
            </select>
        </div>
    );
}

export default hours;