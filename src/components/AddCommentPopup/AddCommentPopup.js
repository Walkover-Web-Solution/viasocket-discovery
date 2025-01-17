import React, { useState } from 'react';
import { ClickAwayListener, Dialog, TextareaAutosize } from '@mui/material';
import styles from './AddCommentPopup.module.scss';
import { postComment } from '@/utils/apis/commentApis';
const AddCommentPopup = ({ open, onClose, blogId, setComments }) => {
    const [text, setText] = useState('');
    async function onSubmit(){
        onClose();
        const comment = await postComment(blogId, text);
        if(comment?.commentId){
            setComments(prev => {
                console.log(prev, "Hello Prev", comment);
                return {...prev, [comment.commentId] : comment};
            })
        }
    }
    return (
        <Dialog open = {open}>
            <ClickAwayListener onClickAway={onClose}>
                <div className={styles.container}>
                    <TextareaAutosize onChange={(e) => setText(e.target.value)} className = {styles.textarea} placeholder='Leave a suggestion to improve this blog'/>
                    <button disabled={!text.trim()} onClick={onSubmit}>Submit</button>
                </div>
            </ClickAwayListener>
        </Dialog>
    )
}

export default AddCommentPopup;