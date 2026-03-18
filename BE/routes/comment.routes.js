const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const authenticateToken = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Blog comment APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - content
 *         - user_id
 *         - blog_id
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated comment ID
 *         content:
 *           type: string
 *           description: Comment content
 *           example: "This article is very helpful and informative!"
 *         user_id:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             full_name:
 *               type: string
 *               example: "John Doe"
 *             profilePicture:
 *               type: string
 *         blog_id:
 *           type: string
*           description: Blog ID
 *         parent_id:
 *           type: string
 *           description: Parent comment ID (if it is a reply)
 *         replies:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *           description: Reply list
 *         likeCount:
 *           type: integer
 *           default: 0
 *           description: Like count
 *         isLiked:
 *           type: boolean
 *           description: Whether the current user has liked it
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Created time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last updated time
 *     CommentInput:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           description: Comment content
 *           example: "This article is very helpful and informative!"
 *         blog_id:
 *           type: string
*           description: Blog ID (for the /comments route)
 *           example: "507f1f77bcf86cd799439011"
 *         parent_id:
 *           type: string
 *           description: Parent comment ID (for replies)
 *           example: "507f1f77bcf86cd799439012"
 *     CommentListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *         total:
 *           type: integer
 *           example: 15
 *         page:
 *           type: integer
 *           example: 1
 *         pages:
 *           type: integer
 *           example: 2
 */

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Create a new comment (blog_id in body)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - blog_id
 *             properties:
 *               content:
 *                 type: string
 *                 description: Comment content
 *                 example: "This article is very helpful and informative!"
 *               blog_id:
 *                 type: string
*                 description: Blog ID
 *                 example: "507f1f77bcf86cd799439011"
 *               parent_id:
 *                 type: string
 *                 description: Parent comment ID (for replies)
 *                 example: "507f1f77bcf86cd799439012"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *                 message:
 *                   type: string
 *                   example: "Comment created successfully"
 *       400:
 *         description: Missing content or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Comment content is required"
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Blog or parent comment not found
 *       500:
 *         description: Server error
 */
router.post("/comments", authenticateToken, commentController.createComment);

/**
 * @swagger
 * /api/comments/{blogId}:
 *   get:
 *     summary: Get the blog comment list
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
*         description: Blog ID
 *         example: "507f1f77bcf86cd799439011"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Current page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of comments per page
 *     responses:
 *       200:
 *         description: Comment list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentListResponse'
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router.get("/comments/:blogId", commentController.getCommentsByBlog);

/**
 * @swagger
 * /api/blogs/{id}/comments:
 *   post:
 *     summary: Add a comment to a blog (blog_id in URL)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
*         description: Blog ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Comment content
 *                 example: "This article is very helpful and informative!"
 *               parent_id:
 *                 type: string
 *                 description: Parent comment ID (for replies)
 *                 example: "507f1f77bcf86cd799439012"
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *                 message:
 *                   type: string
 *                   example: "Comment created successfully"
 *       400:
 *         description: Missing content
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router.post(
  "/blogs/:id/comments",
  authenticateToken,
  commentController.createComment
);

/**
 * @swagger
 * /api/blogs/{id}/comments:
 *   get:
 *     summary: Get the blog comment list (blog_id in URL)
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
*         description: Blog ID
 *         example: "507f1f77bcf86cd799439011"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Current page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of comments per page
 *     responses:
 *       200:
 *         description: Comment list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentListResponse'
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router.get("/blogs/:id/comments", commentController.getCommentsByBlog);

/**
 * @swagger
 * /api/comments/{id}/reply:
 *   post:
 *     summary: Reply to a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Parent comment ID
 *         example: "507f1f77bcf86cd799439012"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Reply content
 *                 example: "Thank you!"
 *     responses:
 *       201:
 *         description: Reply created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *                 message:
 *                   type: string
 *                   example: "Reply created successfully"
 *       400:
 *         description: Missing content
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Parent comment not found
 *       500:
 *         description: Server error
 */
router.post(
  "/comments/:id/reply",
  authenticateToken,
  commentController.replyToComment
);

/**
 * @swagger
 * /api/comments/{id}/like:
 *   post:
 *     summary: Like a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *         example: "507f1f77bcf86cd799439012"
 *     responses:
 *       200:
 *         description: Liked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Comment liked successfully"
 *       400:
 *         description: Already liked
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.post(
  "/comments/:id/like",
  authenticateToken,
  commentController.likeComment
);

/**
 * @swagger
 * /api/comments/{id}/unlike:
 *   post:
 *     summary: Unlike a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *         example: "507f1f77bcf86cd799439012"
 *     responses:
 *       200:
 *         description: Unliked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Comment unliked successfully"
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.post(
  "/comments/:id/unlike",
  authenticateToken,
  commentController.unlikeComment
);

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *         example: "507f1f77bcf86cd799439012"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: New content
 *                 example: "Updated content"
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *                 message:
 *                   type: string
*                   example: "Comment updated successfully"
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthenticated
 *       403:
*         description: No permission to update
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.put("/comments/:id", authenticateToken, commentController.updateComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *         example: "507f1f77bcf86cd799439012"
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Comment deleted successfully"
 *       401:
 *         description: Unauthenticated
 *       403:
*         description: No permission to delete
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/comments/:id",
  authenticateToken,
  commentController.deleteComment
);

module.exports = router;
