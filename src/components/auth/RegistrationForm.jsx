// src/components/auth/RegistrationForm.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { registerUser } from '../../store/authSlice';
import './AuthForms.css';
import './RegistrationForm.css';
import { RiMailFill, RiLockPasswordFill, RiUserFill } from "react-icons/ri";
import { Link } from 'react-router-dom';

const MoneyGuardLogo = () => (
  <img src="/img/Logo.svg" alt="Money Guard Logo" className="app-logo" />
);

const RegistrationForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.warn('Şifreler eşleşmiyor!');
      return;
    }

    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="registration-container">
      <div className="auth-box">
        <header className="auth-header">
          <MoneyGuardLogo />
          <h1 className="app-name">Money Guard</h1>
        </header>

        <form onSubmit={handleRegisterSubmit} className="auth-form">
          
          <div className="input-group">
            <RiUserFill className="input-icon" />
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="İsim"
              required
              aria-label="Enter your name"
            />
          </div>

          <div className="input-group">
            <RiMailFill className="input-icon" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              required
              aria-label="Enter your email address"
            />
          </div>

          <div className="input-group">
            <RiLockPasswordFill className="input-icon" />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre"
              required
              aria-label="Enter your password"
            />
          </div>

          <div className="input-group marg-b">
            <RiLockPasswordFill className="input-icon" />
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Şifreyi onayla"
              required
              aria-label="Confirm your password"
            />
          </div>
          
          <button
            type="submit"
            className="auth-button primary-button"
            disabled={isLoading}
          >
            <span>{isLoading ? 'KAYIT OLUNUYOR...' : 'KAYIT OL'}</span>
          </button>

          <Link 
            to="/login" 
            className="auth-button secondary-button"
            style={isLoading ? { pointerEvents: 'none', opacity: 0.7 } : {}}
          >
            GİRİŞ YAP
          </Link>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;