import React, { Component } from 'react';

class SubjectToChoseTableRow extends Component {
    state = {
        style: { cursor: "pointer" },
        rowBackgroundColor: ''
    }

    componentDidMount() {
        //console.log('componentDidMount');
        let subjects = [...this.props.chosenSubjects];
            for (let i = 0; i <= subjects.length - 1; i++) {
                //console.log(subjects[i] === this.props.subjectName);
                if (subjects[i] === this.props.subjectName) {
                    this.setState({ style: { ...this.state.style, backgroundColor: '#8ac98a' }, rowBackgroundColor: '#8ac98a' });
                    return;
                } else if (i ===subjects.length - 1 ) {
                    if (this.props.rowNum % 2 === 0) {
                        this.setState({ style: { ...this.state.style, backgroundColor: "#f2f2f2" }, rowBackgroundColor: "#f2f2f2" });
                    } else {
                        this.setState({ style: { ...this.state.style, backgroundColor: "#fff" }, rowBackgroundColor: "#fff" });
                    }
                }
            }
    }

    componentDidUpdate(prevProps, prevState) {
        //console.log('componentDidUpdate');
        // console.log('subject for teachr row componentDidUpdate now: ' + this.props.chosenSubjects);
        // console.log('subject for teachr row componentDidUpdate prev: ' + prevProps.chosenSubjects);
        // console.log(this.props.subjectName);
        // console.log(this.props.rowNum);
        if (prevProps.numOfRow != this.props.numOfRow) {
            let subjects = [...this.props.chosenSubjects];
            for (let i = 0; i <= subjects.length - 1; i++) {
                //console.log(subjects[i] === this.props.subjectName);
                if (subjects[i] === this.props.subjectName) {
                    this.setState({ style: { ...this.state.style, backgroundColor: '#8ac98a' }, rowBackgroundColor: '#8ac98a' });
                    return;
                } else if (i ===subjects.length - 1 ) {
                    if (this.props.rowNum % 2 === 0) {
                        this.setState({ style: { ...this.state.style, backgroundColor: "#f2f2f2" }, rowBackgroundColor: "#f2f2f2" });
                    } else {
                        this.setState({ style: { ...this.state.style, backgroundColor: "#fff" }, rowBackgroundColor: "#fff" });
                    }
                }
            }
        }
    }

    setRowbackgroundColor(subject) {
        if (this.state.rowBackgroundColor === '#8ac98a') {
            if (this.props.rowNum % 2 === 0) {
                this.setState({ style: { ...this.state.style, backgroundColor: "#f2f2f2" }, rowBackgroundColor: "#f2f2f2" });
            } else {
                this.setState({ style: { ...this.state.style, backgroundColor: "#fff" }, rowBackgroundColor: "#fff" });
            }
        } else {
            this.setState({ style: { ...this.state.style, backgroundColor: '#8ac98a' }, rowBackgroundColor: '#8ac98a' });
        }
    };

    updateRows(subject) {
        let sbujectRow = { name: subject, clicked: false };
        let rows = [...this.state.rows];
        rows.push(sbujectRow);
        this.setState({ rows: [...rows] });
    }

    checkIfsubjectChoosen() {

        if (this.state.clicked) {
            this.setState({ style: { ...this.state.style, backgroundColor: "#8ac98a" }, clicked: true });
        }

    }
    //this.checkIfsubjectChoosen();
    render() {
        //console.log(this.props.subjectName + ' render');
        //this.checkIfsubjectChoosen();
        return (
            <tr
                style={this.state.style}
                onClick={() => {
                    //this.subjectClicked();
                    this.props.onChose(this.props.subjectName);
                    this.setRowbackgroundColor(this.props.subjectName);
                    // return this.props.onChose(this.props.subjectName);
                }
                }>
                <td style={{ width: '1000px' }}>{this.props.subjectName}</td>
            </tr>
        );
    }
}

export default SubjectToChoseTableRow;


