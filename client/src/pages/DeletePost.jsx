import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import Loading from '../components/Loading';

const DeletePost = ({ postId: id }) => {
   const navigate = useNavigate();
   const location = useLocation();

   const { currentUser } = useContext(UserContext);
   const token = currentUser?.token;
   const [isLoading, setIsLoading] = useState(false);

   // redirect to login page for any user who is not login
   useEffect(() => {
      if (!token) {
         navigate('/login');
      }
   }, []);

   const removePost = async () => {
      setIsLoading(true);
      try {
         const response = await axios.delete(
            `${process.env.REACT_APP_BASE_URL}/posts/${id}`,
            // `http://localhost:8080/api/posts/${id}`,
            {
               withCredentials: true,
               headers: { Authorization: `Bearer ${token}` },
            }
         );
         if (response.status === 200) {
            if (location.pathname === `/myposts/${currentUser.id}`) {
               navigate(0);
            } else {
               navigate('/');
            }
         }
      } catch (error) {
         console.log('Could not delete post');
      }
      setIsLoading(false);
   };

   if (isLoading) {
      return <Loading />;
   }

   return (
      <Link className="btn sm danger" onClick={() => removePost(id)}>
         Delete
      </Link>
   );
};

export default DeletePost;
