import React, { useState } from 'react';
import { ClickAwayListener, Dialog } from '@mui/material';
import { postUsecaseComment } from '@/utils/apis/usecaseApis';
import { FiX, FiMessageSquare, FiEdit3, FiSend } from 'react-icons/fi';

const MAX_LENGTH = 1000;
const ACCENT = '#a8200d';

const AddUsecaseCommentPopup = ({ open, onClose, usecaseId, setComments }) => {
    const [text, setText] = useState('');

    async function onSubmit(e) {
        e?.preventDefault?.();
        if (!text.trim()) return;
        onClose();
        const comment = await postUsecaseComment(usecaseId, text);
        setText('');
        if (comment?.commentId) {
            setComments((prev) => ({ ...prev, [comment.commentId]: comment }));
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth={false}>
            <ClickAwayListener onClickAway={onClose}>
                <div
                    className="position-relative bg-white border shadow-lg p-4 overflow-auto"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="contribute-usecase-dialog-title"
                    style={{ width: 'min(720px, 95vw)', maxHeight: 'min(90vh, 880px)' }}
                >
                    <button
                        type="button"
                        className="btn btn-link p-0 position-absolute top-0 end-0 m-3 text-secondary"
                        aria-label="Close contribute dialog"
                        onClick={onClose}
                    >
                        <FiX size={22} />
                    </button>

                    <div className="d-flex align-items-start gap-3 mb-4">
                        <div
                            className="d-inline-flex align-items-center justify-content-center border flex-shrink-0"
                            style={{ width: 60, height: 60, color: ACCENT, backgroundColor: 'rgba(168,32,13,0.08)' }}
                            aria-hidden="true"
                        >
                            <FiMessageSquare size={22} />
                        </div>
                        <div>
                            <h2
                                className="m-0 fw-bold"
                                id="contribute-usecase-dialog-title"
                                style={{ fontFamily: 'var(--title-font)', lineHeight: 1.05 }}
                            >
                                Suggest another automation idea
                            </h2>
                        </div>
                    </div>

                    <form onSubmit={onSubmit}>
                        <div className="border-top pt-3 mb-4">
                            <label
                                className="d-inline-flex align-items-center gap-2 fw-bold mb-3 fs-5"
                                htmlFor="contribute-usecase-message"
                                style={{ fontFamily: 'var(--title-font)' }}
                            >
                                <FiEdit3 size={22} style={{ color: ACCENT }} />
                                <span>Your suggestion</span>
                            </label>
                            <textarea
                                id="contribute-usecase-message"
                                className="form-control rounded-0"
                                name="details"
                                rows={4}
                                maxLength={MAX_LENGTH}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Describe another automation idea for these apps, or a correction to an existing one."
                                style={{ minHeight: 150 }}
                            />
                            <div className="d-flex justify-content-between align-items-end gap-3 mt-3">
                                <p
                                    className="m-0 p-2 px-3 flex-grow-1 small text-secondary border"
                                    style={{ borderColor: 'rgba(168,32,13,0.1)', backgroundColor: 'rgba(168,32,13,0.04)' }}
                                >
                                    We review every submission before it&apos;s added to the page.
                                </p>
                                <span className="small fw-bold text-secondary flex-shrink-0">
                                    {text.length}/{MAX_LENGTH}
                                </span>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                className="btn btn-outline-dark fs-6 d-flex align-items-center gap-2 rounded-0"
                                onClick={onClose}
                                style={{ minWidth: 'fit-content' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn fs-6 d-flex align-items-center gap-2 text-white rounded-0"
                                disabled={!text.trim()}
                                style={{ backgroundColor: ACCENT }}
                            >
                                <FiSend size={20} />
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </ClickAwayListener>
        </Dialog>
    );
};

export default AddUsecaseCommentPopup;
