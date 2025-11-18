import { Link } from "react-router-dom";
import { Rocket, Shield, Coins, Network, Lock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Home() {
  const features = [
    {
      icon: Rocket,
      title: "إنشاء سريع",
      description: "أنشئ عملة MEME الخاصة بك على Solana في دقائق",
    },
    {
      icon: Shield,
      title: "أمان متقدم",
      description: "إلغاء صلاحيات التجميد والسك والتحديث",
    },
    {
      icon: Coins,
      title: "إدارة السيولة",
      description: "Multi-Sig و Timelock للتحكم في السحب",
    },
    {
      icon: Network,
      title: "دعم الشبكات",
      description: "اختبر على Devnet أو انشر على Mainnet",
    },
    {
      icon: Lock,
      title: "شفافية كاملة",
      description: "معاينة جميع المعاملات قبل التوقيع",
    },
    {
      icon: Users,
      title: "ربط المحفظة",
      description: "Phantom تلقائي أو إدخال يدوي",
    },
  ];

  const steps = [
    "قم بتوصيل محفظتك (Phantom أو يدوياً)",
    "املأ تفاصيل العملة الرقمية",
    "ارفع الشعار أو استخدم الذكاء الاصطناعي",
    "راجع المعاملة ووقّع عليها",
    "أنشئ حوض السيولة على Raydium/Orca",
    "قم بإعداد Multi-Sig و Timelock",
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Hero Section */}
      <div className="text-center mb-16 space-y-6">
        <h1 className="text-6xl font-bold bg-gradient-to-l from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          منشئ عملات MEME على Solana
        </h1>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
          أنشئ عملتك الرقمية الخاصة على شبكة Solana مع ميزات أمان متقدمة وتحكم كامل في السيولة
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/create">
            <Button size="lg" className="bg-gradient-to-l from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8">
              ابدأ الإنشاء الآن
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button size="lg" variant="outline" className="text-lg px-8 border-purple-500 hover:bg-purple-950/50">
              لوحة التحكم
            </Button>
          </Link>
        </div>
      </div>

      {/* Warning Alert */}
      <Alert className="mb-12 border-yellow-500/50 bg-yellow-950/20 backdrop-blur-sm">
        <AlertTitle className="text-yellow-400 text-lg font-bold">⚠️ تحذير قانوني مهم</AlertTitle>
        <AlertDescription className="text-yellow-200/80 space-y-2 mt-2">
          <p>
            هذه الأداة مخصصة للأغراض التعليمية والتجريبية فقط. إنشاء العملات الرقمية والتعامل معها قد يخضع للقوانين واللوائح المحلية.
          </p>
          <p>
            نحن لسنا مسؤولين عن أي استخدام غير قانوني أو غير مسؤول. يرجى استشارة محامٍ قبل إطلاق أي عملة رقمية.
          </p>
          <p className="font-bold">
            استخدم Devnet أولاً للاختبار. لا تستثمر أموالاً لا يمكنك تحمل خسارتها.
          </p>
        </AlertDescription>
      </Alert>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {features.map((feature, index) => (
          <Card key={index} className="bg-slate-900/50 border-purple-500/30 backdrop-blur-sm hover:border-purple-500/60 transition-all">
            <CardHeader>
              <feature.icon className="w-12 h-12 text-purple-400 mb-4" />
              <CardTitle className="text-xl text-slate-100">{feature.title}</CardTitle>
              <CardDescription className="text-slate-400">{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Steps Section */}
      <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-3xl text-center mb-4">خطوات الإنشاء</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800/70 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-lg">
                  {index + 1}
                </div>
                <p className="text-slate-200 text-lg pt-1">{step}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technical Info */}
      <div className="mt-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-200">المواصفات التقنية</h2>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
          <span className="px-4 py-2 rounded-full bg-slate-800/50 border border-purple-500/30">@solana/web3.js</span>
          <span className="px-4 py-2 rounded-full bg-slate-800/50 border border-purple-500/30">@solana/spl-token</span>
          <span className="px-4 py-2 rounded-full bg-slate-800/50 border border-purple-500/30">SPL Token Standard</span>
          <span className="px-4 py-2 rounded-full bg-slate-800/50 border border-purple-500/30">Raydium / Orca Compatible</span>
        </div>
      </div>
    </div>
  );
}
