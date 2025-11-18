import { api, APIError } from "encore.dev/api";
import db from "../db";
import type { Token } from "./create";

export interface UpdateTokenRequest {
  id: string;
  mintAddress?: string;
  transactionSignature?: string;
  freezeAuthorityRevoked?: boolean;
  mintAuthorityRevoked?: boolean;
  updateAuthorityRevoked?: boolean;
}

// Updates a token's blockchain-related fields.
export const update = api<UpdateTokenRequest, Token>(
  { expose: true, method: "PATCH", path: "/tokens/:id" },
  async (req) => {
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (req.mintAddress !== undefined) {
      updates.push(`mint_address = $${paramIndex++}`);
      params.push(req.mintAddress);
    }

    if (req.transactionSignature !== undefined) {
      updates.push(`transaction_signature = $${paramIndex++}`);
      params.push(req.transactionSignature);
    }

    if (req.freezeAuthorityRevoked !== undefined) {
      updates.push(`freeze_authority_revoked = $${paramIndex++}`);
      params.push(req.freezeAuthorityRevoked);
    }

    if (req.mintAuthorityRevoked !== undefined) {
      updates.push(`mint_authority_revoked = $${paramIndex++}`);
      params.push(req.mintAuthorityRevoked);
    }

    if (req.updateAuthorityRevoked !== undefined) {
      updates.push(`update_authority_revoked = $${paramIndex++}`);
      params.push(req.updateAuthorityRevoked);
    }

    if (updates.length === 0) {
      throw APIError.invalidArgument("no fields to update");
    }

    updates.push(`updated_at = NOW()`);
    params.push(req.id);

    const query = `
      UPDATE tokens 
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING 
        id, user_id as "userId", name, symbol, decimals, supply, description,
        logo_url as "logoUrl", mint_address as "mintAddress",
        freeze_authority_revoked as "freezeAuthorityRevoked",
        mint_authority_revoked as "mintAuthorityRevoked",
        update_authority_revoked as "updateAuthorityRevoked",
        creator_name as "creatorName", creator_website as "creatorWebsite",
        twitter_url as "twitterUrl", telegram_url as "telegramUrl",
        discord_url as "discordUrl", custom_page_url as "customPageUrl",
        network, transaction_signature as "transactionSignature",
        created_at as "createdAt", updated_at as "updatedAt"
    `;

    const token = await db.rawQueryRow<Token>(query, ...params);

    if (!token) {
      throw APIError.notFound("token not found");
    }

    return token;
  }
);
