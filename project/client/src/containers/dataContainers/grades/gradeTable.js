import React, { Component } from 'react';
import GradeTableRow from '../../../components/gradeTableRow';


class GradeTable extends Component {
    render() {
        return (
            <div>
                <h3 className="mt-3 float-right">שכבות קיימות</h3>
                <table className="table table-striped" style={{ marginTop: 20 }} >
                    <thead>
                        <tr>
                            <th >שכבה</th>
                            <th >כיתה 1</th>
                            <th >כיתה 2</th>
                            <th >כיתה 3</th>
                            <th >כיתה 4</th>
                            <th >action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.grades.map((grade, index) =>
                            <GradeTableRow
                                key={index}
                                grade={grade.grade}
                                numOfClasses={grade.numOfClasses}>
                            </GradeTableRow>
                        )} 
                    </tbody>
                </table>
            </div>
        );
    }
};

export default GradeTable;