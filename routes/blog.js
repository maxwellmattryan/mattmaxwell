const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const passport = require('passport');
require('../config/passport')(passport);

const Profile = require('../models/profile');
const Post = require('../models/post');
const Topic = require('../models/topic');

// BLOG
router.get('/', (req, res, next) => {
    var blog = {};

    Post.find({})
    .populate('topics')
    .exec((err, posts) => {
        if(err) throw err;

        blog.posts = posts;

        Topic.find({})
        .exec((err, topics) => {
            if(err) throw err;

            blog.topics = topics;
            
            res.status(200).json(blog);
        });
    });

});

// POSTS
router.get('/posts/:uri', (req, res, next) => {
    Post.findOne({uri: req.params.uri})
    .populate('topics')
    .exec((err, post) => {
        if(err) throw err;

        if(post) {
            res.status(200).json(post);
        } else {
            res.sendStatus(204);
        }
    });
});

router.put('/posts/:uri', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const postData = {
        _id:            req.body._id || new mongoose.Types.ObjectId(),
        uri:            req.body.uri,
        title:          req.body.title, 
        subtitle:       req.body.subtitle,
        topics:         req.body.topics,
        author:         req.body.author,
        description:    req.body.description,
        content:        req.body.content,
        imageURL:       req.body.imageURL,
        updated:        Date.now()
    };

    Profile.updateMany({}, {$addToSet: {posts: postData._id}}, (err, result) => {
        if(err) throw err;
    });

    Topic.updateMany({}, {$pull: {posts: postData._id}}, (err, result) => {
        if(err) throw err;
    });
    Topic.updateMany({_id: {$in: postData.topics}}, {$push: {posts: postData._id}}, (err, result) => {
        if(err) throw err;
    });

    Post.updateOne({_id: postData._id}, postData, (err, result) => {
        if(err) throw err;

        if(result.nModified === 0) {
            const newPost = new Post({
                ...postData,
                created: Date.now()
            });

            newPost.save((err, post) => {
                if(err) {
                    res.sendStatus(400);
                } else {    
                    res.sendStatus(201);
                }
            });
        } else {
            res.sendStatus(204);
        }
    });
});

router.delete('/posts/:uri', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    Post.findOneAndDelete({uri: req.params.uri}, (err, post) => {
        if(err) {
            res.sendStatus(400);
        } else {
            Topic.updateMany({}, {$pull: {posts: post._id}}, (err, result) => {
                if(err) throw err;

                else {
                    Profile.updateMany({}, {$pull: {posts: post._id}}, (err, result) => {
                        if(err) throw err;

                        else {
                            res.sendStatus(204);
                        }
                    });
                }
            });
        }
    });
});

// TOPICS
router.get('/topics', (req, res, next) => {
    Topic.find({}, (err, topics) => {
        if(err) throw err;

        res.status(200).json(topics);
    });
});

router.put('/topics/:uri', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const topicData = {
        _id: req.body._id || new mongoose.Types.ObjectId(),
        uri: req.body.uri,
        name: req.body.name,
        description: req.body.description,
        imageURL: req.body.imageURL,
        posts: req.body.posts
    };

    Topic.updateOne({_id: topicData._id}, topicData, (err, result) => {
        if(err) throw err;

        if(result.n === 0) {
            const newTopic = new Topic({...topicData});

            newTopic.save((err, topic) => {
                if(err) {
                    res.sendStatus(400);
                } else {
                    res.sendStatus(201);
                }
            });
        } else {
            res.sendStatus(204);
        }
    });
});

module.exports = router;