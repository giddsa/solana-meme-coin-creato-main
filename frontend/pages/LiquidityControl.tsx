import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Shield, Clock, Users } from "lucide-react";
import backend from "~backend/client";
import type { Token } from "~backend/token/create";
import type { LiquidityControl } from "~backend/liquidity/create";

export default function LiquidityControl() {
  const { tokenId } = useParams();
  const { toast } = useToast();
  const [token, setToken] = useState<Token | null>(null);
  const [control, setControl] = useState<LiquidityControl | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    multiSigEnabled: false,
    requiredSignatures: 2,
    timelockDuration: 7,
    withdrawalAddresses: [""],
  });

  useEffect(() => {
    loadData();
  }, [tokenId]);

  const loadData = async () => {
    if (!tokenId) return;

    try {
      setLoading(true);
      const tokenData = await backend.token.get({ id: tokenId });
      setToken(tokenData);

      try {
        const controlData = await backend.liquidity.get({ tokenId });
        setControl(controlData);
        setFormData({
          multiSigEnabled: controlData.multiSigEnabled,
          requiredSignatures: controlData.requiredSignatures,
          timelockDuration: controlData.timelockDuration,
          withdrawalAddresses: controlData.withdrawalAddresses.length > 0 
            ? controlData.withdrawalAddresses 
            : [""],
        });
      } catch (error) {
        // No existing control settings
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "خطأ",
        description: "فشل تحميل البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    setFormData({
      ...formData,
      withdrawalAddresses: [...formData.withdrawalAddresses, ""],
    });
  };

  const handleRemoveAddress = (index: number) => {
    const newAddresses = formData.withdrawalAddresses.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      withdrawalAddresses: newAddresses.length > 0 ? newAddresses : [""],
    });
  };

  const handleAddressChange = (index: number, value: string) => {
    const newAddresses = [...formData.withdrawalAddresses];
    newAddresses[index] = value;
    setFormData({
      ...formData,
      withdrawalAddresses: newAddresses,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tokenId) return;

    try {
      await backend.liquidity.create({
        tokenId,
        ...formData,
        withdrawalAddresses: formData.withdrawalAddresses.filter(addr => addr.trim() !== ""),
      });

      toast({
        title: "نجح الحفظ",
        description: "تم حفظ إعدادات السيولة بنجاح",
      });

      loadData();
    } catch (error) {
      console.error("Error saving liquidity control:", error);
      toast({
        title: "فشل الحفظ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-slate-400 mt-4">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur-sm">
          <CardContent className="py-12 text-center">
            <p className="text-slate-400 text-lg mb-6">العملة غير موجودة</p>
            <Link to="/dashboard">
              <Button>العودة للوحة التحكم</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-6">
        <ArrowLeft className="w-4 h-4" />
        العودة للوحة التحكم
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-l from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          التحكم في السيولة
        </h1>
        <p className="text-slate-400">
          {token.name} ({token.symbol})
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Multi-Sig Card */}
        <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-purple-400" />
              <div>
                <CardTitle className="text-2xl">Multi-Signature</CardTitle>
                <CardDescription>يتطلب توقيعات متعددة للسحب</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="multiSig" className="text-lg">تفعيل Multi-Sig</Label>
              <Switch
                id="multiSig"
                checked={formData.multiSigEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, multiSigEnabled: checked })}
              />
            </div>

            {formData.multiSigEnabled && (
              <div className="space-y-2">
                <Label htmlFor="requiredSigs">عدد التوقيعات المطلوبة</Label>
                <Input
                  id="requiredSigs"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.requiredSignatures}
                  onChange={(e) => setFormData({ ...formData, requiredSignatures: parseInt(e.target.value) })}
                  className="bg-slate-800/50 border-purple-500/30"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timelock Card */}
        <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-purple-400" />
              <div>
                <CardTitle className="text-2xl">Timelock</CardTitle>
                <CardDescription>فترة انتظار قبل السحب</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="timelock">مدة Timelock (بالأيام)</Label>
            <Input
              id="timelock"
              type="number"
              min="0"
              value={formData.timelockDuration}
              onChange={(e) => setFormData({ ...formData, timelockDuration: parseInt(e.target.value) })}
              className="bg-slate-800/50 border-purple-500/30"
            />
            <p className="text-sm text-slate-400">0 = بدون timelock</p>
          </CardContent>
        </Card>

        {/* Withdrawal Addresses Card */}
        <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-purple-400" />
              <div>
                <CardTitle className="text-2xl">عناوين السحب المصرح بها</CardTitle>
                <CardDescription>فقط هذه العناوين يمكنها السحب</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.withdrawalAddresses.map((address, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={address}
                  onChange={(e) => handleAddressChange(index, e.target.value)}
                  placeholder="عنوان المحفظة على Solana"
                  className="bg-slate-800/50 border-purple-500/30"
                />
                {formData.withdrawalAddresses.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleRemoveAddress(index)}
                  >
                    حذف
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddAddress}
              className="w-full border-purple-500/30"
            >
              إضافة عنوان
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button
            type="submit"
            size="lg"
            className="bg-gradient-to-l from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-12"
          >
            حفظ الإعدادات
          </Button>
        </div>
      </form>
    </div>
  );
}
