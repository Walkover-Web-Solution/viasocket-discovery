import React, { useState } from 'react';
import { postUsecaseComment } from '@/utils/apis/usecaseApis';
import { FiX, FiMessageSquare, FiEdit3, FiSend, FiTool, FiMessageCircle } from 'react-icons/fi';
import styles from './AddUsecaseCommentPopup.module.scss';

const MAX_LENGTH = 1000;
const ACCENT = '#a8200d';

const AddUsecaseCommentPopup = ({ open, onClose, usecaseId, setComments }) => {
    const [text, setText] = useState('');
    const [contributionType, setContributionType] = useState('contributor');

    async function onSubmit(e) {
        e?.preventDefault?.();
        if (!text.trim()) return;
        onClose();
        
        const comment = await postUsecaseComment(usecaseId, { text });
        setText('');
        setContributionType('contributor');
        if (comment?.commentId) {
            setComments((prev) => ({ ...prev, [comment.commentId]: comment }));
        }
    }

    if (!open) return null;

    return (
        <div
            className={`position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-2 p-md-4 ${styles.blogDialog}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contribute-usecase-dialog-title"
        >
            <div
                className={`position-absolute top-0 start-0 w-100 h-100 ${styles.blogDialogScrim}`}
                onClick={onClose}
            />
            <div
                className={`position-relative p-4 overflow-auto border border-dark ${styles.blogDialogPanel}`}
            >
                <button
                    type="button"
                    className="position-absolute top-0 end-0 m-2 m-md-3 btn btn-link p-0 text-secondary"
                    aria-label="Close contribute dialog"
                    onClick={onClose}
                >
                    <FiX size={22} />
                </button>

                <div className="d-flex align-items-start gap-3 gap-md-4 mb-4">
                    <div
                        className="d-inline-flex align-items-center justify-content-center flex-shrink-0 border"
                        style={{ width: '60px', height: '60px', color: ACCENT, backgroundColor: 'rgba(168, 32, 13, 0.08)', borderColor: 'rgba(168, 32, 13, 0.12)' }}
                        aria-hidden="true"
                    >
                        <FiMessageSquare size={22} />
                    </div>
                    <div className="flex-grow-1">
                        <p className="small fw-bold text-uppercase mb-2" style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.14em', color: ACCENT }}>
                            Automation Ideas community
                        </p>
                        <h2
                            className="h2 h3-md fw-bold m-0"
                            style={{ fontFamily: 'var(--font-display)', lineHeight: '1.05' }}
                            id="contribute-usecase-dialog-title"
                        >
                            Contribute to Automation Ideas
                        </h2>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="d-grid gap-3 gap-md-4">
                    <fieldset className="m-0 p-0 border-0">
                        <legend className="h5 h6-md fw-bold mb-3" style={{ fontFamily: 'var(--font-display)', lineHeight: '1.15' }}>
                            How would you like to contribute?
                        </legend>
                        <div className="d-grid gap-2 gap-md-3" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }} role="radiogroup" aria-label="Contribution type">
                            <label 
                                className={`p-3 p-md-4 border bg-white ${styles.blogDialogOption} ${contributionType === 'contributor' ? styles.isSelected : ''}`}
                            >
                                <input 
                                    type="radio" 
                                    name="contribution-type" 
                                    value="contributor" 
                                    checked={contributionType === 'contributor'}
                                    onChange={(e) => setContributionType(e.target.value)}
                                />
                                <span 
                                    className="d-inline-flex align-items-center justify-content-center"
                                    style={{ width: '60px', height: '60px', color: ACCENT, backgroundColor: 'rgba(168, 32, 13, 0.08)', borderColor: 'rgba(168, 32, 13, 0.08)' }}
                                    aria-hidden="true"
                                >
                                    <FiTool size={22} />
                                </span>
                                <span className="d-grid gap-1">
                                    <strong className="h6 mb-0">Become a contributor</strong>
                                    <span className="text-secondary small" style={{ lineHeight: '1.55' }}>Share your own automation ideas and workflows with the community.</span>
                                </span>
                                <span className={`rounded-circle ${styles.blogDialogOptionMark}`} aria-hidden="true"></span>
                            </label>

                            <label 
                                className={`p-3 p-md-4 border bg-white ${styles.blogDialogOption} ${contributionType === 'author' ? styles.isSelected : ''}`}
                            >
                                <input 
                                    type="radio" 
                                    name="contribution-type" 
                                    value="author" 
                                    checked={contributionType === 'author'}
                                    onChange={(e) => setContributionType(e.target.value)}
                                />
                                <span 
                                    className="d-inline-flex align-items-center justify-content-center"
                                    style={{ width: '60px', height: '60px', color: ACCENT, backgroundColor: 'rgba(168, 32, 13, 0.08)', borderColor: 'rgba(168, 32, 13, 0.08)' }}
                                    aria-hidden="true"
                                >
                                    <FiMessageCircle size={22} />
                                </span>
                                <span className="d-grid gap-1">
                                    <strong className="h6 mb-0">Request the author</strong>
                                    <span className="text-secondary small" style={{ lineHeight: '1.55' }}>Tell the author what workflow or use case you would like to see next.</span>
                                </span>
                                <span className={`rounded-circle ${styles.blogDialogOptionMark}`} aria-hidden="true"></span>
                            </label>
                        </div>
                    </fieldset>

                    <div className="d-grid gap-3 pt-4 border-top">
                        <label className="d-inline-flex align-items-center gap-2 h5 h6-md fw-bold" style={{ fontFamily: 'var(--font-display)', lineHeight: '1.1' }} htmlFor="contribute-message">
                            <FiEdit3 size={22} style={{ color: ACCENT }} />
                            <span>{contributionType === 'contributor' ? 'Contribution details' : 'Request details'}</span>
                        </label>
                        <textarea
                            id="contribute-message"
                            className="w-100 p-3 form-control border"
                            name="details"
                            rows={4}
                            maxLength={MAX_LENGTH}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Share an automation idea, workflow, or use case you'd like to contribute."
                            style={{ minHeight: '150px', fontFamily: 'var(--font-body)', lineHeight: '1.6' }}
                        />
                        <div className="d-flex flex-column flex-md-row gap-2 gap-md-3 align-items-start align-items-md-end justify-content-between">
                            <p className={`m-0 p-3 small border w-100 ${styles.blogDialogNote}`} style={{ borderColor: 'rgba(168, 32, 13, 0.1)', lineHeight: '1.55', color: 'rgba(0, 0, 0, 0.72)' }}>
                                Your message helps us grow the library of practical automation ideas.
                            </p>
                            <span className="small fw-bold text-secondary" style={{ fontFamily: 'var(--font-body)', color: 'rgba(0, 0, 0, 0.44)' }}>
                                {text.length}/{MAX_LENGTH}
                            </span>
                        </div>
                    </div>

                    <div className="d-flex flex-column flex-md-row justify-content-end gap-2">
                        <button
                            type="button"
                            className="d-inline-flex align-items-center justify-content-center gap-2 btn btn-outline-dark w-100 w-md-auto"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="d-inline-flex align-items-center justify-content-center gap-2 btn w-100 w-md-auto"
                            disabled={!text.trim()}
                            style={{ backgroundColor: ACCENT, color: '#fff' }}
                        >
                            <FiSend size={20} />
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUsecaseCommentPopup;