import React from 'react';
import './ArticleTopicCard.scss';

import Button from "../UIElements/Button/Button";

const ArticleTopicCard = (props) => (
    <div className="ArticleTopicCard">
        <div className="ArticleTopicCard__Img" 
        style={{backgroundImage: `url(${props.picture})`}}>
        </div>

        <div className="ArticleTopicCard__Content">
            <h1 className="ArticleTopicCard__Content--Heading">
                {props.topicName}
            </h1>
            <p className="ArticleTopicCard__Content--Paragraph">
                {props.description}
            </p>
            <Button
            buttonText="Explore"
            width = "100px"
            height = "24px"
            padding = "5px 22px 5px 22px"
            fontSize = "10px"
            borderRadius = "5px"
            onClick = {props.showArticlesByTopicsHandler}
            />
        </div>
    </div>
);

export default ArticleTopicCard;