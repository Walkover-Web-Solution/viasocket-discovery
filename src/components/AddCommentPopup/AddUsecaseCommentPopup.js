import React, { useState, useEffect } from "react";
import { ClickAwayListener, Dialog, Radio } from "@mui/material";
import { postUsecaseComment } from "@/utils/apis/usecaseApis";
import { FiX, FiMessageSquare, FiEdit3, FiSend, FiPenTool, FiHelpCircle } from "react-icons/fi";

const MAX_LENGTH = 1000;
const ACCENT = "#a8200d";

const AddUsecaseCommentPopup = ({ open, onClose, usecaseId, setComments }) => {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("contribute"); // 'contribute' | 'request'

  useEffect(() => {
    if (open) {
      setMode("contribute");
      setText("");
    }
  }, [open]);

  async function onSubmit(e) {
    e?.preventDefault?.();
    if (!text.trim()) return;
    onClose();
    const comment = await postUsecaseComment(usecaseId, text);
    setText("");
    setMode(null);
    if (comment?.commentId) {
      setComments((prev) => ({ ...prev, [comment.commentId]: comment }));
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false}>
      <ClickAwayListener onClickAway={onClose}>
        <div
          className="position-relative bg-white border shadow-lg p-4 overflow-auto d-flex flex-column gap-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contribute-usecase-dialog-title"
          style={{ width: "min(1000px, 95vw)", maxHeight: "min(90vh, 880px)" }}
        >
          <button
            type="button"
            className="btn btn-link p-0 position-absolute top-0 end-0 m-3 text-secondary"
            aria-label="Close contribute dialog"
            onClick={onClose}
          >
            <FiX size={22} />
          </button>

          <div className="d-flex align-items-start gap-3">
            <div
              className="d-inline-flex align-items-center justify-content-center border flex-shrink-0"
              style={{
                width: 60,
                height: 60,
                color: ACCENT,
                backgroundColor: "rgba(168,32,13,0.08)",
              }}
              aria-hidden="true"
            >
              <FiMessageSquare size={22} />
            </div>
            <div>
              <p className="text-brand mb-1">Automation Ideas community</p>
              <h2
                className="m-0 fw-bold"
                id="contribute-usecase-dialog-title"
                style={{ lineHeight: 1.05 }}
              >
                Contribute to Automation Ideas
              </h2>
            </div>
          </div>

          <form onSubmit={onSubmit}>
            <div className="d-flex flex-column gap-4">
              <div className="d-flex flex-column gap-2">
                <label
                  className="d-inline-flex align-items-center gap-2 fw-bold fs-5"
                  htmlFor="contribute-usecase-message"
                >
                  <span>How would you like to contribute?</span>
                </label>

                <div className="d-flex gap-4 align-items-center">
                  <div
                    className="border p-3 rounded d-flex align-items-center gap-4 cursor-pointer"
                    onClick={() => setMode("contribute")}
                    role="button"
                    aria-pressed={mode === "contribute"}
                  >
                    <div
                      className="border p-2 text-brand border rounded"
                      style={{ backgroundColor: "rgba(168, 32, 13, 0.08)" }}
                    >
                      <FiPenTool size={22} />
                    </div>
                    <div className="d-flex flex-column">
                      <h5>Become a contributor</h5>
                      <p>
                        Share your own automation ideas and workflows with the
                        community.
                      </p>
                    </div>
                    <Radio
                      checked={mode === "contribute"}
                      onChange={() => setMode("contribute")}
                    />
                  </div>

                  <div
                    className="border p-3 rounded d-flex align-items-center gap-4 cursor-pointer"
                    onClick={() => setMode("request")}
                    role="button"
                    aria-pressed={mode === "request"}
                  >
                    <div
                      className="border p-2 text-brand border rounded"
                      style={{ backgroundColor: "rgba(168, 32, 13, 0.08)" }}
                    >
                      <FiHelpCircle size={22} />
                    </div>
                    <div className="d-flex flex-column">
                      <h5>Request the author</h5>
                      <p>
                        Tell the author what workflow or use case you would like
                        to see next.
                      </p>
                    </div>
                    <Radio
                      checked={mode === "request"}
                      onChange={() => setMode("request")}
                    />
                  </div>
                </div>
              </div>

              <div className="d-flex flex-column gap-2">
                {mode === "request" && (
                  <div
                    className="fw-bold fs-5"
                    style={{}}
                  >
                    <FiEdit3 size={22} style={{ color: ACCENT }} /> Request
                    details
                  </div>
                )}
                {mode === "contribute" && (
                  <div
                    className="fw-bold fs-5"
                    style={{}}
                  >
                    <FiEdit3 size={22} style={{ color: ACCENT }} /> Contribution
                    details
                  </div>
                )}

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
              </div>
              <div className="d-flex justify-content-between align-items-end gap-4 mb-4">
                <p
                  className="m-0 p-2 px-3 flex-grow-1 small text-secondary border"
                  style={{
                    borderColor: "rgba(168,32,13,0.1)",
                    backgroundColor: "rgba(168,32,13,0.04)",
                  }}
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

export default AddUsecaseCommentPopup;
