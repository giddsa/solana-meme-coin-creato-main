import { api, APIError } from "encore.dev/api";
import db from "../db";
import type { Token } from "./create";

export interface GetTokenRequest {
  id: string;
}

// Retrieves a single token by ID.
export const get = api<GetTokenRequest, Token>(
  { expose: true, method: "GET", path: "/tokens/:id" },
  async (req) => {
    const token = await db.queryRow<Token>`
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
      FROM tokens WHERE id = ${req.id}
    `;

    if (!token) {
      throw APIError.notFound("token not found");
    }

    return token;
  }
);
