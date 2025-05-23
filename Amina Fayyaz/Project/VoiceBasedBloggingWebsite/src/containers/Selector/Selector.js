import React, {useEffect} from "react";
import {useSpeechRecognition} from "react-speech-recognition";


function Selector(props) {





    useEffect(() => {
        props.setCommands([...props.commands]);
    }, [])

    return (
        <React.Fragment>

            <div style={{
                width: '100vw',
                height: '100vh',
                position: 'fixed',
                top: 0,
                left: 0,
                background: 'rgba(255, 255,255,.3)',
                'backdrop-filter': 'saturate(180%) blur(20px)',
                zIndex: 500
            }}></div>
            <div
            id={"selector-element"}
                style={{
                width: '70vw',
                height: 'auto',
                maxHeight: '75vh',
                overflow: 'auto',
                position: 'fixed',
                top: '10%',
                left: '20%',
                backgroundColor: '#fff',
                borderRadius: '8px',
                zIndex: 501,
                border: '3px dashed #458bff'
            }}>
                {props.children}
            </div>

        </React.Fragment>

    )

}

export default Selector;