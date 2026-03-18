// routes/paypal.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/payment.controller');
const authenticateToken = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: PayPal
 *   description: PayPal payment integration
 */

/**
 * @swagger
 * /api/payments/paypal/create:
 *   post:
 *     summary: Create a PayPal payment order
 *     tags: [PayPal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               package_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Link for the user to complete payment
 */
router.post('/paypal/create', authenticateToken, controller.createPaypalOrder);

/**
 * @swagger
 * /api/payments/paypal/capture:
 *   post:
 *     summary: Confirm PayPal payment
 *     tags: [PayPal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment successful and membership assigned
 */
router.post('/paypal/capture', authenticateToken, controller.capturePaypalOrder);

/**
 * @swagger
 * /api/payments/paypal/return:
 *   get:
 *     summary: Handle redirect after successful PayPal payment
 *     tags: [PayPal]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         description: Token from PayPal
 *       - in: query
 *         name: PayerID
 *         schema:
 *           type: string
 *         description: Payer ID from PayPal
 *     responses:
 *       302:
 *         description: Redirect to the mobile application
 */
router.get('/paypal/return', (req, res) => {
    const { token, PayerID } = req.query;
    // Redirect to the app deep link while preserving all parameters
    res.redirect(`quitsmokingapp://checkout/success?token=${token}&PayerID=${PayerID}`);
});

/**
 * @swagger
 * /api/payments/paypal/cancel:
 *   post:
 *     summary: Update PayPal order cancellation status
 *     tags: [PayPal]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: PayPal Order ID (transaction_id)
 *                 example: "5MN88288F8699084T"
 *     responses:
 *       200:
 *         description: Cancelled successfully
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Server error
 */
router.post('/paypal/cancel', controller.cancelPaypalOrder);



module.exports = router;
