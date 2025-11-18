import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Wallet, Check } from "lucide-react";

interface WalletConnectProps {
  onConnect: (address: string) => void;
}

export default function WalletConnect({ onConnect }: WalletConnectProps) {
  const { toast } = useToast();
  const [mode, setMode] = useState<"phantom" | "manual">("phantom");
  const [walletAddress, setWalletAddress] = useState("");
  const [manualAddress, setManualAddress] = useState("");

  useEffect(() => {
    checkPhantom();
  }, []);

  const checkPhantom = async () => {
    if ("solana" in window) {
      const provider = (window as any).solana;
      if (provider.isPhantom) {
        try {
          const resp = await provider.connect({ onlyIfTrusted: true });
          const address = resp.publicKey.toString();
          setWalletAddress(address);
          onConnect(address);
        } catch (err) {
          // User not connected yet
        }
      }
    }
  };

  const connectPhantom = async () => {
    try {
      if (!("solana" in window)) {
        toast({
          title: "Phantom غير مثبت",
          description: "يرجى تثبيت محفظة Phantom",
          variant: "destructive",
        });
        return;
      }

      const provider = (window as any).solana;
      const resp = await provider.connect();
      const address = resp.publicKey.toString();
      setWalletAddress(address);
      onConnect(address);

      toast({
        title: "تم الاتصال",
        description: "تم توصيل محفظة Phantom بنجاح",
      });
    } catch (error) {
      console.error("Error connecting Phantom:", error);
      toast({
        title: "فشل الاتصال",
        description: "حدث خطأ أثناء الاتصال بـ Phantom",
        variant: "destructive",
      });
    }
  };

  const handleManualConnect = () => {
    if (!manualAddress.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال عنوان المحفظة",
        variant: "destructive",
      });
      return;
    }

    setWalletAddress(manualAddress);
    onConnect(manualAddress);

    toast({
      title: "تم الاتصال",
      description: "تم حفظ عنوان المحفظة",
    });
  };

  return (
    <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          توصيل المحفظة
        </CardTitle>
        <CardDescription>
          {walletAddress ? "متصل" : "اختر طريقة الاتصال"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {walletAddress ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-400">
              <Check className="w-5 h-5" />
              <span className="font-semibold">متصل</span>
            </div>
            <p className="text-xs text-slate-400 break-all font-mono">{walletAddress}</p>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <Button
                variant={mode === "phantom" ? "default" : "outline"}
                onClick={() => setMode("phantom")}
                className="flex-1"
              >
                Phantom
              </Button>
              <Button
                variant={mode === "manual" ? "default" : "outline"}
                onClick={() => setMode("manual")}
                className="flex-1"
              >
                يدوي
              </Button>
            </div>

            {mode === "phantom" ? (
              <Button onClick={connectPhantom} className="w-full bg-gradient-to-l from-purple-600 to-pink-600">
                اتصل بـ Phantom
              </Button>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="manualAddress">عنوان المحفظة</Label>
                <Input
                  id="manualAddress"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  placeholder="الصق عنوان محفظتك هنا"
                  className="bg-slate-800/50 border-purple-500/30"
                />
                <Button onClick={handleManualConnect} className="w-full bg-gradient-to-l from-purple-600 to-pink-600">
                  استخدام هذا العنوان
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
