// routes/userMembership.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/userMembership.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');

/**
 * @swagger
 * tags:
 *   name: UserMembership
 *   description: User membership information management
 */

/**
 * @swagger
 * /api/user-membership/me:
 *   get:
 *     summary: Get the user's current membership
 *     tags: [UserMembership]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current membership
 *       404:
 *         description: No membership
 */
router.get('/me', authenticateToken, controller.getCurrentMembership);

/**
 * @swagger
 * /api/user-membership/me/history:
 *   get:
 *     summary: My membership history
 *     tags: [UserMembership]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of subscribed packages
 */
router.get('/me/history', authenticateToken, controller.getMyMembershipHistory);

/**
 * @swagger
 * /api/user-membership:
 *   get:
 *     summary: Admin views all packages purchased by users
 *     tags: [UserMembership]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
*         description: Membership list
 */
router.get('/', authenticateToken, isAdmin, controller.getAllMemberships);

/**
 * @swagger
 * /api/user-membership/admin/{id}:
 *   get:
 *     summary: Get current membership of a user by ID (admin only)
 *     tags: [UserMembership]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Membership info of user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: string
 *                 status:
 *                   type: string
 *                 package_id:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                 payment_date:
 *                   type: string
 *                   format: date
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: No active membership found
 */
router.get('/admin/:id', authenticateToken, isAdmin, controller.getMembershipByUserId);

/**
 * @swagger
 * /api/user-membership/preview-upgrade:
 *   post:
 *     summary: Preview membership upgrade cost
 *     tags: [UserMembership]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPackageId:
 *                 type: string
 *                 example: "60f73b2c4c1a4b35f89a1234"
 *     responses:
 *       200:
 *         description: Upgrade cost information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: string
 *                 to:
 *                   type: string
 *                 remainingDays:
 *                   type: number
 *                 remainingValue:
 *                   type: number
 *                 upgradeCost:
 *                   type: number
 *                 totalCost:
 *                   type: number
 *       400:
 *         description: Missing information or calculation error
 */
router.post('/preview-upgrade', authenticateToken, controller.previewUpgrade);


module.exports = router;
