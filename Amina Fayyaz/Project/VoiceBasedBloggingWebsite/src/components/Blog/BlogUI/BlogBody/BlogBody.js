import React, {useEffect} from "react";
import {Editor, convertFromRaw} from 'draft-js';
import Paper from '@material-ui/core/Paper';
import MicIcon from '@material-ui/icons/Mic';
import Typography from "@material-ui/core/Typography";
import CommentIcon from '@material-ui/icons/Comment';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { withStyles } from '@material-ui/core/styles';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import "./style.scss";

const RedTextTypography = withStyles({
    root: {
        color: "#FF0000"
    }
})(Typography);

const BlueTextTypography = withStyles({
    root: {
        color: "#4285f4"
    }
})(Typography);

function BlogBody(props) {
    useEffect(() => {
        console.log(props.config.content)
    }, [])
    return (
        <React.Fragment>
            <div className="blog-body">
                {/*<div className="role-play"></div>*/}
                <div className="blog-content">
                    <div className="blog-content--print py-fnt-s--1p6 py-ink--dark">
                        {props.config.content ?
                            <Editor editorState={props.config.content} readOnly={true}/>
                            // <Editor
                            //     editorState={props.config.content}
                            //     toolbarClassName="toolbarClassName"
                            //     wrapperClassName="wrapperClassName"
                            //     editorClassName="editorClassName"
                            //     // onEditorStateChange={props.onEditorStateChange}
                            //     // customStyleFn={props.customStyleFn}
                            //
                            //
                            // />
                            : 'Loading...'}
                    </div>
                </div>
                <div className="blog-related">
                    <Paper variant={"outlined"}>
                        <div style={{
                            background: '#FAFAFA',
                            padding: '10px',
                        }}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <MicIcon style={{fill: props.isLiked ? '#ff0000' : '#4285f4'}}/>
                                    <Typography variant="button">Like Article</Typography>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <RedTextTypography variant={"button"}>{props.numOfLikes}</RedTextTypography>
                                    {props.isLiked ? <FavoriteIcon style={{fill: '#ff0000'}}/> :
                                        <FavoriteBorderIcon style={{fill: '#ff0000'}}/>}
                                </div>
                            </div>
                        </div>
                        <div style={{
                            background: '#FAFAFA',
                            padding: '10px',
                        }}>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <MicIcon style={{fill: '#4285f4'}}/>
                                    <Typography variant="button">View Comments</Typography>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <BlueTextTypography variant={"button"}>{props.numComments}</BlueTextTypography>
                                    <CommentIcon style={{fill: '#4285f4'}}/>
                                </div>
                            </div>
                        </div>
                        <div style={{
                            background: '#FAFAFA',
                            padding: '10px',
                        }}>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <MicIcon style={{fill: '#4285f4'}}/>
                                <Typography variant="button">Add comment</Typography>
                            </div>
                        </div>
                    </Paper>
                </div>
            </div>
        </React.Fragment>
    );
}

export default BlogBody;
