// routes/transaction.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/transaction.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction history and management
 */

/**
 * @swagger
 * /api/transactions/me:
 *   get:
 *     summary: Get your own transaction history
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Personal transaction list
 */
router.get('/me', authenticateToken, controller.getMyTransactions);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions (admin)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System-wide transaction list
 */
router.get('/', authenticateToken, isAdmin, controller.getAllTransactions);
/**
 * @swagger
 * /api/transactions/summary:
 *   get:
 *     summary: System-wide transaction statistics (admin)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics including total revenue and transaction statuses
 */
router.get('/summary', authenticateToken, isAdmin, controller.getTransactionSummary);

module.exports = router;
