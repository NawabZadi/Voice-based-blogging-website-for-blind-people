import React from "react";

import PageCard from "./PageCard";

import './style.scss';

function HomePage(props) {

    return (
        <div className="flex-center">
            <div className="bmh-container">
                {props.config ? props.config.tabs ? props.config.tabs.map(tab =>
                    (<div key={tab.id} className="bmh-container--item"><PageCard config={{...tab}}/></div>)
                ) : 'No Tabs Passed...' : 'No Config Passed...'}
            </div>
        </div>
    );

};

export default HomePage;