import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth.css';

const RegisterChoice = () => {
  return (
    <div className="auth-page">
      <div className="register-choice">
        <h2>Register</h2>
        <div className="choice-buttons">
          <Link to="/register/customer"><button>Register as Customer</button></Link>
          <Link to="/register/vendor"><button>Register as Vendor</button></Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterChoice;
