import { api } from "encore.dev/api";
import db from "../db";

export interface CreateLiquidityControlRequest {
  tokenId: string;
  multiSigEnabled: boolean;
  requiredSignatures: number;
  timelockDuration: number;
  withdrawalAddresses: string[];
}

export interface LiquidityControl {
  id: string;
  tokenId: string;
  multiSigEnabled: boolean;
  requiredSignatures: number;
  timelockDuration: number;
  withdrawalAddresses: string[];
  createdAt: Date;
}

// Creates liquidity control settings for a token.
export const create = api<CreateLiquidityControlRequest, LiquidityControl>(
  { expose: true, method: "POST", path: "/liquidity-controls" },
  async (req) => {
    const id = crypto.randomUUID();
    
    await db.exec`
      INSERT INTO liquidity_controls (
        id, token_id, multi_sig_enabled, required_signatures,
        timelock_duration, withdrawal_addresses
      ) VALUES (
        ${id}, ${req.tokenId}, ${req.multiSigEnabled},
        ${req.requiredSignatures}, ${req.timelockDuration},
        ${req.withdrawalAddresses}
      )
      ON CONFLICT (token_id) DO UPDATE SET
        multi_sig_enabled = EXCLUDED.multi_sig_enabled,
        required_signatures = EXCLUDED.required_signatures,
        timelock_duration = EXCLUDED.timelock_duration,
        withdrawal_addresses = EXCLUDED.withdrawal_addresses
    `;

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
      throw new Error("Failed to create liquidity control");
    }

    return control;
  }
);
