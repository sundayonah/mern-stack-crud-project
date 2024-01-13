const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const HttpError = require('../models/errorModel');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

// register a new user
// post : api/users/register
// unprotected
const registerUser = async (req, res, next) => {
   try {
      const { name, email, password, password2 } = req.body;
      if (!name || !email || !password) {
         return next(new HttpError('Fill in all fields.', 422));
      }
      const converEmailToLowerCase = email.toLowerCase();

      const emailExists = await User.findOne({ email: converEmailToLowerCase });
      if (emailExists) {
         return next(new HttpError('Email already exists', 422));
      }
      if (password.trim().length < 6) {
         return next(
            new HttpError('Password should be at least 6 characters long', 422)
         );
      }
      if (password != password2) {
         return next(new HttpError('Password do not match'));
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const addUser = await User.create({
         name,
         email: converEmailToLowerCase,
         password: hashedPassword,
      });
      res.status(201).json(`New user ${addUser.email} registered successfully`);
   } catch (error) {
      return next(new HttpError('error registration failed.', 422));
   }
};

// Login registered user
// post : api/users/login
// unprotected
const loginUser = async (req, res, next) => {
   try {
      const { email, password } = req.body;

      if (!email || !password) {
         return next(new HttpError('Fill in all fields.', 422));
      }

      const newEmail = email.toLowerCase();
      const user = await User.findOne({ email: newEmail });
      if (!user) {
         return next(new HttpError('Invalid credentilas', 422));
      }

      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
         return next(new HttpError('Invalid credentilas', 422));
      }
      const { _id: id, name } = user;
      const token = jwt.sign({ id, name }, process.env.JWT_SECRET, {
         expiresIn: '1d',
      });
      res.status(200).json({ token, id, name });
   } catch (error) {
      return next(
         new HttpError('login failed. please check your Credentials', 422)
      );
   }
};

// user profile
// post : api/users/:id
// protected
const getUser = async (req, res, next) => {
   try {
      const { id } = req.params;
      const user = await User.findById(id).select('-password');
      if (!user) {
         return next(new HttpError('User not found', 404));
      }
      res.status(200).json(user);
   } catch (error) {
      return next(new HttpError(error));
   }
};

// change user avatar
// post : api/users/change-avatar
// protected
const changeAvatar = async (req, res, next) => {
   try {
      if (!req.files.avatar) {
         return next(new HttpError('Please choose an image', 422));
      }

      // find user from database
      const user = await User.findById(req.user.id);

      //delete old avatar if exists
      if (user.avatar) {
         fs.unlink(
            path.join(__dirname, '..', 'uploads', user.avatar),
            (err) => {
               if (err) {
                  return next(new HttpError(err));
               }
            }
         );
      }

      const { avatar } = req.files;
      // check file size
      if (avatar.size > 500000) {
         return next(
            new HttpError('Profile picture too big, Should be less than 500kb'),
            422
         );
      }

      let fileName;
      fileName = avatar.name;
      let splittedFilename = fileName.split('.');
      let newFilename =
         splittedFilename[0] +
         uuid() +
         '.' +
         splittedFilename[splittedFilename.length - 1];
      avatar.mv(
         path.join(__dirname, '..', 'uploads', newFilename),
         async (err) => {
            if (err) {
               return next(new HttpError(err));
            }
            const updateAvatar = await User.findByIdAndUpdate(
               req.user.id,
               { avatar: newFilename },
               { new: true }
            );
            if (!updateAvatar) {
               return next(new HttpError('Avatar could not be change', 422));
            }
            res.status(200).json(updateAvatar);
         }
      );
   } catch (error) {
      return next(new HttpError(error));
   }
};

// edit user details from profile
// post : api/users/edit-user
// protected
const editUser = async (req, res, next) => {
   try {
      const { name, email, currentPassword, newPassword, confirmNewPassword } =
         req.body;
      if (
         !name ||
         !email ||
         !currentPassword ||
         !newPassword ||
         !confirmNewPassword
      ) {
         return next(new HttpError('Fill in all fields', 422));
      }
      // get user from database
      const user = await User.findById(req.user.id);
      if (!user) {
         return next(new HttpError('User not found.', 403));
      }

      // make sure new email doesnt already exist
      const emailExists = await User.findOne({ email });
      // we want to update other details with/without changing the email (which is a unique id because we use it to login)

      if (emailExists && emailExists._id != req.user.id) {
         return next(new HttpError('Email already exists.', 422));
      }

      //compare current password to db password
      const validateUserPassword = await bcrypt.compare(
         currentPassword,
         user.password
      );
      if (!validateUserPassword) {
         return next(new HttpError('Invalid current password.', 422));
      }

      //compare new passwords
      if (newPassword !== confirmNewPassword) {
         return next(new HttpError('New passwords do not match', 422));
      }

      //hash new password
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newPassword, salt);

      // update user info in db
      const newInfo = await User.findByIdAndUpdate(
         req.user.id,
         { name, email, password: hash },
         { new: true }
      );
      res.status(200).json(newInfo);
   } catch (error) {
      return next(new HttpError('error updating user', 422));
   }
};

// get authors
// post : api/users/get-authors
// unprotected
const getAuthors = async (req, res, next) => {
   try {
      const authors = await User.find().select('-password');
      res.json(authors);
   } catch (error) {
      return next(new HttpError(error));
   }
};

module.exports = {
   registerUser,
   getAuthors,
   loginUser,
   getUser,
   changeAvatar,
   editUser,
};
