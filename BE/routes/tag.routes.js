const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tag.controller");
const authenticateToken = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: Blog tag management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Tag:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *       properties:
 *         _id:
 *           type: string
*           description: Auto-generated tag ID
 *         name:
 *           type: string
*           description: Tag name
 *           example: "JavaScript"
 *         slug:
 *           type: string
 *           description: Slug URL-friendly
 *           example: "javascript"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Created time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last updated time
 *     TagInput:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *       properties:
 *         name:
 *           type: string
*           description: Tag name
 *           example: "JavaScript"
 *         slug:
 *           type: string
 *           description: Slug URL-friendly
 *           example: "javascript"
 */

/**
 * @swagger
 * /api/tags:
 *   get:
 *     summary: Get all tags
 *     tags: [Tags]
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
 *         description: Number of tags per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by tag name
 *     responses:
 *       200:
 *         description: Tag list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 tags:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tag'
 *                 total:
 *                   type: integer
 *                   example: 10
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
router.get("/", tagController.getTags);

/**
 * @swagger
 * /api/tags/{id}:
 *   get:
 *     summary: Get tag by ID
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Tag retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 tag:
 *                   $ref: '#/components/schemas/Tag'
 *       404:
 *         description: Tag not found
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
 *                   example: "Tag not found"
 *       500:
 *         description: Server error
 */
router.get("/:id", tagController.getTagById);

/**
 * @swagger
 * /api/tags:
 *   post:
 *     summary: Create a new tag (Admin only)
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TagInput'
 *           example:
 *             name: "React"
 *             slug: "react"
 *     responses:
 *       201:
 *         description: Tag created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 tag:
 *                   $ref: '#/components/schemas/Tag'
 *                 message:
 *                   type: string
 *                   example: "Tag created successfully"
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
 *                   example: "Tag name already exists"
 *       401:
 *         description: Unauthenticated
 *       403:
 *         description: Unauthorized admin
 *       500:
 *         description: Server error
 */
router.post("/", authenticateToken, isAdmin, tagController.createTag);

/**
 * @swagger
 * /api/tags/{id}:
 *   put:
 *     summary: Update tag (Admin only)
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag ID
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
 *                 description: New tag name
 *                 example: "React.js"
 *               slug:
 *                 type: string
 *                 description: New slug
 *                 example: "react-js"
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
 *                 tag:
 *                   $ref: '#/components/schemas/Tag'
 *                 message:
 *                   type: string
 *                   example: "Tag updated successfully"
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthenticated
 *       403:
 *         description: Unauthorized admin
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Server error
 */
router.put("/:id", authenticateToken, isAdmin, tagController.updateTag);

/**
 * @swagger
 * /api/tags/{id}:
 *   delete:
 *     summary: Delete tag (Admin only)
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag ID
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
 *                   example: "Tag deleted successfully"
 *       401:
 *         description: Unauthenticated
 *       403:
 *         description: Unauthorized admin
 *       404:
 *         description: Tag not found
 *       409:
 *         description: Cannot delete because some blogs are using it
 *       500:
 *         description: Server error
 */
router.delete("/:id", authenticateToken, isAdmin, tagController.deleteTag);

module.exports = router;
