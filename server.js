require('./backend/models/postsModel');
require('./backend/models/commentsModel');
require('./backend/models/goalsModel');
require('./backend/models/userModel');

// Library IMPORTS
const mongoose = require('mongoose');
const xss = require('xss-clean');
const keys = require('./backend/keys/keys');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const notFound = 404;
const port = 8001;

const commentRouter = require('./backend/routes/commentRoutes');
const postsRouter = require('./backend/routes/postRoutes');
const goalsRouter = require('./backend/routes/goalRoutes');
const userRouter = require('./backend/routes/UserRoutes');
const authRouter = require('./backend/routes/authRoutes');
const authenticate = require('./backend/middlewares/authentication');
const loginRouter = require('./backend/routes/loginRoutes');

const limiter = rateLimit({
    max: 100,
    windowMs: 100 * 60 * 100,
    message: 'Too mamy requests, please try again later'
});

app.use(bodyParser.json());
app.use(express.json({limit: '27mb'}));
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev')); // Use logger
app.use(express.static('public'));
app.use(mongoSanitize());
app.use(cors());
app.use(limiter); // Use the rate limiter


// Use Middleware Routes
app.use('/api/v1/momentone/comments', commentRouter);
app.use('/api/v1/momentone/posts', postsRouter);
app.use('/api/v1/momentone/goals', goalsRouter);
app.use('/api/v1/momentone/users', userRouter);
app.use('/api/v1/momentone/register', authRouter);
app.use('/api/v1/momentone/signin', authenticate, loginRouter);

app.all('*', (request, response, next) => {
    return response.status(notFound).json({
        message: `Could not find ${request.originalUrl} on this route`
    });
})

mongoose.connect(keys.mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    return console.log('Connected to MongoDB instance');
});

mongoose.connection.on('error', (error) => {
    return console.error('Error connecting to MongoDB -> reason : ', error);
});

app.listen(port, (error) => { // Listen for requests on the specified port

    if(!error) {
        return console.log(`Listening for requests on port ${port}`);
    }

    else {
        return console.error(error);
    }
});