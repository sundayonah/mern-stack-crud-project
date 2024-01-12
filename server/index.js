require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connect } = require('mongoose');
const upload = require('express-fileupload');

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

app.use(upload());
app.use('/uploads', express.static(__dirname + '/uploads'));

// routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.use(notFound);
app.use(errorHandler);

connect(process.env.MONGO_URI)
   .then(
      app.listen(8080, () =>
         console.log(`Server listening on port ${process.env.PORT || 8080}`)
      )
   )
   .catch((error) => {
      console.log(error);
   });

// app.listen(8000, () => console.log('Server running on port 8000'));
