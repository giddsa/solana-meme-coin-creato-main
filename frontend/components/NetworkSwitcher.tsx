import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Network } from "lucide-react";

interface NetworkSwitcherProps {
  network: "devnet" | "mainnet";
  onChange: (network: "devnet" | "mainnet") => void;
}

export default function NetworkSwitcher({ network, onChange }: NetworkSwitcherProps) {
  return (
    <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="w-5 h-5" />
          الشبكة
        </CardTitle>
        <CardDescription>اختر بين الاختبار والإطلاق</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex gap-2">
          <Button
            variant={network === "devnet" ? "default" : "outline"}
            onClick={() => onChange("devnet")}
            className="flex-1"
          >
            Devnet
          </Button>
          <Button
            variant={network === "mainnet" ? "default" : "outline"}
            onClick={() => onChange("mainnet")}
            className="flex-1"
          >
            Mainnet
          </Button>
        </div>
        <p className="text-xs text-slate-400 text-center">
          {network === "devnet" ? "للاختبار (مجاني)" : "للإطلاق الفعلي"}
        </p>
      </CardContent>
    </Card>
  );
}
