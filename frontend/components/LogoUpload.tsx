import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Sparkles, X } from "lucide-react";

interface LogoUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
}

export default function LogoUpload({ onUpload, currentUrl }: LogoUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "خطأ",
        description: "يرجى رفع صورة فقط",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onUpload(result);
      toast({
        title: "تم الرفع",
        description: "تم رفع الصورة بنجاح",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAIGenerate = () => {
    toast({
      title: "قريباً",
      description: "ميزة الذكاء الاصطناعي قيد التطوير",
    });
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-purple-400 bg-purple-950/30"
            : "border-purple-500/30 bg-slate-800/30"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {currentUrl ? (
          <div className="relative">
            <img
              src={currentUrl}
              alt="Logo"
              className="max-w-full max-h-48 mx-auto rounded-lg"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 left-2"
              onClick={() => onUpload("")}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <p className="text-slate-300 mb-2">اسحب الصورة هنا أو انقر للرفع</p>
            <p className="text-sm text-slate-500">PNG, JPG, GIF (حد أقصى 5MB)</p>
          </>
        )}
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 border-purple-500/30"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-4 h-4 ml-2" />
          رفع صورة
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1 border-purple-500/30"
          onClick={handleAIGenerate}
        >
          <Sparkles className="w-4 h-4 ml-2" />
          توليد بالذكاء الاصطناعي
        </Button>
      </div>
    </div>
  );
}
