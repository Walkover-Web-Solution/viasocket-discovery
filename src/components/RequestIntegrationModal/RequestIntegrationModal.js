import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./RequestIntegrationModal.module.scss";

const RequestIntegrationModal = ({ onClose, type, appInfo }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pluginName: "",
    useCase: "",
    selectedApp: appInfo ? appInfo.name : "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [useCaseError, setUseCaseError] = useState("");
  const [pluginNameError, setPluginNameError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [formData.useCase]);

  useEffect(() => {
    const handleModalShow = () => {
      setFormData({
        name: "",
        email: "",
        pluginName: "",
        useCase: "",
        selectedApp: appInfo ? appInfo.name : "",
      });
      setEmailError("");
      setNameError("");
      setUseCaseError("");
      setPluginNameError("");
    };

    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      modalElement.addEventListener('show.bs.modal', handleModalShow);
      return () => {
        modalElement.removeEventListener('show.bs.modal', handleModalShow);
      };
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      if (!/\S+@\S+\.\S+/.test(value)) {
        setEmailError("Please enter a valid email address.");
      } else {
        setEmailError("");
      }
    }
    if (name === "name") {
      if (!value.trim()) {
        setNameError("Name is required.");
      } else {
        setNameError("");
      }
    }
    if (name === "useCase") {
      if (!value.trim()) {
        setUseCaseError("Use case is required.");
      } else {
        setUseCaseError("");
      }
    }
    if (name === "pluginName") {
      if (!value.trim()) {
        setPluginNameError("Plugin name is required.");
      } else {
        setPluginNameError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    let hasError = false;
    
    if (!formData.name.trim()) {
      setNameError("Name is required.");
      hasError = true;
    }
    
    if (!formData.email.trim()) {
      setEmailError("Email is required.");
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setEmailError("Please enter a valid email address.");
      hasError = true;
    }
    
    if (!formData.useCase.trim()) {
      setUseCaseError("Use case is required.");
      hasError = true;
    }
    
    if (!formData.pluginName.trim()) {
      setPluginNameError("Plugin name is required.");
      hasError = true;
    }
    
    if (hasError) {
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        userEmail: formData.email,
        userName: formData.name,
        useCase: formData.useCase,
        plugName: type ? formData.selectedApp : formData.pluginName,
        source: 'website',
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'production',
        userNeed: type ? `New ${type}` : 'New App',
        category: appInfo?.category || '',
      };
      
      const response = await axios.post(
        "https://flow.sokt.io/func/scriPIvL7pBP",
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.status === 200) {
        setShowSuccessPopup(true);
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessDone = () => {
    setShowSuccessPopup(false);
    if (onClose) onClose();
  };

  const title = type
    ? `Request a new ${type} for ${formData.selectedApp}`
    : "Request a new Integration";

  const description = type
    ? `Sit back and relax, we'll build your ${type} in only 48 hours! 🚀`
    : "Sit back and relax, we'll build your app in only 48 hours! 🚀";

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">{title}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {showSuccessPopup ? (
              <div className="text-center py-4">
                <div className={styles.successIcon}>
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="40" fill="#4CAF50"/>
                    <path d="M25 40L35 50L55 30" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h4 className="mt-3 mb-2">Got your request!</h4>
                <p className="text-muted mb-4">We&apos;ll get back to you within 48 hours! 🚀</p>
                <a 
                  href="https://calendly.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary mb-3"
                >
                  Schedule a Meeting
                </a>
                <div>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    style={{ backgroundColor: '#a8200d', borderColor: '#a8200d' }}
                    onClick={handleSuccessDone}
                    data-bs-dismiss="modal"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <>
                {appInfo && (
                  <div className={`d-flex align-items-center gap-3 mb-4 ${styles.appInfo}`}>
                    <img 
                      src={appInfo.iconurl || `https://logo.clearbit.com/${appInfo.domain}`} 
                      alt={appInfo.name}
                      width="50"
                      height="50"
                      className="rounded"
                      onError={(e) => {
                        e.target.src = '/placeholder-icon.png';
                      }}
                    />
                    <div>
                      <h6 className="mb-1">{appInfo.name}</h6>
                      <p className="text-muted small mb-0">{description}</p>
                    </div>
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className={`form-control ${nameError ? 'is-invalid' : ''}`}
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                    {nameError && <div className="invalid-feedback">{nameError}</div>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${emailError ? 'is-invalid' : ''}`}
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                    {emailError && <div className="invalid-feedback">{emailError}</div>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Plugin Name</label>
                    <input
                      type="text"
                      className={`form-control ${pluginNameError ? 'is-invalid' : ''}`}
                      name="pluginName"
                      value={formData.pluginName}
                      onChange={handleInputChange}
                      required
                    />
                    {pluginNameError && <div className="invalid-feedback">{pluginNameError}</div>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Use Case</label>
                    <textarea
                      ref={textareaRef}
                      className={`form-control ${useCaseError ? 'is-invalid' : ''}`}
                      name="useCase"
                      value={formData.useCase}
                      onChange={handleInputChange}
                      rows="3"
                      required
                    ></textarea>
                    {useCaseError && <div className="invalid-feedback">{useCaseError}</div>}
                  </div>
                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      style={{ backgroundColor: '#a8200d', borderColor: '#a8200d' }}
                      disabled={isLoading}
                    >
                      {isLoading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>}
                      Submit
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestIntegrationModal;
