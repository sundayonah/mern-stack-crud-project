import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiBars3BottomLeft } from 'react-icons/hi2';
import { RxCross2 } from 'react-icons/rx';
import { ImCross } from 'react-icons/im';
import { UserContext } from '../context/userContext';

const Header = () => {
   const [isNavShowing, setIsNavShowing] = useState(
      window.innerWidth > 800 ? true : false
   );

   const { currentUser } = useContext(UserContext);

   const closeNav = () => {
      if (window.innerWidth < 800) {
         setIsNavShowing(false);
      } else {
         setIsNavShowing(true);
      }
   };
   return (
      <nav>
         <div className="container nav__container">
            <Link to="/" className="nav__logo" onClick={closeNav}>
               <img
                  src="https://onahsunday.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmy-avatar.be8f261b.png&w=256&q=75"
                  alt=""
               />
            </Link>
            {currentUser?.id && isNavShowing && (
               <ul className="nav__menu">
                  <li>
                     <Link to={`/profile/${currentUser.id}`} onClick={closeNav}>
                        {currentUser?.name}
                     </Link>
                  </li>
                  <li>
                     <Link to="/create" onClick={closeNav}>
                        Create Post
                     </Link>
                  </li>
                  <li>
                     <Link to="/authors" onClick={closeNav}>
                        Authors
                     </Link>
                  </li>
                  <li>
                     <Link to="/logout" onClick={closeNav}>
                        Logout
                     </Link>
                  </li>
               </ul>
            )}
            {!currentUser?.id && isNavShowing && (
               <ul className="nav__menu">
                  <li>
                     <Link to="/authors" onClick={closeNav}>
                        Authors
                     </Link>
                  </li>
                  <li>
                     <Link to="/login" onClick={closeNav}>
                        Login
                     </Link>
                  </li>
               </ul>
            )}

            <button
               className="nav__toggle-btn"
               onClick={() => setIsNavShowing(!isNavShowing)}
            >
               {isNavShowing ? <ImCross /> : <HiBars3BottomLeft />}
            </button>
         </div>
      </nav>
   );
};

export default Header;
