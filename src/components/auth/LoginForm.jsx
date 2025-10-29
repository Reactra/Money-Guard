// src/components/auth/LoginForm.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/authSlice';
import './AuthForms.css';
import './LoginForm.css';
import { RiMailFill, RiLockPasswordFill } from "react-icons/ri";
import { Link } from 'react-router-dom';

const MoneyGuardLogo = () => (
  <img src="/img/Logo.svg" alt="Money Guard Logo" className="app-logo" />
);

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  
  const { isLoading } = useSelector((state) => state.auth);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="login-container">
      <div className="auth-box">
        <header className="auth-header">
          <MoneyGuardLogo />
          <h1 className="app-name">Money Guard</h1>
        </header>

        <form onSubmit={handleLoginSubmit} className="auth-form">
          
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
          <div className="input-group marg-b">
            <RiLockPasswordFill className="input-icon" />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              aria-label="Enter your password"
            />
          </div>
          <button type="submit" className="auth-button primary-button" disabled={isLoading}>
            <span>{isLoading ? 'YÜKLENİYOR...' : 'GİRİŞ YAP'}</span>
          </button>
          <Link to="/register" className="auth-button secondary-button">
            KAYIT OL
          </Link>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;