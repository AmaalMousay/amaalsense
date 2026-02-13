import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";
import { useI18n, type Language } from "@/i18n";

interface LanguageSwitcherProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
}

export function LanguageSwitcher({ 
  variant = "ghost", 
  size = "icon",
  showLabel = false 
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useI18n();

  const languages: { code: Language; label: string; nativeLabel: string; flag: string }[] = [
    { code: "en", label: "English", nativeLabel: "English", flag: "🇺🇸" },
    { code: "ar", label: "Arabic", nativeLabel: "العربية", flag: "🇸🇦" },
    { code: "fr", label: "French", nativeLabel: "Français", flag: "🇫🇷" },
    { code: "de", label: "German", nativeLabel: "Deutsch", flag: "🇩🇪" },
    { code: "es", label: "Spanish", nativeLabel: "Español", flag: "🇪🇸" },
    { code: "ru", label: "Russian", nativeLabel: "Русский", flag: "🇷🇺" },
    { code: "zh", label: "Chinese", nativeLabel: "中文", flag: "🇨🇳" },
    { code: "ja", label: "Japanese", nativeLabel: "日本語", flag: "🇯🇵" },
  ];

  const currentLang = languages.find(l => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Globe className="w-4 h-4" />
          {showLabel && <span>{currentLang?.nativeLabel}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 max-h-80 overflow-y-auto">
        <div className="px-2 py-1.5 text-xs text-slate-500 font-medium">
          Select Language
        </div>
        <DropdownMenuSeparator className="bg-white/10" />
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="cursor-pointer hover:bg-white/5 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <span className="text-base">{lang.flag}</span>
              <span>{lang.nativeLabel}</span>
              <span className="text-xs text-slate-500">({lang.label})</span>
            </span>
            {language === lang.code && (
              <Check className="w-4 h-4 text-cyan-400" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
