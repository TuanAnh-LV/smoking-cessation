const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog.controller");
const authenticateToken = require("../middlewares/auth.middleware");
const authOrGuest = require("../middlewares/authOrGuest");
const {
  uploadImages,
  handleUploadError,
} = require("../middlewares/upload.middleware");

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog sharing management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BlogImage:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           description: Image URL
 *           example: "https://res.cloudinary.com/example/image/upload/v1234567890/blog-images/image.jpg"
 *         public_id:
 *           type: string
 *           description: Cloudinary public ID
 *           example: "blog-images/image"
 *         caption:
 *           type: string
 *           description: Image caption
 *           example: "Illustration image"
 *     Blog:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - author_id
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated blog ID
 *         title:
 *           type: string
 *           description: Blog title
 *           example: "Effective guide to quitting smoking"
 *         description:
 *           type: string
 *           description: Short description
 *           example: "Scientific methods that help you quit smoking successfully"
 *         content:
 *           type: string
 *           description: Blog content
 *           example: "Detailed content about how to quit smoking..."
 *         author_id:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             full_name:
 *               type: string
 *               example: "John Doe"
 *             profilePicture:
 *               type: string
 *         status:
 *           type: string
 *           enum: [draft, published]
 *           default: published
 *           description: Blog status
 *         category:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *               example: "Health"
 *             slug:
 *               type: string
 *               example: "suc-khoe"
 *         tags:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *               name:
 *                 type: string
 *                 example: "Quit Smoking"
 *               slug:
 *                 type: string
 *                 example: "bo-thuoc"
 *         images:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BlogImage'
 *         isFeatured:
 *           type: boolean
 *           default: false
 *           description: Featured blog
 *         viewCount:
 *           type: integer
 *           default: 0
 *           description: View count
 *         likeCount:
 *           type: integer
 *           default: 0
 *           description: Like count
 *         commentCount:
 *           type: integer
 *           default: 0
 *           description: Comment count
 *         isLiked:
 *           type: boolean
 *           description: Whether the current user has liked it
 *         shared_badges:
 *           type: array
 *           items:
 *             type: string
 *           description: List of shared badges
 *         published_at:
 *           type: string
 *           format: date-time
 *           description: Published time
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Created time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last updated time
 *     BlogInput:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         title:
 *           type: string
 *           description: Blog title
 *           example: "Effective guide to quitting smoking"
 *         description:
 *           type: string
 *           description: Short description
 *           example: "Scientific methods that help you quit smoking successfully"
 *         content:
 *           type: string
 *           description: Blog content
 *           example: "Detailed content about how to quit smoking..."
 *         status:
 *           type: string
 *           enum: [draft, published]
 *           default: published
 *         category:
 *           type: string
 *           description: Category ID
 *           example: "507f1f77bcf86cd799439011"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: List of tag IDs
 *           example: ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"]
 *         isFeatured:
 *           type: boolean
 *           default: false
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *           description: Blog images
 *     BlogListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         blogs:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Blog'
 *         total:
 *           type: integer
 *           example: 25
 *         page:
 *           type: integer
 *           example: 1
 *         pages:
 *           type: integer
 *           example: 3
 *         limit:
 *           type: integer
 *           example: 10
 */

/**
 * @swagger
 * /api/blogs:
 *   post:
 *     summary: Create a new blog with images
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *                 description: Blog title
 *                 example: "Effective guide to quitting smoking"
 *               description:
 *                 type: string
 *                 description: Short description
 *                 example: "Scientific methods that help you quit smoking successfully"
 *               content:
 *                 type: string
 *                 description: Blog content
 *                 example: "Detailed content about how to quit smoking..."
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *                 default: published
 *               category:
 *                 type: string
 *                 description: Category ID
 *                 example: "507f1f77bcf86cd799439011"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of tag IDs
 *               isFeatured:
 *                 type: boolean
 *                 default: false
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Blog images (maximum 10 images)
 *     responses:
 *       201:
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 blog:
 *                   $ref: '#/components/schemas/Blog'
 *                 message:
 *                   type: string
 *                   example: "Blog created successfully"
 *       400:
 *         description: Missing data or upload error
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
 *                   example: "Title and content are required"
 *       401:
 *         description: Unauthenticated
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  authenticateToken,
  uploadImages,
  handleUploadError,
  blogController.createBlog
);

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Get the blog list with advanced filters
 *     tags: [Blogs]
 *     parameters:
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
 *         description: Number of blogs per page
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Author ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published]
 *         description: Blog status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title, content, or description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category ID
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: ID tag
 *       - in: query
 *         name: isFeatured
 *         schema:
 *           type: boolean
 *         description: Filter featured blogs
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest, featured, popular]
 *         description: Sort by (newest, oldest, featured, most viewed)
 *     responses:
 *       200:
 *         description: Blog list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogListResponse'
 *       500:
 *         description: Server error
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
 *                   example: "Server error"
 */
