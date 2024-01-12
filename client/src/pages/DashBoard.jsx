import React, { useContext, useEffect, useState } from 'react';
import { DUMMY_POSTS } from '../data';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import Loading from '../components/Loading';
import DeletePost from './DeletePost';

const DashBoard = () => {
   const [posts, setPosts] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const { id } = useParams();

   const navigate = useNavigate();

   const { currentUser } = useContext(UserContext);
   const token = currentUser?.token;

   // redirect to login page for any user who is not login.
   useEffect(() => {
      if (!token) navigate('/login');
   }, []);

   useEffect(() => {
      const fetchPost = async () => {
         setIsLoading(true);
         try {
            const response = await axios.get(
               `${process.env.REACT_APP_BASE_URL}/posts/users/${id}`,
               {
                  withCredentials: true,
                  headers: { Authorization: `Bearer ${token}` },
               }
            );
            setPosts(response.data);
         } catch (error) {
            console.log(error);
         }
         setIsLoading(false);
      };
      fetchPost();
   }, [id, token]);

   if (isLoading) {
      return <Loading />;
   }

   return (
      <section className="dashboard">
         {posts.length ? (
            <div className="container dashboard__container">
               {posts.map((post) => {
                  return (
                     <article key={post._id} className="dashboard__post">
                        <div className="dashboard__post-info">
                           <div className="dashboard__post-thumbnail">
                              <img
                                 src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`}
                                 alt={post.name}
                              />
                           </div>
                           <h5>{post.title}</h5>
                        </div>
                        <div className="dashboard__post-action">
                           <Link to={`/posts/${post._id}`} className="btn sm">
                              View
                           </Link>
                           <Link
                              to={`/posts/${post._id}/edit`}
                              className="btn sm primary"
                           >
                              Edit
                           </Link>
                           <DeletePost postId={post._id} />
                        </div>
                     </article>
                  );
               })}
            </div>
         ) : (
            <h2 className="center">You have no posts yet</h2>
         )}
      </section>
   );
};

export default DashBoard;
