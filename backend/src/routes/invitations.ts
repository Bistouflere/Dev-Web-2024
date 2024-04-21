import { query } from "../db/index";
import { validatePage } from "../validator/pageValidator";
import { validateTeamId } from "../validator/teamIdValidator";
import {
  ClerkExpressRequireAuth,
  RequireAuthProp,
} from "@clerk/clerk-sdk-node";
import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

// send an invitation to a user to join a team
router.post(
  "/send/:userId/:teamId",
  validateTeamId,
  ClerkExpressRequireAuth({}),
  async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    const { userId, teamId } = req.params;
    const recruiterId = req.auth.userId;

    try {
      if (userId === recruiterId) {
        return res.status(400).json({ message: "Cannot recruit yourself" });
      }

      const recruiterSql = "SELECT * FROM users WHERE id = $1;";
      const recruiterResult = await query(recruiterSql, [recruiterId]);

      if (recruiterResult.rows.length === 0) {
        return res
          .status(404)
          .json({ message: `User with ID ${recruiterId} not found` });
      }

      const recruiterTeamRoleSql = `
        SELECT role FROM teams_users WHERE team_id = $1 AND user_id = $2;
      `;
      const recruiterTeamRoleResult = await query(recruiterTeamRoleSql, [
        teamId,
        recruiterId,
      ]);

      if (recruiterTeamRoleResult.rows.length === 0) {
        return res.status(403).json({
          message: "You are not a member of this team and cannot recruit",
        });
      }

      const recruiterTeamRole = recruiterTeamRoleResult.rows[0].role;

      if (recruiterTeamRole === "participant") {
        return res.status(403).json({
          message: "You are a participant and cannot recruit",
        });
      }

      const recruitSql = "SELECT * FROM users WHERE id = $1;";
      const recruitResult = await query(recruitSql, [userId]);

      if (recruitResult.rows.length === 0) {
        return res
          .status(404)
          .json({ message: `User with ID ${userId} not found` });
      }

      const teamSql = "SELECT * FROM teams WHERE id = $1;";
      const teamResult = await query(teamSql, [teamId]);

      if (teamResult.rows.length === 0) {
        return res
          .status(404)
          .json({ message: `Team with ID ${teamId} not found` });
      }

      const existingRecruitSql = `
        SELECT * FROM teams_invitations WHERE team_id = $1 AND invited_id = $2;
      `;
      const existingRecruitResult = await query(existingRecruitSql, [
        teamId,
        userId,
      ]);

      if (existingRecruitResult.rows.length > 0) {
        return res
          .status(409)
          .json({ message: "User is already invited to this team" });
      }

      const insertSql = `
        INSERT INTO teams_invitations (team_id, invited_id, inviter_id)
        VALUES ($1, $2, $3);
      `;
      await query(insertSql, [teamId, userId, recruiterId]);

      return res
        .status(201)
        .json({ message: "User invited to team successfully" });
    } catch (error) {
      next(error);
    }
  },
);

// accept an invitation to join a team
router.delete(
  "/accept/:teamId",
  validateTeamId,
  ClerkExpressRequireAuth({}),
  async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    const userId = req.auth.userId;
    const { teamId } = req.params;

    try {
      const invitationSql = `
        SELECT * FROM teams_invitations WHERE team_id = $1 AND invited_id = $2;
      `;
      const invitationResult = await query(invitationSql, [teamId, userId]);

      if (invitationResult.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Invitation not found or already accepted" });
      }

      const deleteSql = `
        DELETE FROM teams_invitations WHERE team_id = $1 AND invited_id = $2;
      `;
      await query(deleteSql, [teamId, userId]);

      const insertSql = `
        INSERT INTO teams_users (team_id, user_id, role)
        VALUES ($1, $2, 'participant');
      `;
      await query(insertSql, [teamId, userId]);

      return res
        .status(201)
        .json({ message: "Invitation accepted successfully" });
    } catch (error) {
      next(error);
    }
  },
);

// reject an invitation to join a team
router.delete(
  "/reject/:teamId",
  validateTeamId,
  ClerkExpressRequireAuth({}),
  async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    const userId = req.auth.userId;
    const { teamId } = req.params;

    try {
      const invitationSql = `
        SELECT * FROM teams_invitations WHERE team_id = $1 AND invited_id = $2;
      `;
      const invitationResult = await query(invitationSql, [teamId, userId]);

      if (invitationResult.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Invitation not found or already rejected" });
      }

      const deleteSql = `
        DELETE FROM teams_invitations WHERE team_id = $1 AND invited_id = $2;
      `;
      await query(deleteSql, [teamId, userId]);

      return res
        .status(201)
        .json({ message: "Invitation rejected successfully" });
    } catch (error) {
      next(error);
    }
  },
);

// get all invitations for a user
router.get(
  "/",
  ClerkExpressRequireAuth({}),
  async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    const userId = req.auth.userId;

    try {
      const sql = `
        SELECT teams_invitations.team_id, teams.name AS team_name, users.id AS inviter_id, users.username AS inviter_username
        FROM teams_invitations
        JOIN teams ON teams.id = teams_invitations.team_id
        JOIN users ON users.id = teams_invitations.inviter_id
        WHERE invited_id = $1;
      `;
      const result = await query(sql, [userId]);

      return res.status(200).json(result.rows);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
