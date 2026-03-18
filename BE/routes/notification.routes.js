const express = require("express");
const router = express.Router();
const controller = require("../controllers/notification.controller");
const authenticateToken = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: User notification management
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     tags: [Notification]
 *     summary: Get the notification list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 */
router.get("/", authenticateToken, controller.getMyNotifications);

/**
 * @swagger
 * /api/notifications/mark-all-read:
 *   post:
 *     tags: [Notification]
 *     summary: Mark all as read (optional if the read field exists)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications have been marked as read
 */
router.post("/mark-all-read", authenticateToken, controller.markAllAsRead);
/**
 * @swagger
 * /api/notifications/clear-all:
 *   delete:
 *     tags: [Notification]
 *     summary: Delete all notifications of the current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications have been deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
*                   example: All notifications have been deleted.
 *       401:
 *         description: Unauthenticated
 *       500:
 *         description: Server error
 */
router.delete("/clear-all", authenticateToken, controller.clearAllNotifications);


/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     tags: [Notification]
 *     summary: Mark a notification as read
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Marked as read
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Server error
 */
router.patch("/:id/read", authenticateToken, controller.markAsRead);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     tags: [Notification]
 *     summary: Delete notification by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authenticateToken, controller.deleteNotification);

module.exports = router;
