import React, { useEffect, useState } from 'react';
import { DUMMY_POSTS } from '../data';
import axios from 'axios';
import PostItem from './PostItem';
import Loading from './Loading';

const Posts = () => {
   const [posts, setPosts] = useState([]);
   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
      const fetchPosts = async () => {
         setIsLoading(true);
         try {
            const response = await axios.get(
               `${process.env.REACT_APP_BASE_URL}/posts`
            );
            setPosts(response?.data);
         } catch (err) {
            console.log(err);
         }
         setIsLoading(false);
      };
      fetchPosts();
   }, []);

   if (isLoading) {
      return <Loading />;
   }

   return (
      <section className="posts">
         {posts.length > 0 ? (
            <div className="container posts__container">
               {posts.map(
                  ({
                     _id: id,
                     thumbnail,
                     category,
                     title,
                     desc,
                     creator,
                     createdAt,
                  }) => (
                     <PostItem
                        key={id}
                        postId={id}
                        thumbnail={thumbnail}
                        category={category}
                        title={title}
                        desc={desc}
                        creator={creator}
                        createdAt={createdAt}
                     />
                  )
               )}
            </div>
         ) : (
            <h2 className="center">No posts found</h2>
         )}
      </section>
   );
};

export default Posts;
