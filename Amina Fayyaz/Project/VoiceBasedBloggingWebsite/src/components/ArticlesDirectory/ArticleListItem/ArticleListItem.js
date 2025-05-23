import React from 'react';
import './ArticleListItem.scss';
import {Editor} from 'draft-js';

import Button from "../UIElements/Button/Button";


const ArticleListItem = (props) => (
    <div className="ArticleListItem">
        <div className="ArticleListItem__Img" 
        style={{backgroundImage: `url(https://cdn4.wpbeginner.com/wp-content/uploads/2018/07/whatisblog.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        }}>

        </div>
        <div className="ArticleListItem__Content">
            <h1 className="ArticleListItem__Content--Heading">
                {props.title}
            </h1>
            <p className="ArticleListItem__Content--Paragraph">
                <Editor editorState={props.body} readOnly={true}/>
                {/*{props.body.substr(0,180) + "..."}*/}
            </p>

            <div className="ArticleListItem__Content--DateAndButtonDiv">
                <p className="ArticleListItem__Content--DateAndButtonDiv-PublishedDate">
                    {/*Oct 18 - 3:24 PM*/}
                    {(new Date(props.date)).toDateString()}
                </p>

                <Button
                    buttonText="Open"
                    width = "114px"
                    height = "31px"
                    padding = "6px 24px 6px 24px"
                    fontSize = "13px"
                    borderRadius = "5px"
                    onClick = {props.showBlogHandler}
                />
            </div>
        </div>
    </div>
);

export default ArticleListItem;