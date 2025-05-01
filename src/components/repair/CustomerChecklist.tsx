
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckSquare } from "lucide-react";

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

interface CustomerChecklistProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comments: string) => void;
}

export function CustomerChecklist({ isOpen, onClose, onConfirm }: CustomerChecklistProps) {
  const [checklistItems, setChecklistItems] = React.useState<ChecklistItem[]>([
    { id: "personal", text: "I understand that personal belongings should be removed before service", checked: false },
    { id: "estimate", text: "I understand that final costs may differ from initial estimates if additional issues are discovered", checked: false },
    { id: "time", text: "I understand that repair timeframes are estimates and may change based on parts availability and work complexity", checked: false },
    { id: "warranty", text: "I have been informed about the warranty conditions for parts and labor", checked: false },
    { id: "contact", text: "I agree to be contacted regarding the status of my repair", checked: false },
    { id: "authorization", text: "I authorize the repair center to perform the work as discussed", checked: false },
  ]);
  const [additionalComments, setAdditionalComments] = React.useState("");
  const [canConfirm, setCanConfirm] = React.useState(false);

  React.useEffect(() => {
    // Check if all items are checked to enable the confirm button
    setCanConfirm(checklistItems.every(item => item.checked));
  }, [checklistItems]);

  const handleChecklistChange = (id: string, checked: boolean) => {
    setChecklistItems(prev =>
      prev.map(item => 
        item.id === id ? { ...item, checked } : item
      )
    );
  };

  const handleConfirm = () => {
    if (canConfirm) {
      onConfirm(additionalComments);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-green-500" />
            Pre-Repair Confirmation
          </DialogTitle>
          <DialogDescription>
            Please review and confirm the following items before we proceed with your repair
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 py-2 pr-4">
            {checklistItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-2 border-b pb-2">
                <Checkbox 
                  id={`checklist-${item.id}`} 
                  checked={item.checked}
                  onCheckedChange={(checked) => handleChecklistChange(item.id, checked === true)}
                />
                <Label 
                  htmlFor={`checklist-${item.id}`}
                  className="flex-grow cursor-pointer text-sm" 
                >
                  {item.text}
                </Label>
              </div>
            ))}
            
            <div className="pt-2">
              <Label htmlFor="additional-comments">Additional Comments or Special Instructions</Label>
              <Textarea
                id="additional-comments"
                placeholder="Any specific concerns or requests..."
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            disabled={!canConfirm}
            onClick={handleConfirm}
          >
            I Confirm All Items
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
