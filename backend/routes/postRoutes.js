const express = require('express');
const router=express.Router();

const { newPost, getPost, updatePost,deletePost, getAllPostsByUser, likePost, unlikePost, addComment, deleteComment, getAllPosts}=require('../controllers/postController');

const {isAuthenticated, authorize} = require('../middlewares/auth')

router.route('/post/create').post(isAuthenticated,newPost);
router.route('/post/:id').get(isAuthenticated,getPost);
router.route('/post/update/:id').put(isAuthenticated,updatePost);
router.route('/post/delete/:id').delete(isAuthenticated ,deletePost);
router.route('/posts/byuser/:id').get(isAuthenticated,getAllPostsByUser);
router.route('/post/like/:id').put(isAuthenticated,likePost);
router.route('/post/unlike/:id').put(isAuthenticated,unlikePost);
router.route('/post/comment/:id').put(isAuthenticated,addComment);
router.route('/post/delcomment/:id').delete(isAuthenticated,deleteComment);
router.route('/posts/all').get(isAuthenticated,getAllPosts);

module.exports = router;
