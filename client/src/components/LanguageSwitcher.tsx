import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";
import { useI18n, Language } from "@/i18n";

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

  const languages: { code: Language; label: string; nativeLabel: string }[] = [
    { code: "en", label: "English", nativeLabel: "English" },
    { code: "ar", label: "Arabic", nativeLabel: "العربية" },
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
      <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="cursor-pointer hover:bg-white/5 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
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
