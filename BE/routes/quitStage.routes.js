const express = require('express');
const stageRouter = express.Router();
const quitStageController = require('../controllers/quitState.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const { verifyPlanOwnership } = require('../middlewares/planOwnership.middleware');
const { isCoach } = require('../middlewares/role.middleware');
/**
 * @swagger
 * tags:
 *   name: QuitStages
 *   description: Manage quit stages in a plan
 */

/**
 * @swagger
 * /api/quit-plans/{planId}/stages:
 *   get:
 *     summary: Get the list of stages by plan
 *     tags: [QuitStages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         schema:
 *           type: string
 *         required: true
 *         description: Quit plan ID
 *     responses:
 *       200:
 *         description: Stage list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/QuitStage'
 *       500:
 *         description: Server error
 */
stageRouter.get(
  '/:planId/stages',
  authenticateToken,
  verifyPlanOwnership,
  quitStageController.getStagesByPlan
);

/**
 * @swagger
 * /api/quit-plans/stage/{stageId}/progress:
 *   get:
 *     summary: Get progress tracking data within a stage
 *     tags: [QuitStages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: stageId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the stage to retrieve the chart for
 *     responses:
 *       200:
 *         description: Daily tracking records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   cigarette_count:
 *                     type: number
 *       500:
 *         description: Server error
 */
stageRouter.get(
  '/stage/:stageId/progress',
  authenticateToken,
  quitStageController.getStageProgress
);

/**
 * @swagger
 * /api/quit-plans/{planId}/stages:
 *   post:
 *     summary: Create a new stage for the quit plan
 *     tags: [QuitStages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         schema:
 *           type: string
 *         required: true
 *         description: Quit plan ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Stage name
 *               description:
 *                 type: string
 *                 description: Stage description
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Stage start date
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: Stage end date
 *               status:
 *                 type: string
 *                 enum: [not_started, in_progress, completed, skipped]
 *                 description: Stage status
 *     responses:
 *       201:
 *         description: Stage created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuitStage'
 *       500:
 *         description: Server error
 */
stageRouter.post(
  '/:planId/stages',
  authenticateToken,
  isCoach,
  verifyPlanOwnership,
  quitStageController.createStage
);

/**
 * @swagger
 * /api/quit-plans/{planId}/stages/{stageId}:
 *   patch:
 *     summary: Update stage by ID
 *     tags: [QuitStages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         schema:
 *           type: string
 *         required: true
 *         description: Quit plan ID
 *       - in: path
 *         name: stageId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the stage to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Stage name
 *               description:
 *                 type: string
 *                 description: Stage description
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Stage start date
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: Stage end date
 *               status:
 *                 type: string
 *                 enum: [not_started, in_progress, completed, skipped]
 *                 description: Stage status
 *     responses:
 *       200:
 *         description: Stage updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QuitStage'
 *       404:
 *         description: Stage does not exist
 *       500:
 *         description: Server error
 */
stageRouter.patch(
  '/:planId/stages/:stageId',
  authenticateToken,
  isCoach,
  verifyPlanOwnership,
  quitStageController.updateStage
);

/**
 * @swagger
 * /api/quit-plans/{planId}/stages/{stageId}:
 *   delete:
 *     summary: Delete stage by ID
 *     tags: [QuitStages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         schema:
 *           type: string
 *         required: true
 *         description: Quit plan ID
 *       - in: path
 *         name: stageId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the stage to delete
 *     responses:
 *       200:
 *         description: Stage deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Stage deleted
 *       404:
 *         description: Stage does not exist
 *       500:
 *         description: Server error
 */
stageRouter.delete(
  '/:planId/stages/:stageId',
  authenticateToken,
  isCoach,
  verifyPlanOwnership,
  quitStageController.deleteStage
);

module.exports = stageRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     QuitStage:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Stage ID
 *         plan_id:
 *           type: string
 *           description: Quit plan ID
 *         name:
 *           type: string
 *           description: Stage name
 *         description:
 *           type: string
 *           description: Detailed stage description
 *         start_date:
 *           type: string
 *           format: date
 *           description: Stage start date
 *         end_date:
 *           type: string
 *           format: date
 *           description: Stage end date
 *         status:
 *           type: string
 *           enum: [not_started, in_progress, completed, skipped]
 *           description: Stage status
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Record creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Record update date
 */
