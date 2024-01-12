import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { UserContext } from '../context/userContext';

const Login = () => {
   const [userData, setUserData] = useState({
      email: '',
      password: '',
   });

   const [error, setError] = useState('');
   const navigate = useNavigate();

   const { setCurrentUser } = useContext(UserContext);

   const changeInputHandler = (e) => {
      setUserData((prevState) => {
         return { ...prevState, [e.target.name]: e.target.value };
      });
   };

   const LoginUser = async (e) => {
      e.preventDefault();
      setError('');
      try {
         const response = await axios.post(
            'http://localhost:8080/api/users/login',
            userData
         );
         const user = await response.data;
         setCurrentUser(user);
         //  if (!user) {
         //     setError('Could not register user. Please try again.');
         //  }
         navigate('/');
      } catch (err) {
         setError(err.response.data.message);
      }
   };

   return (
      <section className="register">
         <div className="container">
            <h2>Sign In </h2>
            <form className="form register__form" onSubmit={LoginUser}>
               {error && <p className="form__error-message">{error}</p>}

               <input
                  type="text"
                  placeholder="Email"
                  name="email"
                  value={userData.email}
                  onChange={changeInputHandler}
                  autoFocus
               />
               <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={userData.password}
                  onChange={changeInputHandler}
               />

               <button type="submit" className="btn primary">
                  Login
               </button>
            </form>
            <small>
               Dont have an account? <Link to="/register">sign up</Link>
            </small>
         </div>
      </section>
   );
};

export default Login;
