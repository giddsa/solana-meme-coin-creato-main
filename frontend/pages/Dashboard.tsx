import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import TokenCard from "../components/TokenCard";
import NetworkSwitcher from "../components/NetworkSwitcher";
import backend from "~backend/client";
import type { Token } from "~backend/token/create";

export default function Dashboard() {
  const { toast } = useToast();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [network, setNetwork] = useState<"devnet" | "mainnet">("devnet");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTokens();
  }, [network]);

  const loadTokens = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      
      if (!userId) {
        setTokens([]);
        return;
      }

      const response = await backend.token.list({ userId, network });
      setTokens(response.tokens);
    } catch (error) {
      console.error("Error loading tokens:", error);
      toast({
        title: "خطأ",
        description: "فشل تحميل العملات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await backend.token.deleteToken({ id });
      toast({
        title: "تم الحذف",
        description: "تم حذف العملة بنجاح",
      });
      loadTokens();
    } catch (error) {
      console.error("Error deleting token:", error);
      toast({
        title: "خطأ",
        description: "فشل حذف العملة",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-l from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            لوحة التحكم
          </h1>
          <p className="text-slate-400">جميع العملات الرقمية التي أنشأتها</p>
        </div>
        <div className="flex gap-4">
          <NetworkSwitcher network={network} onChange={setNetwork} />
          <Link to="/create">
            <Button className="bg-gradient-to-l from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              إنشاء عملة جديدة
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-slate-400 mt-4">جاري التحميل...</p>
        </div>
      ) : tokens.length === 0 ? (
        <Card className="bg-slate-900/50 border-purple-500/30 backdrop-blur-sm">
          <CardContent className="py-12 text-center">
            <p className="text-slate-400 text-lg mb-6">لم تنشئ أي عملات رقمية بعد</p>
            <Link to="/create">
              <Button className="bg-gradient-to-l from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                إنشاء عملتك الأولى
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokens.map((token) => (
            <TokenCard key={token.id} token={token} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
