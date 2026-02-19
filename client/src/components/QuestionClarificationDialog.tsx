import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ClarificationOption {
  id: string;
  text: string;
  confidence?: number;
}

interface QuestionClarificationDialogProps {
  isOpen: boolean;
  originalQuestion: string;
  clarifications: ClarificationOption[];
  onSelect: (clarificationId: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function QuestionClarificationDialog({
  isOpen,
  originalQuestion,
  clarifications,
  onSelect,
  onCancel,
  isLoading = false,
}: QuestionClarificationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            Clarify Your Question
          </DialogTitle>
          <DialogDescription>
            Your question could be interpreted in multiple ways. Please select the one you meant:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="p-3 bg-muted/50 rounded-lg border border-muted">
            <p className="text-sm font-medium text-muted-foreground">Original Question:</p>
            <p className="text-sm mt-1">{originalQuestion}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Did you mean:</p>
            {clarifications.map((clarification) => (
              <Button
                key={clarification.id}
                variant="outline"
                className="w-full justify-start text-left h-auto py-3 px-4"
                onClick={() => onSelect(clarification.id)}
                disabled={isLoading}
              >
                <div className="flex-1">
                  <p className="text-sm">{clarification.text}</p>
                  {clarification.confidence && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Confidence: {Math.round(clarification.confidence * 100)}%
                    </p>
                  )}
                </div>
              </Button>
            ))}
          </div>

          <Button
            variant="ghost"
            className="w-full"
            onClick={onCancel}
            disabled={isLoading}
          >
            Use Original Question
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
