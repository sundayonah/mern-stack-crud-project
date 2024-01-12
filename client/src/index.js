import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import PostDetails from './pages/PostDetails';
import Register from './pages/Register';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import Authors from './pages/Authors';
import CreatePost from './pages/CreatePost';
import CategoryPost from './pages/CategoryPost';
import AuthorPost from './pages/AuthorPost';
import DashBoard from './pages/DashBoard';
import EditPost from './pages/EditPost';
import Logout from './pages/Logout';
import DeletePost from './pages/DeletePost';
import UserProvider from './context/userContext';

const router = createBrowserRouter([
   {
      path: '/',
      element: (
         <UserProvider>
            <Layout />
         </UserProvider>
      ),
      errorElement: <ErrorPage />,
      //       // children:[]
      children: [
         { index: true, element: <Home /> },
         { path: 'posts/:id', element: <PostDetails /> },
         { path: 'register', element: <Register /> },
         { path: 'login', element: <Login /> },
         { path: 'profile/:id', element: <UserProfile /> },
         { path: 'authors', element: <Authors /> },
         { path: 'create', element: <CreatePost /> },
         { path: 'posts/categories/:category', element: <CategoryPost /> },
         { path: 'posts/users/:id', element: <AuthorPost /> },
         { path: 'myposts/:id', element: <DashBoard /> },
         { path: 'posts/:id/edit', element: <EditPost /> },
         { path: 'posts/:id/delete', element: <DeletePost /> },
         { path: 'logout', element: <Logout /> },
      ],
   },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <React.StrictMode>
      <RouterProvider router={router} />
   </React.StrictMode>
);
