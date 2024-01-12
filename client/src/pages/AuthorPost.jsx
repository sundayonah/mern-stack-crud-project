import React, { useEffect, useState } from 'react';
import PostItem from '../components/PostItem';
import Loading from '../components/Loading';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AuthorPost = () => {
   const { id } = useParams();

   const [posts, setPosts] = useState([]);
   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
      const fetchPosts = async () => {
         setIsLoading(true);
         try {
            const response = await axios.get(
               `${process.env.REACT_APP_BASE_URL}/posts/users/${id}`
            );
            setPosts(response?.data);
         } catch (err) {
            console.log(err);
         }
         setIsLoading(false);
      };
      fetchPosts();
   }, [id]);

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

export default AuthorPost;
