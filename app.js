const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const notFound = 404;

// Routes Imports
const commentRouter = require('./backend/routes/commentRoutes');
const postsRouter = require('./backend/routes/postRoutes');
const goalsRouter = require('./backend/routes/goalRoutes');
const userRouter = require('./backend/routes/UserRoutes');
const therapistRouter = require('./backend/routes/therapistRoutes');

app.use(bodyParser.json());
app.use(express.json({limit: '27mb'}));
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev')); // Use logger
app.use(express.static('public'));
app.use(cors());

// Use Middleware Routes
app.use('/api/v1/momentone/comments', commentRouter);
app.use('/api/v1/momentone/posts', postsRouter);
app.use('/api/v1/momentone/goals', goalsRouter);
app.use('/api/v1/momentone/users', userRouter);
app.use('/api/v1/momentone/therapist', therapistRouter);

app.all('*', (request, response, next) => {
    return response.status(notFound).json({
        message: `Could not find ${request.originalUrl} on this route`
    });
})

module.exports = app; // Export the app