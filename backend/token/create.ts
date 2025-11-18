import { api } from "encore.dev/api";
import { Keypair } from "@solana/web3.js";
import db from "../db";

export interface CreateTokenRequest {
  userId: string;
  name: string;
  symbol: string;
  decimals: number;
  supply: number;
  description?: string;
  logoUrl?: string;
  mintAddress?: string;
  transactionSignature?: string;
  creatorName?: string;
  creatorWebsite?: string;
  twitterUrl?: string;
  telegramUrl?: string;
  discordUrl?: string;
  customPageUrl?: string;
  network: string;
}

export interface Token {
  id: string;
  userId: string;
  name: string;
  symbol: string;
  decimals: number;
  supply: number;
  description?: string;
  logoUrl?: string;
  mintAddress?: string;
  freezeAuthorityRevoked: boolean;
  mintAuthorityRevoked: boolean;
  updateAuthorityRevoked: boolean;
  creatorName?: string;
  creatorWebsite?: string;
  twitterUrl?: string;
  telegramUrl?: string;
  discordUrl?: string;
  customPageUrl?: string;
  network: string;
  transactionSignature?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Creates a new token record.
export const create = api<CreateTokenRequest, Token>(
  { expose: true, method: "POST", path: "/tokens" },
  async (req) => {
    const id = crypto.randomUUID();
    
    const mintKeypair = Keypair.generate();
    const mintAddress = req.mintAddress || mintKeypair.publicKey.toBase58();
    
    await db.exec`
      INSERT INTO tokens (
        id, user_id, name, symbol, decimals, supply, description, logo_url,
        mint_address, transaction_signature, creator_name, creator_website, twitter_url, telegram_url,
        discord_url, custom_page_url, network
      ) VALUES (
        ${id}, ${req.userId}, ${req.name}, ${req.symbol}, ${req.decimals},
        ${req.supply}, ${req.description || null}, ${req.logoUrl || null},
        ${mintAddress}, ${req.transactionSignature || null}, ${req.creatorName || null},
        ${req.creatorWebsite || null}, ${req.twitterUrl || null},
        ${req.telegramUrl || null}, ${req.discordUrl || null},
        ${req.customPageUrl || null}, ${req.network}
      )
    `;

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
      FROM tokens WHERE id = ${id}
    `;

    if (!token) {
      throw new Error("Failed to create token");
    }

    return token;
  }
);
