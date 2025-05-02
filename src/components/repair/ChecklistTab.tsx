
import React from "react";
import { Button } from "@/components/ui/button";
import { ListChecks, CheckSquare } from "lucide-react";
import { ChecklistCategory } from "./checklist/ChecklistCategory";
import { ChecklistSummary } from "./checklist/ChecklistSummary";
import { ChecklistItem, ChecklistStatus } from "@/types";
import { toast } from "sonner";

interface ChecklistCategoryItem {
  name: string;
  icon: React.ReactNode;
  items: {
    id: string;
    name: string;
    category: string;
  }[];
}

interface ChecklistTabProps {
  checklistCategories: ChecklistCategoryItem[];
  checklistData: ChecklistItem[];
  onStatusChange: (id: string, status: ChecklistStatus, notes: string) => void;
  onBack: () => void;
  getTotalProgress: () => number;
  getCategoryProgressPercentage: (categoryName: string) => number;
  customerConfirmed: boolean;
  customerComments: string;
  handleAddNotes: (itemId: string, currentStatus: ChecklistStatus) => void;
  handleCapturePhoto: (itemId: string) => void;
  completeIntakeAndGenerateQuote: () => void;
}

export function ChecklistTab({
  checklistCategories,
  checklistData,
  onStatusChange,
  onBack,
  getTotalProgress,
  getCategoryProgressPercentage,
  customerConfirmed,
  customerComments,
  handleAddNotes,
  handleCapturePhoto,
  completeIntakeAndGenerateQuote,
}: ChecklistTabProps) {
  return (
    <div className="space-y-6">
      {/* Total progress indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium">Inspection Progress</h3>
          </div>
          <span className="text-sm font-medium">{getTotalProgress()}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${getTotalProgress()}%` }}
          ></div>
        </div>
      </div>

      {checklistCategories.map((category) => (
        <ChecklistCategory
          key={category.name}
          name={category.name}
          icon={category.icon}
          items={category.items}
          checklistData={checklistData}
          progress={getCategoryProgressPercentage(category.name)}
          onStatusChange={onStatusChange}
          onAddNotes={handleAddNotes}
          onCapturePhoto={handleCapturePhoto}
        />
      ))}
      
      <ChecklistSummary 
        checklistData={checklistData}
        customerConfirmed={customerConfirmed}
        customerComments={customerComments}
        totalProgress={getTotalProgress()}
      />
      
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
        <div className="order-2 sm:order-1">
          <Button variant="outline" onClick={onBack}>
            Back to Intake Information
          </Button>
        </div>
        <div className="order-1 sm:order-2">
          <Button 
            onClick={completeIntakeAndGenerateQuote}
            className={`w-full sm:w-auto ${getTotalProgress() < 100 ? 'bg-blue-500' : 'bg-green-500'}`}
            disabled={getTotalProgress() === 0}
          >
            {customerConfirmed 
              ? "Complete Intake & Generate Quote" 
              : "Get Customer Confirmation & Complete"
            }
          </Button>
        </div>
      </div>
    </div>
  );
}
