import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  MoreHorizontal,
  Pencil,
  Link,
  Loader2,
  Loader,
  BadgeCheck,
  BadgeAlert,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface CellActionsProps {
  id: string;
  fullName: string;
  email: string;
}

export const CellAction = ({ id, fullName, email }: CellActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRejection, setIsRejection] = useState(false);

  const sendSelected = async () => {
    // Implement selection logic here
    setIsLoading(true);
    try {
        await axios.post("/api/sendSelected" ,{ email , fullName})
        toast.success("Selection Mail Sent")
        setIsLoading(false);
    } catch (error) {
      console.error("Selection failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendRejection = async () => {
    // Implement rejection logic here
    setIsRejection(true);
    try {
        await axios.post("/api/sendRejected" ,{ email , fullName})
        toast.success("Selection Mail Sent")
        setIsLoading(false);  
    } catch (error) {
      console.error("Rejection failed", error);
    } finally {
      setIsRejection(false);
    }
  };

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-4 w-4">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-slate-200">
        {isLoading ? (
          <DropdownMenuItem className=" flex items-center justify-center ">
            <Loader className="animate-spin w-4 h-4" />
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="flex items-center"
            onClick={sendSelected}
          >
            <BadgeCheck className="w-4 h-4 mr-2" />
            Selected
          </DropdownMenuItem>
        )}

        {isRejection ? (
          <DropdownMenuItem className=" flex items-center justify-center ">
           <Loader className="w-4 h-4 animate-spin"/>
          </DropdownMenuItem>
        ) : (
            <DropdownMenuItem
            className="flex items-center"
            onClick={sendRejection}
          >
            <BadgeAlert className="w-4 h-4 mr-2" />
            Rejected
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CellAction;
