import React, { useState, useEffect } from 'react';
import './password-form-styles.css';

const SeniorFriendlyPasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [formStatus, setFormStatus] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(true); // Visible by default for easier use

  // Password validation requirements
  const requirements = [
    { id: 'lowercase', label: 'At least one lowercase letter (a-z)', regex: /[a-z]/ },
    { id: 'uppercase', label: 'At least one UPPERCASE letter (A-Z)', regex: /[A-Z]/ },
    { id: 'digit', label: 'At least one number (0-9)', regex: /[0-9]/ },
    { id: 'special', label: 'At least one special character', regex: /[!@#$%^&*_\-+=|\\:;"'<>,.?/]/ },
    { id: 'noParenthesis', label: 'No parentheses ( )', regex: /^[^()]*$/ },
    { id: 'length', label: 'At least 8 characters long', regex: /.{8,}/ }
  ];

  useEffect(() => {
    // Update validation in real-time as user types
    if (newPassword) {
      const errors = requirements.filter(req => !req.regex.test(newPassword));
      setValidationErrors(errors);
    } else {
      setValidationErrors([]);
    }
    
    // Clear any previous error status when user is typing
    if (formStatus === 'error' || formStatus === 'mismatch') {
      setFormStatus('');
    }
  }, [newPassword, confirmPassword, formStatus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if there are any validation errors
    if (validationErrors.length > 0) {
      setFormStatus('error');
      return;
    }
    
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setFormStatus('mismatch');
      return;
    }
    
    // Here you would typically send the password change request to your backend
    // For this demo, we'll just simulate a successful password change
    setFormStatus('success');
    
    // Reset form after successful submission
    setTimeout(() => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setFormStatus('');
    }, 5000);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Common good special characters that are easy to remember
  const commonSpecialChars = ['!', '@', '#', '$', '%', '&', '*', '?'];

  // Helper function to get password strength description
  const getPasswordStrength = () => {
    if (!newPassword) return '';
    
    if (validationErrors.length === 0) {
      return 'Strong password! ✓';
    } else if (validationErrors.length <= 2) {
      return 'Medium strength - a few more requirements needed';
    } else {
      return 'Weak password - please follow the guidelines below';
    }
  };

  // Helper function to get password strength class
  const getPasswordStrengthClass = () => {
    if (!newPassword) return '';
    
    if (validationErrors.length === 0) {
      return 'strength-strong';
    } else if (validationErrors.length <= 2) {
      return 'strength-medium';
    } else {
      return 'strength-weak';
    }
  };

  return (
    <div className="password-form-container">
      <h1 className="password-form-heading">Change Your Password</h1>
      
      <div className="info-box">
        <p className="info-box-text">
          <strong>Why change your password?</strong> Regular password updates help keep your account secure.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-section">
          {/* Current Password */}
          <div className="form-group">
            <label htmlFor="currentPassword" className="form-label">
              Current Password
            </label>
            <div className="input-container">
              <input
                id="currentPassword"
                type={passwordVisible ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="form-input"
                required
              />
              <button 
                type="button"
                className="toggle-button"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? "Hide" : "Show"}
              </button>
            </div>
            <p className="help-text">
              This is the password you currently use to log in.
            </p>
          </div>
          
          {/* New Password */}
          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <div className="input-container">
              <input
                id="newPassword"
                type={passwordVisible ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`form-input ${
                  newPassword && validationErrors.length > 0 ? 'input-error' : 
                  newPassword && validationErrors.length === 0 ? 'input-success' : ''
                }`}
                required
              />
              <button 
                type="button"
                className="toggle-button"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? "Hide" : "Show"}
              </button>
            </div>
            
            {newPassword && (
              <div className={`password-strength ${getPasswordStrengthClass()}`}>
                {getPasswordStrength()}
              </div>
            )}
          </div>
          
          {/* Password requirements - appears after user starts typing */}
          {newPassword && (
            <div className="requirements-container">
              <h3 className="requirements-heading">Password Requirements:</h3>
              <ul className="requirements-list">
                {requirements.map((req) => (
                  <li key={req.id} className="requirement-item">
                    <span className={`requirement-icon ${
                      !newPassword ? 'icon-neutral' :
                      req.regex.test(newPassword) ? 'icon-success' : 'icon-error'
                    }`}>
                      {req.regex.test(newPassword) ? '✓' : '✗'}
                    </span>
                    <span className={`requirement-text ${
                      !newPassword ? '' : 
                      req.regex.test(newPassword) ? 'requirement-text-success' : ''
                    }`}>
                      {req.label}
                    </span>
                  </li>
                ))}
              </ul>
              
              <div className="special-chars-container">
                <p className="special-chars-heading">
                  <strong>Suggested special characters:</strong> Click to add to your password
                </p>
                <div className="special-chars-grid">
                  {commonSpecialChars.map(char => (
                    <button
                      key={char}
                      type="button"
                      onClick={() => setNewPassword(newPassword + char)}
                      className="char-button"
                    >
                      {char}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Type Your New Password Again
            </label>
            <div className="input-container">
              <input
                id="confirmPassword"
                type={passwordVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`form-input ${
                  confirmPassword && confirmPassword !== newPassword ? 'input-error' : 
                  confirmPassword && confirmPassword === newPassword ? 'input-success' : ''
                }`}
                required
              />
              <button 
                type="button"
                className="toggle-button"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? "Hide" : "Show"}
              </button>
            </div>
            
            {confirmPassword && (
              <div className={`password-strength ${
                confirmPassword === newPassword ? 'strength-strong' : 'strength-weak'
              }`}>
                {confirmPassword === newPassword 
                  ? "Passwords match! ✓" 
                  : "Passwords don't match. Please try again."}
              </div>
            )}
            
            <p className="help-text">
              For security, we need you to type your new password again to make sure it's correct.
            </p>
          </div>
          
          {/* Form status messages */}
          {formStatus === 'error' && (
            <div className="status-message status-error">
              Please ensure your password meets all requirements.
            </div>
          )}
          {formStatus === 'mismatch' && (
            <div className="status-message status-error">
              Your new passwords don't match. Please try again.
            </div>
          )}
          {formStatus === 'success' && (
            <div className="status-message status-success">
              Success! Your password has been changed.
            </div>
          )}
          
          <button type="submit" className="submit-button">
            Change Password
          </button>
        </div>
      </form>
      
      <div className="help-footer">
        <p className="help-footer-text">
          Need help? Call our support team at 1-800-123-4567
        </p>
      </div>
    </div>
  );
};

export default SeniorFriendlyPasswordForm;