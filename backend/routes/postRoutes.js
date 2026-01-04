import express from 'express';
import { getPosts, createPost, deletePost, getMyPosts } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.route('/').get(getPosts).post(protect, createPost);

router.get('/me', protect, getMyPosts);

router.route('/:id').delete(protect, deletePost);

export default router;