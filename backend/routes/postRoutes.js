import express from 'express';
import { getPosts, createPost, deletePost } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.route('/').get(getPosts).post(protect, createPost);

router.route('/:id').delete(protect, deletePost);

export default router;