
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
  return (
    <Accordion type="single" collapsible className="border rounded-md shadow-sm">
      <AccordionItem value={name}>
        <AccordionTrigger className="px-4 py-3 hover:bg-blue-50 group">
          <div className="flex items-center gap-3 flex-1">
            {icon}
            <span>{name}</span>
            <div className="ml-auto flex items-center gap-2">
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
