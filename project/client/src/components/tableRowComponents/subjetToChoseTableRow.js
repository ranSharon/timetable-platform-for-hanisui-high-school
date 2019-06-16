import React, { Component } from 'react';

class SubjectToChoseTableRow extends Component {
    state = {
        style: { cursor: "pointer" },
        rowBackgroundColor: ''
    }

    componentDidMount() {
        let subjects = [...this.props.chosenSubjects];
        for (let i = 0; i <= subjects.length - 1; i++) {
            if (subjects[i] === this.props.subjectName) {
                this.setState({ style: { ...this.state.style, backgroundColor: '#8ac98a' }, rowBackgroundColor: '#8ac98a' });
                return;
            } else if (i === subjects.length - 1) {
                if (this.props.rowNum % 2 === 0) {
                    this.setState({ style: { ...this.state.style, backgroundColor: "#f2f2f2" }, rowBackgroundColor: "#f2f2f2" });
                } else {
                    this.setState({ style: { ...this.state.style, backgroundColor: "#fff" }, rowBackgroundColor: "#fff" });
                }
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.numOfRow != this.props.numOfRow) {
            let subjects = [...this.props.chosenSubjects];
            for (let i = 0; i <= subjects.length - 1; i++) {
                if (subjects[i] === this.props.subjectName) {
                    this.setState({ style: { ...this.state.style, backgroundColor: '#8ac98a' }, rowBackgroundColor: '#8ac98a' });
                    return;
                } else if (i === subjects.length - 1) {
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
    render() {

        return (
            <tr
                className="text-center"
                style={this.state.style}
                onClick={() => {
                    this.props.onChose(this.props.subjectName);
                    this.setRowbackgroundColor(this.props.subjectName);
                }
                }>
                <td style={{ width: '1000px' }}>{this.props.subjectName}</td>
            </tr>
        );
    }
}

export default SubjectToChoseTableRow;


