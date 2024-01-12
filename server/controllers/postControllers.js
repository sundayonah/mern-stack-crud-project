const User = require('../models/userModel');
const Post = require('../models/postModel');
const bcrypt = require('bcryptjs');
const HttpError = require('../models/errorModel');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');
const { response } = require('express');

const createPost = async (req, res, next) => {
   try {
      let { title, category, desc } = req.body;
      if (!title || !category || !desc || !req.files) {
         return next(
            new HttpError('Fill in all fields and choose thumbnails.', 422)
         );
      }
      const { thumbnail } = req.files;
      // chech the file size
      if (thumbnail.size > 2000000) {
         new HttpError('Thumbnail too big. file should be less than 2mb.');
      }
      let fileName = thumbnail.name;
      let splittedFilename = fileName.split('.');
      let newFilename =
         splittedFilename[0] +
         uuid() +
         '.' +
         splittedFilename[splittedFilename.length - 1];
      thumbnail.mv(
         path.join(__dirname, '..', '/uploads', newFilename),
         async (err) => {
            if (err) {
               return next(new HttpError(err));
            } else {
               const newPost = await Post.create({
                  title,
                  category,
                  desc,
                  thumbnail: newFilename,
                  creator: req.user.id,
               });
               if (!newPost) {
                  return next(new HttpError('post could not be created.', 422));
               }
               // find user and increase post count by 1
               const currentUser = await User.findById(req.user.id);
               const userPostCount = currentUser.posts + 1;
               await User.findByIdAndUpdate(req.user.id, {
                  posts: userPostCount,
               });

               res.status(201).json(newPost);
            }
         }
      );
   } catch (error) {
      return next(new HttpError(error));
   }
};

const getPosts = async (req, res, next) => {
   try {
      const posts = await Post.find().sort({ updatedAt: -1 });
      res.status(200).json(posts);
   } catch (error) {
      return next(new HttpError(error));
   }
};

const getPost = async (req, res, next) => {
   try {
      const postId = req.params.id;
      const post = await Post.findById(postId);
      if (!post) {
         return next(new HttpError('Post Not Found', 404));
      }
      res.status(200).json(post);
   } catch (error) {
      return next(new HttpError(error));
   }
};

const getCatPosts = async (req, res, next) => {
   try {
      const { category } = req.params;
      const catPost = await Post.find({ category }).sort({ createdAt: -1 });
      res.status(200).json(catPost);
   } catch (error) {
      return next(new HttpError(error));
   }
};

const getUserPosts = async (req, res, next) => {
   try {
      const { id } = req.params;
      const posts = await Post.find({ creator: id }).sort({
         createdAt: -1,
      });
      res.status(200).json(posts);
   } catch (error) {
      return next(new HttpError(error));
   }
};

const editPost = async (req, res, next) => {
   try {
      let fileName;
      let newFilename;
      let updatedPost;

      const postId = req.params.id;
      let { title, category, desc } = req.body;

      if (!title || !category || desc.length < 12) {
         return next(new HttpError('fill in all fields', 422));
      }
      // get old post from db
      const oldPost = await Post.findById(postId);
      if (req.user.id == oldPost.creator) {
         if (!req.files) {
            updatedPost = await Post.findByIdAndUpdate(
               postId,
               { title, category, desc },
               { new: true }
            );
         } else {
            // delete old thumbnail from upload
            fs.unlink(
               path.join(__dirname, '..', 'uploads', oldPost.thumbnail),
               async (err) => {
                  if (err) {
                     return next(new HttpError(err));
                  }
               }
            );
            const { thumbnail } = req.files;
            // upload new thumbnail
            if (thumbnail.size > 2000000) {
               new HttpError(
                  'Thumbnail too big. file should be less than 2mb.'
               );
            }
            fileName = thumbnail.name;
            let splittedFilename = fileName.split('.');
            newFilename =
               splittedFilename[0] +
               uuid() +
               '.' +
               splittedFilename[splittedFilename.length - 1];
            thumbnail.mv(
               path.join(__dirname, '..', '/uploads', newFilename),
               async (err) => {
                  if (err) {
                     return next(new HttpError(err));
                  }
               }
            );
            updatedPost = await Post.findByIdAndUpdate(
               postId,
               {
                  title,
                  category,
                  desc,
                  thumbnail: newFilename,
               },
               { new: true }
            );
         }
      }
      if (!updatedPost) {
         return next(new HttpError('could not update post', 400));
      }
      res.status(200).json(updatedPost);
   } catch (error) {
      return next(new HttpError(error));
   }
};

const deletePost = async (req, res, next) => {
   try {
      const postId = req.params.id;
      if (!postId) {
         return next(new HttpError('Post Unavailable.', 400));
      }
      const post = await Post.findById(postId);
      const fileName = post?.thumbnail;
      if (req.user.id == post.creator) {
         //delete thumbnail from uploads folder
         fs.unlink(
            path.join(__dirname, '..', 'uploads', fileName),
            async (err) => {
               if (err) {
                  return next(new HttpError(err));
               } else {
                  await Post.findByIdAndDelete(postId);

                  // find user and reduce post count by 1
                  const currentUser = await User.findById(req.user.id);
                  const userPostCount = currentUser?.posts - 1;
                  await User.findByIdAndUpdate(req.user.id, {
                     posts: userPostCount,
                  });
                  res.json(`Post ${postId} deleted successfully`);
               }
            }
         );
      } else {
         return next(new HttpError('Post could not be deleted', 403));
      }
   } catch (error) {
      return next(new HttpError(error));
   }
};

module.exports = {
   createPost,
   deletePost,
   editPost,
   getPost,
   getPosts,
   getCatPosts,
   getUserPosts,
};