router.get("/", authOrGuest, blogController.getBlogs);

/**
 * @swagger
 * /api/blogs/my:
 *   get:
 *     summary: Get the current user's blog list
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Number of blogs per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published]
 *         description: Blog status
 *     responses:
 *       200:
 *         description: List of the user's blogs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogListResponse'
 *       401:
 *         description: Unauthenticated
 *       500:
 *         description: Server error
 */
router.get("/my", authenticateToken, blogController.getMyBlogs);

/**
 * @swagger
 * /api/blogs/{id}:
 *   get:
 *     summary: Get blog details
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
*         description: Blog ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Blog details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 blog:
 *                   $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Not found
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
 *                   example: "Blog not found"
 *       500:
 *         description: Server error
 */
router.get("/:id", authOrGuest, blogController.getBlogById);

/**
 * @swagger
 * /api/blogs/{id}:
 *   put:
 *     summary: Update blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
*         description: Blog ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Blog title
 *               description:
 *                 type: string
 *                 description: Short description
 *               content:
 *                 type: string
 *                 description: Blog content
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *               category:
 *                 type: string
 *                 description: Category ID
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of tag IDs
 *               isFeatured:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: New images
 *     responses:
 *       200:
 *         description: Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 blog:
 *                   $ref: '#/components/schemas/Blog'
 *                 message:
 *                   type: string
*                   example: "Blog updated successfully"
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthenticated
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */
router.put(
  "/:id",
  authenticateToken,
  uploadImages,
  handleUploadError,
  blogController.updateBlog
);

/**
 * @swagger
 * /api/blogs/{id}:
 *   delete:
 *     summary: Delete blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
*         description: Blog ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Deleted successfully
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
 *                   example: "Blog deleted successfully"
 *       401:
 *         description: Unauthenticated
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */
router.delete("/:id", authenticateToken, blogController.deleteBlog);

/**
 * @swagger
 * /api/blogs/{blogId}/images/{imageIndex}:
 *   delete:
 *     summary: Delete an image from a blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
*         description: Blog ID
 *         example: "507f1f77bcf86cd799439011"
 *       - in: path
 *         name: imageIndex
 *         required: true
 *         schema:
 *           type: integer
 *         description: Index of the image in the array (starting from 0)
 *         example: 0
 *     responses:
 *       200:
 *         description: Image deleted successfully
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
 *                   example: "Image deleted successfully"
 *       400:
 *         description: Invalid index
 *       401:
 *         description: Unauthenticated
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Blog not found
 */
router.delete(
  "/:blogId/images/:imageIndex",
  authenticateToken,
  blogController.deleteImage
);

/**
 * @swagger
 * /api/blogs/{id}/rate:
 *   post:
 *     summary: Rate a blog with stars (1-5)
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
*         description: Blog ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating stars (1-5)
 *                 example: 5
 *     responses:
 *       200:
 *         description: Rating submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rating submitted successfully"
 *                 averageRating:
 *                   type: string
 *                   example: "4.5"
 *                 ratingCount:
 *                   type: number
 *                   example: 10
 *                 userRating:
 *                   type: number
 *                   example: 5
 *       400:
 *         description: Invalid rating
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Blog not found
 */
router.post("/:id/rate", authenticateToken, blogController.rateBlog);

/**
 * @swagger
 * /api/blogs/{id}/rating:
 *   get:
 *     summary: Get the user's rating for a blog
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
*         description: Blog ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Rating retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userRating:
 *                   type: number
 *                   nullable: true
 *                   example: 5
 *                 averageRating:
 *                   type: string
 *                   example: "4.5"
 *                 ratingCount:
 *                   type: number
 *                   example: 10
 *       401:
 *         description: Unauthenticated
 *       404:
 *         description: Blog not found
 */
router.get("/:id/rating", authenticateToken, blogController.getUserRating);

/**
 * @swagger
 * /api/blogs/{id}/share-badges:
 *   post:
 *     summary: Share badges
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
*         description: Blog ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shared_badges
 *             properties:
 *               shared_badges:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of badge IDs
 *                 example: ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"]
 *     responses:
 *       200:
 *         description: Success
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
*                   example: "Badges shared successfully"
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthenticated
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Blog not found
 */
router.post("/:id/share-badges", authenticateToken, blogController.shareBadges);

module.exports = router;
