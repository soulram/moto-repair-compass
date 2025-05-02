
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileText, Camera } from "lucide-react";
import { ChecklistStatus } from "@/types";

interface ChecklistItemProps {
  id: string;
  name: string;
  status: ChecklistStatus;
  notes: string;
  onStatusChange: (id: string, status: ChecklistStatus, notes: string) => void;
  onAddNotes: (id: string, status: ChecklistStatus) => void;
  onCapturePhoto: (id: string) => void;
}

export function ChecklistItem({
  id,
  name,
  status,
  notes,
  onStatusChange,
  onAddNotes,
  onCapturePhoto,
}: ChecklistItemProps) {
  const getStatusClass = (status: ChecklistStatus) => {
    switch (status) {
      case "ok":
        return "border-green-200 bg-green-50";
      case "monitor":
        return "border-yellow-200 bg-yellow-50";
      case "replace":
        return "border-red-200 bg-red-50";
      case "not-checked":
      default:
        return "border-gray-200";
    }
  };

  const getStatusIcon = (status: ChecklistStatus) => {
    switch (status) {
      case "ok":
        return (
          <div className="h-5 w-5 text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
        );
      case "monitor":
        return (
          <div className="h-5 w-5 text-yellow-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
        );
      case "replace":
        return (
          <div className="h-5 w-5 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
        );
      case "not-checked":
      default:
        return (
          <div className="h-5 w-5 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
        );
    }
  };

  return (
    <div 
      className={`p-4 flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 transition-colors ${getStatusClass(status)}`}
    >
      <div className="flex items-start gap-3">
        {getStatusIcon(status)}
        <div>
          <div className="font-medium">{name}</div>
          {notes && (
            <div className="text-sm text-muted-foreground mt-1 bg-white bg-opacity-50 p-2 rounded border border-gray-100">
              {notes}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <RadioGroup 
          value={status} 
          onValueChange={(value) => onStatusChange(
            id, 
            value as ChecklistStatus, 
            notes || ""
          )}
          className="flex items-center space-x-2"
        >
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="ok" id={`${id}-ok`} />
            <Label 
              htmlFor={`${id}-ok`}
              className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-md cursor-pointer"
            >
              OK
            </Label>
          </div>
          
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="monitor" id={`${id}-monitor`} />
            <Label 
              htmlFor={`${id}-monitor`}
              className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md cursor-pointer"
            >
              Monitor
            </Label>
          </div>
          
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="replace" id={`${id}-replace`} />
            <Label 
              htmlFor={`${id}-replace`}
              className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-md cursor-pointer"
            >
              Replace
            </Label>
          </div>
        </RadioGroup>
        
        <div className="flex items-center space-x-2 ml-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => onAddNotes(id, status)}
          >
            <FileText className="h-4 w-4" />
            <span className="sr-only">Add notes</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onCapturePhoto(id)}
          >
            <Camera className="h-4 w-4" />
            <span className="sr-only">Take photo</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
