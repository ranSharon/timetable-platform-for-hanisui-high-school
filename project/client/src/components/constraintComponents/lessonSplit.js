import React from 'react';

const lessonSplit = (props) => {
    const showNumOfSplitsLesonOptions = () => {
        if (props.lessonSplit) {
            let numOfSplitOptions = 0;
            let hours = parseInt(props.hours);
            if (hours / 2 === 1) {
                numOfSplitOptions = 2;
            } else {
                numOfSplitOptions = 3;
            }
            const splitOptions = () => {
                let splitOptions = [];
                for (let i = 2; i <= numOfSplitOptions; i++) {
                    let splitOption = <option key={i} value={i.toString()}>{i}</option>
                    splitOptions = [...splitOptions, splitOption];
                }
                return splitOptions;
            }
            return (
                <div className="input-group mt-3 mb-3">
                    <div className="input-group-append">
                        <label className="input-group-text" htmlFor="inputGroupSelect02">מספר פיצול שיעורים</label>
                    </div>
                    <select className="custom-select" id="inputGroupSelect02" value={props.numOfSplits} onChange={(e) => props.onNumOfSplitsSelected(e)} >
                        <option value="0">שיעורים...</option>
                        {splitOptions()}
                        {}
                    </select>
                </div>
            );
        } else {
            return null;
        }
    };

    const showLesonSplitsOptions = () => {
        if (!props.lessonSplit) {
            return null;
        }

        let totalHours = parseInt(props.hours);

        const firstHoursOptions = (startHours, endHours) => {
            let hoursOptions = [];
            for (let i = startHours; i <= endHours; i++) {
                //let hoursOption = <option key={i} value={i.toString()}>{i}</option>
                let hoursOption = <option key={i} value={i.toString()}>{i}</option>
                hoursOptions = [...hoursOptions, hoursOption];
            }
            return hoursOptions;
        }

        const secondHoursOptions = (startHours, endHours) => {
            let hoursOptions = [];
            if (props.firstLesson === 0) {
                return hoursOptions;
            }
            for (let i = startHours; i <= endHours; i++) {
                let hoursOption = <option key={i} value={i.toString()}>{i}</option>
                hoursOptions = [...hoursOptions, hoursOption];
            }
            return hoursOptions;
        }

        const thirdHoursOptions = (startHours, endHours) => {
            let hoursOptions = [];
            if (props.secondlesson === 0) {
                return hoursOptions;
            }
            for (let i = startHours; i <= endHours; i++) {
                let hoursOption = <option key={i} value={i.toString()}>{i}</option>
                hoursOptions = [...hoursOptions, hoursOption];
            }
            return hoursOptions;
        }

        if (props.numOfSplits > 0) {
            if (props.numOfSplits === 2) {
                return (
                    <div>
                        <div className="input-group mt-3 mb-3">
                            <div className="input-group-append">
                                <label className="input-group-text" htmlFor="inputGroupSelect02">שעות שיעור ראשון</label>
                            </div>
                            <select className="custom-select" id="inputGroupSelect02" value={props.firstLesson} onChange={(e) => props.onFirstLessonSelected(e)}>
                                <option value="0">שעות ...</option>
                                {firstHoursOptions(1, totalHours - 1)}
                            </select>
                        </div>
                        <div className="input-group mt-3 mb-3">
                            <div className="input-group-append">
                                <label className="input-group-text" htmlFor="inputGroupSelect02">שעות שיעור ראשון</label>
                            </div>
                            <select className="custom-select" id="inputGroupSelect02" value={props.secondlesson} onChange={(e) => props.onSecondLessonSelected(e)}>
                                <option value="0">שעות ...</option>
                                {secondHoursOptions(totalHours - props.firstLesson, totalHours - props.firstLesson)}
                            </select>
                        </div>
                    </div>
                );
            } else if (props.numOfSplits === 3) {
                return (
                    <div>
                        <div className="input-group mt-3 mb-3">
                            <div className="input-group-append">
                                <label className="input-group-text" htmlFor="inputGroupSelect02">שעות שיעור ראשון</label>
                            </div>
                            <select className="custom-select" id="inputGroupSelect02" value={props.firstLesson} onChange={(e) => props.onFirstLessonSelected(e)}>
                                <option value="0">שעות ...</option>
                                {firstHoursOptions(1, totalHours - 2)}
                            </select>
                        </div>
                        <div className="input-group mt-3 mb-3">
                            <div className="input-group-append">
                                <label className="input-group-text" htmlFor="inputGroupSelect02">שעות שיעור שני</label>
                            </div>
                            <select className="custom-select" id="inputGroupSelect02" value={props.secondlesson} onChange={(e) => props.onSecondLessonSelected(e)}>
                                <option value="0">שעות ...</option>
                                {secondHoursOptions(1, totalHours - props.firstLesson - 1)}
                            </select>
                        </div>
                        <div className="input-group mt-3 mb-3">
                            <div className="input-group-append">
                                <label className="input-group-text" htmlFor="inputGroupSelect02">שעות שיעור שלישי</label>
                            </div>
                            <select className="custom-select" id="inputGroupSelect02" value={props.thirdlesson} onChange={(e) => props.onThirdLessonSelected(e)}>
                                <option value="0">שעות ...</option>
                                {thirdHoursOptions(totalHours - (props.firstLesson + props.secondlesson), totalHours - (props.firstLesson + props.secondlesson))}
                            </select>
                        </div>
                    </div>
                );
            }
        }
        return null
    }

    return (
        <div className="card mt-3" style={{ "textAlign": "right" }}>
            <h6 className="mt-3">האם השיעור מפוצל למספר שיעורים במהלך השבוע</h6>
            <div className="row">
                <div className="col-2">
                    <input className="ml-2" type="radio" name="split" checked={props.lessonSplit} value="כן" onChange={(e) => props.onlessonSplitClick(e)} />כן
                    <div></div>
                    <input className="ml-2" type="radio" name="split" checked={!props.lessonSplit} value="לא" onChange={(e) => props.onlessonSplitClick(e)} />לא
                </div>
                <div className="col-4">
                    {showNumOfSplitsLesonOptions()}
                </div>
                <div className="col-4">
                    {showLesonSplitsOptions()}
                </div>
            </div>
        </div>
    );
}

export default lessonSplit;