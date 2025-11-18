import { api, APIError } from "encore.dev/api";
import db from "../db";

export interface DeleteTokenRequest {
  id: string;
}

// Deletes a token record.
export const deleteToken = api<DeleteTokenRequest, void>(
  { expose: true, method: "DELETE", path: "/tokens/:id" },
  async (req) => {
    await db.exec`DELETE FROM tokens WHERE id = ${req.id}`;
  }
);
