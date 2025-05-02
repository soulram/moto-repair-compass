
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileText, Camera, AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
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
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "monitor":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "replace":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "not-checked":
      default:
        return <AlertCircle className="h-5 w-5 text-gray-300" />;
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
