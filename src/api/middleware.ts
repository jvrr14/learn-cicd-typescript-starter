import { Request, Response } from "express";
import { respondWithError } from "./json.js";
import { getUser } from "../db/queries/users.js";
import { User } from "../db/schema.js";
import { getAPIKey } from "./auth.js";

type AuthenticatedHandler = (
  req: Request,
  res: Response,
  user: User,
) => void | Promise<void>;

export function middlewareAuth(handler: AuthenticatedHandler) {
  return async (req: Request, res: Response) => {
    try {
      const apiKey = getAPIKey(req.headers);
      if (!apiKey) {
        respondWithError(res, 401, "Couldn't find api key");
        return;
      }

      const user = await getUser(apiKey);
      if (!user) {
        respondWithError(res, 401, "Couldn't get user");
        return;
      }

      await handler(req, res, user);
    } catch (err) {
      respondWithError(res, 500, "Couldn't authenticate user", err);
    }
  };
}
