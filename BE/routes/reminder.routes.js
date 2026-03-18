const express = require('express');
const router = express.Router();
const controller = require('../controllers/reminder.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const { checkMembershipPermission } = require('../middlewares/membership.middleware');

/**
 * @swagger
 * tags:
 *   name: Reminder
 *   description: User reminder management
 */

/**
 * @swagger
 * /api/reminders:
 *   post:
 *     tags: [Reminder]
 *     summary: Create a new reminder
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Drink water
 *               content:
 *                 type: string
 *                 example: Remind you to drink 1 glass of water at 9 AM
 *               remind_at:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-06-29T09:00:00.000Z"
 *               is_recurring:
 *                 type: boolean
 *                 example: false
 *               repeat_pattern:
 *                 type: string
 *                 enum: [daily, weekly, monthly]
 *                 example: daily
 *               plan_id:
 *                 type: string
 *                 example: "667f1967e0412324344ea835"
 *     responses:
 *       201:
 *         description: Reminder created successfully
 *       403:
 *         description: Your membership does not allow creating reminders
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  authenticateToken,
  checkMembershipPermission('can_use_reminder'),
  controller.createReminder
);

/**
 * @swagger
 * /api/reminders:
 *   get:
 *     tags: [Reminder]
 *     summary: Get the current user's reminder list
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reminder list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reminder'
 *       500:
 *         description: Server error
 */
router.get('/', authenticateToken, controller.getMyReminders);

/**
 * @swagger
 * /api/reminders/{id}:
 *   delete:
 *     tags: [Reminder]
 *     summary: Delete a reminder by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reminder ID
 *     responses:
 *       200:
 *         description: Reminder deleted
 *       404:
 *         description: Reminder not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticateToken, controller.deleteReminder);

/**
 * @swagger
 * /api/reminders/{id}:
 *   put:
 *     tags: [Reminder]
 *     summary: Update reminder
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the reminder to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               remind_at:
 *                 type: string
 *                 format: date-time
 *               is_recurring:
 *                 type: boolean
 *               repeat_pattern:
 *                 type: string
 *                 enum: [daily, weekly, monthly]
 *     responses:
 *       200:
 *         description: Reminder updated
 *       404:
 *         description: Reminder not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticateToken, controller.updateReminder);

module.exports = router;
