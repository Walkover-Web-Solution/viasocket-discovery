import React, { useState } from 'react';
import { ClickAwayListener, Dialog } from '@mui/material';
import { postComment } from '@/utils/apis/commentApis';
import { FiX, FiMessageSquare, FiPenTool, FiEdit3, FiSend } from 'react-icons/fi';

const MAX_LENGTH = 1000;
const ACCENT = '#a8200d';

const AddCommentPopup = ({ open, onClose, blogId, setComments }) => {
    const [text, setText] = useState('');
    const [contributionType, setContributionType] = useState('app');

    async function onSubmit(e) {
        e?.preventDefault?.();
        if (!text.trim()) return;
        onClose();
        const comment = await postComment(blogId, text);
        if (comment?.commentId) {
            setComments(prev => ({ ...prev, [comment.commentId]: comment }));
        }
    }

    const isAppOption = contributionType === 'app';

    const optionClass = () =>
        `position-relative d-flex align-items-center gap-3 p-3 bg-white h-100`;

    const optionStyle = (selected) => ({
        cursor: 'pointer',
        border: selected ? `2px solid ${ACCENT}` : '1px solid rgba(0,0,0,0.18)',
        boxShadow: selected ? `6px 6px 0 0 rgba(168,32,13,0.08)` : 'none',
    });

    return (
        <Dialog open={open} onClose={onClose} maxWidth={false}>
            <ClickAwayListener onClickAway={onClose}>
                <div
                    className="position-relative bg-white border shadow-lg p-4 overflow-auto"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="contribute-dialog-title"
                    style={{ width: 'min(880px, 95vw)', maxHeight: 'min(90vh, 880px)' }}
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
                            <p
                                className="mb-2 fw-bold small text-uppercase"
                                style={{ color: ACCENT, letterSpacing: '0.14em', fontSize: 12 }}
                            >
                                Discovery editorial desk
                            </p>
                            <h2 className="m-0 fw-bold" id="contribute-dialog-title" style={{ fontFamily: 'var(--title-font)', lineHeight: 1.05 }}>
                                Contribute to Discovery
                            </h2>
                        </div>
                    </div>

                    <form onSubmit={onSubmit}>
                        <fieldset className="border-0 p-0 m-0 mb-4">
                            <legend className="fw-bold mb-3 fs-5" style={{ fontFamily: 'var(--title-font)' }}>
                                What would you like to do?
                            </legend>
                            <div className="row g-3" role="radiogroup" aria-label="Contribution type">
                                <div className="col-12 col-md-6">
                                    <label className={optionClass(isAppOption)} style={optionStyle(isAppOption)}>
                                        <input
                                            type="radio"
                                            name="contribution-type"
                                            value="app"
                                            checked={isAppOption}
                                            onChange={() => setContributionType('app')}
                                            className="position-absolute opacity-0"
                                        />
                                        <span
                                            className="d-inline-flex align-items-center justify-content-center border flex-shrink-0"
                                            style={{ width: 60, height: 60, color: ACCENT, backgroundColor: 'rgba(168,32,13,0.08)' }}
                                            aria-hidden="true"
                                        >
                                            <FiPenTool size={22} />
                                        </span>
                                        <span className="flex-grow-1">
                                            <strong className="d-block mb-1" style={{ fontFamily: 'var(--title-font)' }}>List your app</strong>
                                            <span className="text-secondary small">
                                                Submit a product for editorial review and potential inclusion in future Discovery coverage.
                                            </span>
                                        </span>
                                        <span
                                            className="rounded-circle border border-2 flex-shrink-0"
                                            style={{
                                                width: 22,
                                                height: 22,
                                                borderColor: isAppOption ? ACCENT : 'rgba(0,0,0,0.22)',
                                                backgroundColor: isAppOption ? ACCENT : 'transparent',
                                                boxShadow: isAppOption ? 'inset 0 0 0 4px #fff' : 'none',
                                            }}
                                            aria-hidden="true"
                                        />
                                    </label>
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className={optionClass(!isAppOption)} style={optionStyle(!isAppOption)}>
                                        <input
                                            type="radio"
                                            name="contribution-type"
                                            value="feedback"
                                            checked={!isAppOption}
                                            onChange={() => setContributionType('feedback')}
                                            className="position-absolute opacity-0"
                                        />
                                        <span
                                            className="d-inline-flex align-items-center justify-content-center border flex-shrink-0"
                                            style={{ width: 60, height: 60, color: ACCENT, backgroundColor: 'rgba(168,32,13,0.08)' }}
                                            aria-hidden="true"
                                        >
                                            <FiMessageSquare size={22} />
                                        </span>
                                        <span className="flex-grow-1">
                                            <strong className="d-block mb-1" style={{ fontFamily: 'var(--title-font)' }}>Give feedback</strong>
                                            <span className="text-secondary small">
                                                Share a correction, editorial suggestion, issue, or request for additional product coverage.
                                            </span>
                                        </span>
                                        <span
                                            className="rounded-circle border border-2 flex-shrink-0"
                                            style={{
                                                width: 22,
                                                height: 22,
                                                borderColor: !isAppOption ? ACCENT : 'rgba(0,0,0,0.22)',
                                                backgroundColor: !isAppOption ? ACCENT : 'transparent',
                                                boxShadow: !isAppOption ? 'inset 0 0 0 4px #fff' : 'none',
                                            }}
                                            aria-hidden="true"
                                        />
                                    </label>
                                </div>
                            </div>
                        </fieldset>

                        <div className="border-top pt-3 mb-4">
                            <label
                                className="d-inline-flex align-items-center gap-2 fw-bold mb-3 fs-5"
                                htmlFor="contribute-message"
                                style={{ fontFamily: 'var(--title-font)' }}
                            >
                                <FiEdit3 size={22} style={{ color: ACCENT }} />
                                <span>{isAppOption ? 'App details' : 'Your feedback'}</span>
                            </label>
                            <textarea
                                id="contribute-message"
                                className="form-control rounded-0"
                                name="details"
                                rows={4}
                                maxLength={MAX_LENGTH}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder={
                                    isAppOption
                                        ? 'Share your product name, website, category, target audience, and why it belongs in Discovery.'
                                        : 'Leave a suggestion to improve this blog.'
                                }
                                style={{ minHeight: 150 }}
                            />
                            <div className="d-flex justify-content-between align-items-end gap-3 mt-3">
                                <p
                                    className="m-0 p-2 px-3 flex-grow-1 small text-secondary border"
                                    style={{ borderColor: 'rgba(168,32,13,0.1)', backgroundColor: 'rgba(168,32,13,0.04)' }}
                                >
                                    We review every submission manually. Selected apps may be researched and featured in future editorial roundups.
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
                                style={{ minWidth: "fit-content" }}
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

export default AddCommentPopup;