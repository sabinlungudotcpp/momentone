require('./backend/models/Posts');
const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 8020;
const keys = require('./backend/keys/keys');
const Post = mongoose.model('Post');

app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(cors());

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


app.get('/api/v1/momentone/posts', async (request, response) => {
    try {
        const method = request.method;

        if(method === 'GET') {
            const allPosts = await Post.find();
            return response.json({allPosts});
        }
    } 
    
    catch(error) {

    }
});

app.get('/api/v1/momentone/posts/:id', async (request, response) => {
    try {
        const method = request.method;
        
        if(method === 'GET') {
            const id = request.params.id;
            const postId = await Post.findById(id);

            return response.status(200).json({postId});
        }
    } 
    
    catch(error) {
        if(error) {
            return response.json({
                message: error.message
            });
        }
    }
});

app.post('/api/v1/momentone/posts', async (request, response) => {
    try {
        const method = request.method;
        const {title, description} = request.body;

        if(!title || !description) { // If there is no title or description
            return response.status(500).json({
                message: 'You must provide a post title and description'
            });
        }
        
        if(method === 'POST') {
            const newPost = new Post({title, description});
            await newPost.save();

            return response.status(201).json({
                newPost,
                createdAt: Date.now()
            });
        }
    } 
    
    catch(error) {
        if(error) {
            return console.error(error);
        }
    }
});

app.patch('/api/v1/momentone/posts/:id', async (request, response) => {
    try {
        const method = request.method;
        const id = request.params.id;

        if(method === 'PATCH') {
              const updatedPost = await Post.findByIdAndUpdate(id, request.body);
            
            return response.json({
                updatedPost
            });
            
        }
    } 
    
    catch(error) {
        if(error) {
            return response.status(422).json({
                error: error.message
            });
        }
    }
});

app.delete('/api/v1/momentone/posts', async (request, response) => {
    try {
        const method = request.method;

        if(method === 'DELETE') {
            await Post.deleteMany();
            
            return response.status(200).json({

                message: 'All posts deleted successfully'
            });
        }
    } 
    
    catch(error) {
        if(error) {
            return response.status(500).json({
                message: error.message
            });
        }
    }
});

app.delete('/api/v1/momentone/posts/:id', async (request, response) => {
    try {
        const method = request.method;
        const id = request.params.id;

        if(method === 'DELETE') {
            await Post.findByIdAndDelete(id, request.body);
            return response.status(200).json({
                message: 'Post deleted successfully'
            })
        }
    } 
    
    catch(error) {

    }
})

app.listen(port, (error) => {
    if(!error) {
        return console.log(`Listening for requests on port ${port}`);
    }

    else {
        return console.error(error);
    }
});