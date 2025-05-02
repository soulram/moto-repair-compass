
import React from "react";
import { CheckCircle2, AlertCircle, ListChecks, ClipboardCheck } from "lucide-react";
import { ChecklistItem } from "@/types";

interface ChecklistSummaryProps {
  checklistData: ChecklistItem[];
  customerConfirmed: boolean;
  customerComments: string;
  totalProgress: number;
}

export function ChecklistSummary({
  checklistData,
  customerConfirmed,
  customerComments,
  totalProgress,
}: ChecklistSummaryProps) {
  const issuesFound = checklistData.filter(item => item.requiresAttention).length;

  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-md bg-gray-50">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-blue-500" />
              <p className="font-medium">Inspection Summary</p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {checklistData.filter(item => item.status !== "not-checked").length} of {checklistData.length} items checked
            </p>
          </div>
          <div className="text-right">
            {issuesFound > 0 ? (
              <div className="bg-red-50 border border-red-100 rounded-md p-3">
                <p className="text-red-600 font-medium flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  {issuesFound} {issuesFound === 1 ? 'issue' : 'issues'} found
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {checklistData.filter(item => item.status === "replace").length} {checklistData.filter(item => item.status === "replace").length === 1 ? 'item' : 'items'} need replacement
                </p>
              </div>
            ) : (
              checklistData.filter(item => item.status !== "not-checked").length > 0 && (
                <div className="bg-green-50 border border-green-100 rounded-md p-3">
                  <p className="text-green-600 font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    No issues found
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      
      {customerConfirmed && (
        <div className="p-4 border rounded-md bg-green-50 flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-green-500" />
          <div>
            <p className="font-medium text-green-700">Customer has confirmed the checklist</p>
            {customerComments && (
              <p className="text-sm text-muted-foreground mt-1">
                Comments: {customerComments}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
