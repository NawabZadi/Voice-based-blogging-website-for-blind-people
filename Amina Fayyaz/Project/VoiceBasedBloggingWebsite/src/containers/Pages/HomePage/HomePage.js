import React, {useEffect, useState} from 'react';
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import _ from 'lodash';

import tabsConfig from './tabsConfig';

import HomePage from "../../../components/HomePage";

function HomePageManager(props) {

    const [tabsConfigState, setTabsConfigState] = useState([...(tabsConfig.tabs)]);
    const urlForCmd = {};
    const commandsAndDesc = [];
    tabsConfig.tabs.forEach(tab => {
        urlForCmd[tab.cmdSlice.toLowerCase()] = {
            url: tab.goTo
        }
        commandsAndDesc.push({command: tab.cmd, description: tab.cmdDesc});
    });

    const handleNavigation = (base, cmd) => {
        console.log(urlForCmd[cmd.toLowerCase()] ? urlForCmd[cmd.toLowerCase()].url : 'Unknown Command : ' + cmd);
        let gotourl = '';
        if (urlForCmd[cmd.toLowerCase()]) {
            let cmdArray = cmd.toLowerCase().split(' ');
            base = base.toLowerCase();
            const targetCmd = base + " " + cmd;
            let tabsConfigCopy = _.cloneDeep(tabsConfig);
            tabsConfig.tabs.forEach((tab, index) => {
                if (tab.cmd.toLowerCase() === targetCmd.toLowerCase()) {
                    tabsConfigCopy.tabs[index].hover = true;
                    gotourl = tab.goTo;
                }
            });
            setTabsConfigState([...(tabsConfigCopy.tabs)]);
        }
        setTimeout(() => {
            props.history.push(gotourl);
        }, 800)
    }

    const {resetTranscript} = useSpeechRecognition();

    const commands = [
        {
            command: 'Navigate *.',
            callback: cmd => handleNavigation('Navigate', cmd)
        },
        {
            command: 'remove.',
            callback: ({resetTranscript}) => resetTranscript()
        }
    ];

    const {transcript} = useSpeechRecognition({commands});

    useEffect(() => {
        if (props.setCommands)
            props.setCommands(commandsAndDesc);

    }, [])

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return null
    }


    return (

        <HomePage config={{tabs: [...tabsConfigState]}} setCommands={props.setCommands}/>

    );

}

export default HomePageManager;