const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const authenticateToken = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Blog category management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated category ID
 *         name:
 *           type: string
 *           description: Category name
 *           example: "Technology"
 *         slug:
 *           type: string
 *           description: Slug URL-friendly
 *           example: "cong-nghe"
 *         description:
 *           type: string
 *           description: Category description
 *           example: "Articles about the latest technology"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Created time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last updated time
 *     CategoryInput:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *       properties:
 *         name:
 *           type: string
 *           description: Category name
 *           example: "Technology"
 *         slug:
 *           type: string
 *           description: Slug URL-friendly
 *           example: "cong-nghe"
 *         description:
 *           type: string
 *           description: Category description (optional)
 *           example: "Articles about the latest technology"
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
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
 *         description: Number of categories per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by category name
 *     responses:
 *       200:
 *         description: Category list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 categories:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *                 total:
 *                   type: integer
 *                   example: 5
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 pages:
 *                   type: integer
 *                   example: 1
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
router.get("/", categoryController.getCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
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
 *                   example: "Category not found"
 *       500:
 *         description: Server error
 */
router.get("/:id", categoryController.getCategoryById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *           example:
 *             name: "Technology"
 *             slug: "cong-nghe"
 *             description: "Articles about the latest technology"
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *                 message:
 *                   type: string
 *                   example: "Category created successfully"
 *       400:
 *         description: Invalid data
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
 *                   example: "Category name already exists"
 *       401:
 *         description: Unauthenticated
 *       403:
 *         description: Unauthorized admin
 *       500:
 *         description: Server error
 */
router.post("/", authenticateToken, isAdmin, categoryController.createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New category name
 *                 example: "New Technology"
 *               slug:
 *                 type: string
 *                 description: New slug
 *                 example: "cong-nghe-moi"
 *               description:
 *                 type: string
 *                 description: New description
 *                 example: "Articles about the latest technology in 2024"
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
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *                 message:
 *                   type: string
*                   example: "Category updated successfully"
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthenticated
 *       403:
 *         description: Unauthorized admin
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  authenticateToken,
  isAdmin,
  categoryController.updateCategory
);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
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
*                   example: "Category deleted successfully"
 *       401:
 *         description: Unauthenticated
 *       403:
 *         description: Unauthorized admin
 *       404:
 *         description: Category not found
 *       409:
 *         description: Cannot delete because some blogs are using it
 *       500:
 *         description: Server error
 */
router.delete(
  "/:id",
  authenticateToken,
  isAdmin,
  categoryController.deleteCategory
);

module.exports = router;
