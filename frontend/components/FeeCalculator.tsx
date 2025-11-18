import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface FeeCalculatorProps {
  network: "devnet" | "mainnet";
}

export default function FeeCalculator({ network }: FeeCalculatorProps) {
  const fees = {
    devnet: {
      tokenCreation: 0,
      metadata: 0,
      total: 0,
    },
    mainnet: {
      tokenCreation: 0.002,
      metadata: 0.001,
      total: 0.003,
    },
  };

  const currentFees = fees[network];

  return (
    <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          التكاليف المتوقعة
        </CardTitle>
        <CardDescription>رسوم {network === "devnet" ? "Devnet" : "Mainnet"}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">إنشاء العملة:</span>
          <span className="text-slate-200">{currentFees.tokenCreation} SOL</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">البيانات الوصفية:</span>
          <span className="text-slate-200">{currentFees.metadata} SOL</span>
        </div>
        <div className="border-t border-purple-500/30 pt-2 flex justify-between font-bold">
          <span className="text-purple-400">الإجمالي:</span>
          <span className="text-purple-400">{currentFees.total} SOL</span>
        </div>
        {network === "devnet" && (
          <p className="text-xs text-green-400 text-center mt-2">
            ✓ مجاني على Devnet
          </p>
        )}
      </CardContent>
    </Card>
  );
}
