import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, FileImage, Loader2 } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

interface ExportButtonProps {
  type: "global" | "country";
  countryCode?: string;
  timeRange?: "1h" | "6h" | "24h" | "7d" | "30d";
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ExportButton({
  type,
  countryCode,
  timeRange = "24h",
  variant = "outline",
  size = "default",
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const globalReport = trpc.export.generateGlobalReport.useQuery(
    { timeRange },
    { enabled: false }
  );

  const countryReport = trpc.export.generateCountryReport.useQuery(
    { countryCode: countryCode || "US", timeRange },
    { enabled: false }
  );

  const handleExportHTML = async () => {
    setIsExporting(true);
    try {
      let result;
      if (type === "global") {
        result = await globalReport.refetch();
      } else if (countryCode) {
        result = await countryReport.refetch();
      }

      if (result?.data) {
        // Create blob and download
        const blob = new Blob([result.data.html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = result.data.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      let result;
      if (type === "global") {
        result = await globalReport.refetch();
      } else if (countryCode) {
        result = await countryReport.refetch();
      }

      if (result?.data) {
        // Open HTML in new window for printing to PDF
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(result.data.html);
          printWindow.document.close();
          printWindow.focus();
          // Add print button
          const printButton = printWindow.document.createElement("button");
          printButton.textContent = "Print to PDF";
          printButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            background: linear-gradient(90deg, #a855f7, #06b6d4);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            z-index: 9999;
          `;
          printButton.onclick = () => {
            printButton.style.display = "none";
            printWindow.print();
            printButton.style.display = "block";
          };
          printWindow.document.body.appendChild(printButton);
        }
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-slate-900 border-white/10">
        <DropdownMenuItem
          onClick={handleExportHTML}
          className="cursor-pointer hover:bg-white/5"
        >
          <FileText className="w-4 h-4 mr-2" />
          Export as HTML
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleExportPDF}
          className="cursor-pointer hover:bg-white/5"
        >
          <FileImage className="w-4 h-4 mr-2" />
          Print to PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
