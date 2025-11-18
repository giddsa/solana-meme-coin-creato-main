import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Settings, Download, Trash2 } from "lucide-react";
import type { Token } from "~backend/token/create";

interface TokenCardProps {
  token: Token;
  onDelete: (id: string) => void;
}

export default function TokenCard({ token, onDelete }: TokenCardProps) {
  const explorerUrl = token.network === "mainnet"
    ? `https://explorer.solana.com/address/${token.mintAddress}`
    : `https://explorer.solana.com/address/${token.mintAddress}?cluster=devnet`;

  const handleDownloadJSON = () => {
    const data = JSON.stringify(token, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${token.symbol}-${token.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur-sm hover:border-purple-500/60 transition-all">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {token.logoUrl && (
              <img
                src={token.logoUrl}
                alt={token.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              <CardTitle className="text-xl">{token.name}</CardTitle>
              <CardDescription>{token.symbol}</CardDescription>
            </div>
          </div>
          <span className={`px-2 py-1 rounded text-xs ${
            token.network === "mainnet"
              ? "bg-green-500/20 text-green-400"
              : "bg-blue-500/20 text-blue-400"
          }`}>
            {token.network}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-slate-500">العرض الكلي:</p>
            <p className="text-slate-200 font-semibold">{token.supply.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-slate-500">الكسور:</p>
            <p className="text-slate-200 font-semibold">{token.decimals}</p>
          </div>
        </div>

        {token.description && (
          <p className="text-sm text-slate-400 line-clamp-2">{token.description}</p>
        )}

        <div className="flex flex-wrap gap-1">
          {token.freezeAuthorityRevoked && (
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">Freeze ✓</span>
          )}
          {token.mintAuthorityRevoked && (
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">Mint ✓</span>
          )}
          {token.updateAuthorityRevoked && (
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">Update ✓</span>
          )}
        </div>

        <div className="flex gap-2">
          <Link to={`/liquidity/${token.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full border-purple-500/30">
              <Settings className="w-4 h-4 ml-2" />
              السيولة
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadJSON}
            className="border-purple-500/30"
          >
            <Download className="w-4 h-4" />
          </Button>
          {token.mintAddress && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(explorerUrl, "_blank")}
              className="border-purple-500/30"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (confirm("هل أنت متأكد من حذف هذه العملة؟")) {
                onDelete(token.id);
              }
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
