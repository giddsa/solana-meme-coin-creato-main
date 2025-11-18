import { api, APIError } from "encore.dev/api";
import { Query } from "encore.dev/api";
import db from "../db";
import type { LiquidityControl } from "./create";

export interface GetLiquidityControlRequest {
  tokenId: Query<string>;
}

// Retrieves liquidity control settings for a token.
export const get = api<GetLiquidityControlRequest, LiquidityControl>(
  { expose: true, method: "GET", path: "/liquidity-controls" },
  async (req) => {
    const control = await db.queryRow<LiquidityControl>`
      SELECT 
        id, token_id as "tokenId", multi_sig_enabled as "multiSigEnabled",
        required_signatures as "requiredSignatures",
        timelock_duration as "timelockDuration",
        withdrawal_addresses as "withdrawalAddresses",
        created_at as "createdAt"
      FROM liquidity_controls WHERE token_id = ${req.tokenId}
    `;

    if (!control) {
      throw APIError.notFound("liquidity control not found");
    }

    return control;
  }
);
