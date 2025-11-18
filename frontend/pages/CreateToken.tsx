import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import WalletConnect from "../components/WalletConnect";
import NetworkSwitcher from "../components/NetworkSwitcher";
import LogoUpload from "../components/LogoUpload";
import FeeCalculator from "../components/FeeCalculator";
import TransactionPreview from "../components/TransactionPreview";
import backend from "~backend/client";

export default function CreateToken() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [network, setNetwork] = useState<"devnet" | "mainnet">("devnet");
  const [walletAddress, setWalletAddress] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    decimals: 9,
    supply: 1000000,
    description: "",
    creatorName: "",
    creatorWebsite: "",
    twitterUrl: "",
    telegramUrl: "",
    discordUrl: "",
    customPageUrl: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress) {
      toast({
        title: "خطأ",
        description: "يرجى توصيل المحفظة أولاً",
        variant: "destructive",
      });
      return;
    }

    setShowPreview(true);
  };

  const handleConfirmTransaction = async (signature: string) => {
    try {
      const userId = localStorage.getItem("userId") || crypto.randomUUID();
      localStorage.setItem("userId", userId);

      const token = await backend.token.create({
        userId,
        ...formData,
        logoUrl,
        network,
        transactionSignature: signature,
      });

      toast({
        title: "نجح الإنشاء!",
        description: "تم إنشاء العملة الرقمية بنجاح",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating token:", error);
      toast({
        title: "فشل الإنشاء",
        description: "حدث خطأ أثناء حفظ بيانات العملة",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-l from-purple-400 to-pink-400 bg-clip-text text-transparent">
          إنشاء عملة MEME جديدة
        </h1>
        <p className="text-slate-400">املأ جميع التفاصيل لإنشاء عملتك الرقمية على Solana</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <WalletConnect onConnect={setWalletAddress} />
        <NetworkSwitcher network={network} onChange={setNetwork} />
        <FeeCalculator network={network} />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Main Information */}
          <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">المعلومات الأساسية</CardTitle>
              <CardDescription>تفاصيل العملة الرقمية الرئيسية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم العملة *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: Doge Coin"
                  className="bg-slate-800/50 border-purple-500/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="symbol">الرمز (Symbol) *</Label>
                <Input
                  id="symbol"
                  required
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                  placeholder="مثال: DOGE"
                  maxLength={10}
                  className="bg-slate-800/50 border-purple-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="decimals">الكسور العشرية</Label>
                  <Input
                    id="decimals"
                    type="number"
                    min="0"
                    max="9"
                    value={formData.decimals}
                    onChange={(e) => setFormData({ ...formData, decimals: parseInt(e.target.value) })}
                    className="bg-slate-800/50 border-purple-500/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supply">العرض الكلي *</Label>
                  <Input
                    id="supply"
                    type="number"
                    required
                    min="1"
                    value={formData.supply}
                    onChange={(e) => setFormData({ ...formData, supply: parseInt(e.target.value) })}
                    className="bg-slate-800/50 border-purple-500/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="وصف مختصر للعملة الرقمية..."
                  rows={4}
                  className="bg-slate-800/50 border-purple-500/30 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Logo Upload */}
          <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">الشعار (Logo)</CardTitle>
              <CardDescription>ارفع صورة أو استخدم الذكاء الاصطناعي</CardDescription>
            </CardHeader>
            <CardContent>
              <LogoUpload onUpload={setLogoUrl} currentUrl={logoUrl} />
            </CardContent>
          </Card>

          {/* Creator Information */}
          <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">معلومات المنشئ</CardTitle>
              <CardDescription>اختياري - يساعد في بناء الثقة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="creatorName">اسم المنشئ</Label>
                <Input
                  id="creatorName"
                  value={formData.creatorName}
                  onChange={(e) => setFormData({ ...formData, creatorName: e.target.value })}
                  placeholder="اسمك أو اسم الفريق"
                  className="bg-slate-800/50 border-purple-500/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="creatorWebsite">الموقع الإلكتروني</Label>
                <Input
                  id="creatorWebsite"
                  type="url"
                  value={formData.creatorWebsite}
                  onChange={(e) => setFormData({ ...formData, creatorWebsite: e.target.value })}
                  placeholder="https://example.com"
                  className="bg-slate-800/50 border-purple-500/30"
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">روابط التواصل الاجتماعي</CardTitle>
              <CardDescription>اختياري - للتواصل مع المجتمع</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="twitter">تويتر (X)</Label>
                <Input
                  id="twitter"
                  type="url"
                  value={formData.twitterUrl}
                  onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                  placeholder="https://twitter.com/..."
                  className="bg-slate-800/50 border-purple-500/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telegram">تيليجرام</Label>
                <Input
                  id="telegram"
                  type="url"
                  value={formData.telegramUrl}
                  onChange={(e) => setFormData({ ...formData, telegramUrl: e.target.value })}
                  placeholder="https://t.me/..."
                  className="bg-slate-800/50 border-purple-500/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discord">ديسكورد</Label>
                <Input
                  id="discord"
                  type="url"
                  value={formData.discordUrl}
                  onChange={(e) => setFormData({ ...formData, discordUrl: e.target.value })}
                  placeholder="https://discord.gg/..."
                  className="bg-slate-800/50 border-purple-500/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customPage">صفحة مخصصة</Label>
                <Input
                  id="customPage"
                  type="url"
                  value={formData.customPageUrl}
                  onChange={(e) => setFormData({ ...formData, customPageUrl: e.target.value })}
                  placeholder="https://..."
                  className="bg-slate-800/50 border-purple-500/30"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            type="submit"
            size="lg"
            className="bg-gradient-to-l from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-12"
            disabled={!walletAddress}
          >
            معاينة المعاملة
          </Button>
        </div>
      </form>

      {showPreview && (
        <TransactionPreview
          formData={formData}
          network={network}
          walletAddress={walletAddress}
          logoUrl={logoUrl}
          onConfirm={handleConfirmTransaction}
          onCancel={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
