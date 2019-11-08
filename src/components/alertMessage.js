import React from 'react';

const alertMessage = (props) => {
    if (props.message === '') {
        return null;
    }

    let content = [];
    let message = props.message.split('$');
    message.forEach((element, index) => {
        if (index !== 0 && element !== '') {
            content = [...content, <li key={index} style={{ textAlign: "right" }}>{element}</li>];
        }
    });
    // if(props.messageStatus){
    //     //setInterval(()=> null, 3000);
    //     return (
    //         <div
    //             className="alert alert-success m-1"
    //             role="alert"
    //             style={{ textAlign: "right" }}>
    //             {props.message}
    //         </div>
    //     )
    // }
    if (props.messageStatus) {
        //setInterval(()=> null, 3000);
        return (
            <div
                className="alert alert-success mt-2"
                role="alert"
                style={{ textAlign: "right" }}>
                <ul>
                    {message[0]}
                    {content}
                </ul>
            </div>
        )
    }

    return (
        <div
            className="alert alert-danger mt-2"
            role="alert"
            style={{ textAlign: "right" }}>
            <ul>
                {message[0]}
                {content}
            </ul>
        </div>
    )
};

export default alertMessage; 