import { query } from "../db/index";
import { validateTeamId } from "../validator/teamIdValidator";
import {
  ClerkExpressRequireAuth,
  RequireAuthProp,
} from "@clerk/clerk-sdk-node";
import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

router.post(
  "/send/:userId/:teamId",
  validateTeamId,
  ClerkExpressRequireAuth({}),
  async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    const { userId, teamId } = req.params;
    const recruiterId = req.auth.userId;

    try {
      if (userId === recruiterId) {
        return res
          .status(400)
          .json({ message: "You cannot recruit yourself!" });
      }

      const recruiterTeamRoleSql =
        "SELECT role FROM teams_users WHERE team_id = $1 AND user_id = $2;";
      const [recruiterTeamRoleResult, recruitResult, teamResult] =
        await Promise.all([
          query(recruiterTeamRoleSql, [teamId, recruiterId]),
          query("SELECT * FROM users WHERE id = $1;", [userId]),
          query("SELECT * FROM teams WHERE id = $1;", [teamId]),
        ]);

      if (recruiterTeamRoleResult.rows.length === 0) {
        return res.status(403).json({
          message: "You are not a member of this team and cannot recruit",
        });
      }

      const recruiterTeamRole = recruiterTeamRoleResult.rows[0].role;
      if (recruiterTeamRole === "participant") {
        return res
          .status(403)
          .json({ message: "You are a participant and cannot recruit" });
      }

      if (recruitResult.rows.length === 0) {
        return res
          .status(404)
          .json({ message: `User with ID ${userId} not found` });
      }

      if (teamResult.rows.length === 0) {
        return res
          .status(404)
          .json({ message: `Team with ID ${teamId} not found` });
      }

      const existingRecruitSql =
        "SELECT * FROM teams_invitations WHERE team_id = $1 AND invited_id = $2;";
      const existingRecruitResult = await query(existingRecruitSql, [
        teamId,
        userId,
      ]);
      if (existingRecruitResult.rows.length > 0) {
        return res
          .status(409)
          .json({ message: "User is already invited to this team" });
      }

      await query(
        "INSERT INTO teams_invitations (team_id, invited_id, inviter_id) VALUES ($1, $2, $3);",
        [teamId, userId, recruiterId],
      );

      return res
        .status(201)
        .json({ message: "User invited to team successfully" });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/accept/:teamId",
  validateTeamId,
  ClerkExpressRequireAuth({}),
  async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    const userId = req.auth.userId;
    const { teamId } = req.params;

    try {
      const invitationResult = await query(
        "SELECT * FROM teams_invitations WHERE team_id = $1 AND invited_id = $2;",
        [teamId, userId],
      );
      if (invitationResult.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Invitation not found or already accepted" });
      }

      await query(
        "DELETE FROM teams_invitations WHERE team_id = $1 AND invited_id = $2;",
        [teamId, userId],
      );

      const isTeamMemberResult = await query(
        "SELECT * FROM teams_users WHERE team_id = $1 AND user_id = $2;",
        [teamId, userId],
      );
      if (isTeamMemberResult.rows.length > 0) {
        return res
          .status(409)
          .json({ message: "You are already a member of this team" });
      }

      await query(
        "INSERT INTO teams_users (team_id, user_id, role) VALUES ($1, $2, 'participant');",
        [teamId, userId],
      );

      return res
        .status(201)
        .json({ message: "Invitation accepted successfully" });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/reject/:teamId",
  validateTeamId,
  ClerkExpressRequireAuth({}),
  async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    const userId = req.auth.userId;
    const { teamId } = req.params;

    try {
      const invitationResult = await query(
        "SELECT * FROM teams_invitations WHERE team_id = $1 AND invited_id = $2;",
        [teamId, userId],
      );
      if (invitationResult.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Invitation not found or already rejected" });
      }

      await query(
        "DELETE FROM teams_invitations WHERE team_id = $1 AND invited_id = $2;",
        [teamId, userId],
      );

      return res
        .status(201)
        .json({ message: "Invitation rejected successfully" });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/cancel/:userId/:teamId",
  validateTeamId,
  ClerkExpressRequireAuth({}),
  async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    const { userId, teamId } = req.params;
    const inviterId = req.auth.userId;

    try {
      const invitationResult = await query(
        "SELECT * FROM teams_invitations WHERE team_id = $1 AND invited_id = $2 AND inviter_id = $3;",
        [teamId, userId, inviterId],
      );
      if (invitationResult.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Invitation not found or already canceled" });
      }

      if (invitationResult.rows[0].inviter_id !== inviterId) {
        return res
          .status(403)
          .json({ message: "You are not the inviter of this invitation" });
      }

      await query(
        "DELETE FROM teams_invitations WHERE team_id = $1 AND invited_id = $2 AND inviter_id = $3;",
        [teamId, userId, inviterId],
      );

      return res
        .status(201)
        .json({ message: "Invitation canceled successfully" });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/sent",
  ClerkExpressRequireAuth({}),
  async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    const userId = req.auth.userId;

    try {
      const sql = `
        SELECT teams_invitations.invited_id as user_id, users.username AS user_username, teams.name AS team_name, teams.id AS team_id
        FROM teams_invitations
        JOIN users ON users.id = teams_invitations.invited_id
        JOIN teams ON teams.id = teams_invitations.team_id
        WHERE inviter_id = $1;
      `;
      const result = await query(sql, [userId]);

      return res.status(200).json(result.rows);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/",
  ClerkExpressRequireAuth({}),
  async (req: RequireAuthProp<Request>, res: Response, next: NextFunction) => {
    const userId = req.auth.userId;

    try {
      const sql = `
        SELECT teams_invitations.inviter_id as user_id, users.username AS user_username, teams.name AS team_name, teams.id AS team_id
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
