import axios from 'axios';
import React, { useEffect } from 'react';

const Resting = () => {
   // https://mern-stack-server-side.vercel.app/api/posts

   useEffect(() => {
      const fetchPosts = async () => {
         //    setIsLoading(true);
         try {
            const response = await axios.get(
               'https://mern-stack-server-side.vercel.app/api/posts'
            );
            console.log(response);
            //   setPosts(response?.data);
         } catch (err) {
            console.log(err);
         }
         //    setIsLoading(false);
      };
      fetchPosts();
   }, []);

   return <div>Resting</div>;
};

export default Resting;
