import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import db from "../db";
import type { Token } from "./create";

export interface ListTokensRequest {
  userId: Query<string>;
  network?: Query<string>;
}

export interface ListTokensResponse {
  tokens: Token[];
}

// Lists all tokens for a user.
export const list = api<ListTokensRequest, ListTokensResponse>(
  { expose: true, method: "GET", path: "/tokens" },
  async (req) => {
    let query = `
      SELECT 
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
      FROM tokens 
      WHERE user_id = $1
    `;

    const params: string[] = [req.userId];

    if (req.network) {
      query += ` AND network = $2`;
      params.push(req.network);
    }

    query += ` ORDER BY created_at DESC`;

    const tokens = await db.rawQueryAll<Token>(query, ...params);

    return { tokens };
  }
);
