import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { X, CheckCircle, Copy, ExternalLink } from "lucide-react";
import { generateMockSignature } from "../utils/solana";

interface TransactionPreviewProps {
  formData: any;
  network: string;
  walletAddress: string;
  logoUrl: string;
  onConfirm: (signature: string) => void;
  onCancel: () => void;
}

export default function TransactionPreview({
  formData,
  network,
  walletAddress,
  logoUrl,
  onConfirm,
  onCancel,
}: TransactionPreviewProps) {
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [showManualTx, setShowManualTx] = useState(false);

  const mockTransaction = {
    instructions: [
      {
        program: "Token Program",
        type: "CreateMint",
        decimals: formData.decimals,
      },
      {
        program: "Token Program",
        type: "InitializeMint",
        supply: formData.supply,
      },
      {
        program: "Metadata Program",
        type: "CreateMetadata",
        name: formData.name,
        symbol: formData.symbol,
        uri: logoUrl || "https://example.com/metadata.json",
      },
    ],
    estimatedFee: network === "devnet" ? 0 : 0.003,
    signers: [walletAddress],
  };

  const handleSignWithPhantom = async () => {
    setProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const mockSignature = generateMockSignature();
      
      toast({
        title: "تم التوقيع بنجاح",
        description: "جاري إرسال المعاملة...",
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      onConfirm(mockSignature);
    } catch (error) {
      console.error("Error signing transaction:", error);
      toast({
        title: "فشل التوقيع",
        description: "حدث خطأ أثناء التوقيع على المعاملة",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleCopyRawTransaction = () => {
    const rawTx = JSON.stringify(mockTransaction, null, 2);
    navigator.clipboard.writeText(rawTx);
    toast({
      title: "تم النسخ",
      description: "تم نسخ المعاملة إلى الحافظة",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="bg-slate-900 border-purple-500/50 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">معاينة المعاملة</CardTitle>
              <CardDescription>راجع التفاصيل قبل التوقيع</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Token Details */}
          <div className="p-4 rounded-lg bg-slate-800/50 border border-purple-500/30">
            <h3 className="text-lg font-semibold mb-4 text-purple-400">تفاصيل العملة</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">الاسم:</p>
                <p className="text-slate-200 font-semibold">{formData.name}</p>
              </div>
              <div>
                <p className="text-slate-500">الرمز:</p>
                <p className="text-slate-200 font-semibold">{formData.symbol}</p>
              </div>
              <div>
                <p className="text-slate-500">العرض الكلي:</p>
                <p className="text-slate-200 font-semibold">{formData.supply.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-500">الكسور العشرية:</p>
                <p className="text-slate-200 font-semibold">{formData.decimals}</p>
              </div>
            </div>
          </div>

          {/* Transaction Instructions */}
          <div className="p-4 rounded-lg bg-slate-800/50 border border-purple-500/30">
            <h3 className="text-lg font-semibold mb-4 text-purple-400">تعليمات المعاملة</h3>
            <div className="space-y-2">
              {mockTransaction.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded bg-slate-900/50">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-200">{instruction.type}</p>
                    <p className="text-sm text-slate-400">{instruction.program}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Network and Fees */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-800/50 border border-purple-500/30">
              <p className="text-slate-500 text-sm mb-1">الشبكة:</p>
              <p className="text-slate-200 font-semibold">{network === "devnet" ? "Devnet" : "Mainnet"}</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-800/50 border border-purple-500/30">
              <p className="text-slate-500 text-sm mb-1">الرسوم المتوقعة:</p>
              <p className="text-slate-200 font-semibold">{mockTransaction.estimatedFee} SOL</p>
            </div>
          </div>

          {/* Warnings */}
          <Alert className="border-yellow-500/50 bg-yellow-950/20">
            <AlertDescription className="text-yellow-200/80">
              <p className="font-bold mb-2">⚠️ تنبيهات مهمة:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>تأكد من مراجعة جميع التفاصيل بعناية قبل التوقيع</li>
                <li>المعاملات على البلوكتشين لا يمكن التراجع عنها</li>
                <li>احتفظ بنسخة من عنوان المحفظة وتفاصيل العملة</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSignWithPhantom}
              disabled={processing}
              className="flex-1 bg-gradient-to-l from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {processing ? "جاري التوقيع..." : "توقيع وإرسال (Phantom)"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowManualTx(!showManualTx)}
              className="border-purple-500/30"
            >
              {showManualTx ? "إخفاء" : "معاملة يدوية"}
            </Button>
          </div>

          {/* Manual Transaction */}
          {showManualTx && (
            <div className="p-4 rounded-lg bg-slate-800/50 border border-purple-500/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-purple-400">المعاملة الخام (للتوقيع اليدوي)</h4>
                <Button variant="ghost" size="sm" onClick={handleCopyRawTransaction}>
                  <Copy className="w-4 h-4 ml-2" />
                  نسخ
                </Button>
              </div>
              <pre className="text-xs bg-slate-900/50 p-3 rounded overflow-x-auto text-slate-300">
                {JSON.stringify(mockTransaction, null, 2)}
              </pre>
              <p className="text-sm text-slate-400 mt-3">
                انسخ هذه المعاملة ووقّع عليها يدوياً باستخدام أداة خارجية، ثم الصق التوقيع هنا.
              </p>
            </div>
          )}

          {/* Instructions for liquidity */}
          <Alert className="border-blue-500/50 bg-blue-950/20">
            <AlertDescription className="text-blue-200/80 space-y-2">
              <p className="font-bold">📝 الخطوات التالية بعد الإنشاء:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>انتظر تأكيد المعاملة على البلوكتشين</li>
                <li>انتقل إلى Raydium أو Orca لإنشاء حوض السيولة</li>
                <li>قم بإعداد Multi-Sig و Timelock من لوحة التحكم</li>
                <li>فكر في إلغاء صلاحيات Freeze/Mint/Update للأمان</li>
              </ol>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
