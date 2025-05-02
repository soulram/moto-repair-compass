
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChecklistItem } from "./ChecklistItem";
import { CategoryProgress } from "./CategoryProgress";
import { ChecklistStatus } from "@/types";

interface CategoryItem {
  id: string;
  name: string;
  category: string;
}

interface ChecklistDataItem {
  id: string;
  name: string;
  category: string;
  status: ChecklistStatus;
  notes: string;
  requiresAttention: boolean;
}

interface ChecklistCategoryProps {
  name: string;
  icon: React.ReactNode;
  items: CategoryItem[];
  checklistData: ChecklistDataItem[];
  progress: number;
  onStatusChange: (id: string, status: ChecklistStatus, notes: string) => void;
  onAddNotes: (id: string, status: ChecklistStatus) => void;
  onCapturePhoto: (id: string) => void;
}

export function ChecklistCategory({
  name,
  icon,
  items,
  checklistData,
  progress,
  onStatusChange,
  onAddNotes,
  onCapturePhoto,
}: ChecklistCategoryProps) {
  // Count items by status
  const getStatusCounts = () => {
    const itemIds = items.map(item => item.id);
    const categoryItems = checklistData.filter(item => itemIds.includes(item.id));
    
    return {
      ok: categoryItems.filter(item => item.status === "ok").length,
      monitor: categoryItems.filter(item => item.status === "monitor").length,
      replace: categoryItems.filter(item => item.status === "replace").length,
      notChecked: categoryItems.filter(item => item.status === "not-checked").length,
    };
  };
  
  const statusCounts = getStatusCounts();

  return (
    <Accordion type="single" collapsible className="border rounded-md shadow-sm mb-4">
      <AccordionItem value={name}>
        <AccordionTrigger className="px-4 py-3 hover:bg-blue-50 group">
          <div className="flex items-center gap-3 flex-1">
            {icon}
            <span>{name}</span>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 mr-2">
                {statusCounts.replace > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
                    {statusCounts.replace} Replace
                  </span>
                )}
                {statusCounts.monitor > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                    {statusCounts.monitor} Monitor
                  </span>
                )}
                {statusCounts.ok > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                    {statusCounts.ok} OK
                  </span>
                )}
              </div>
              <CategoryProgress progress={progress} />
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-0 py-1">
          <div className="divide-y">
            {items.map((item) => {
              const checklistItem = checklistData.find((i) => i.id === item.id);
              const status = checklistItem?.status || "not-checked";
              
              return (
                <ChecklistItem 
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  status={status}
                  notes={checklistItem?.notes || ""}
                  onStatusChange={onStatusChange}
                  onAddNotes={onAddNotes}
                  onCapturePhoto={onCapturePhoto}
                />
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
