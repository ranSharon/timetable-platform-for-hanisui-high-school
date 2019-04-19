import React, { Component } from 'react';
import WeekTableRow from '../../../components/weekTableRow';

class WeekTable extends Component {
    render() {
        return (
            <div>
                <h3 className="mt-3 float-right">ימי לימוד</h3>
                <table className="table table-striped " style={{ marginTop: 20 }} >
                    <thead>
                        <tr >
                            <th>יום</th>
                            <th>שעת התחלת היום</th>
                            <th>מספר שעות לימוד באותו יום</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.days.map((day, index) => 
                            <WeekTableRow key={index} day={day.day} startTime={day.startTime} hours={day.hours}></WeekTableRow>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
};

export default WeekTable;