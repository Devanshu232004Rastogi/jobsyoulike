// "use client";

// import { useState } from "react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
// } from "@/components/ui/command";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Check, ChevronsUpDown } from "lucide-react";

// interface ComboBoxProps {
//   options: { label: string; value: string }[];
//   value: string;
//   onChange: (value: string) => void;
//   heading: string;
// }

// export const ComboBox = ({ options, value, onChange, heading }: ComboBoxProps) => {
//   const [open, setOpen] = useState(false);

//   const selectedOption = options.find((option) => option.value === value);

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           role="combobox"
//           aria-expanded={open}
//           className="w-[200px] justify-between"
//         >
//           {selectedOption ? selectedOption.label : `Select ${heading}...`}
//           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-[200px] p-0">
//         <Command>
//           <CommandInput placeholder={`Search ${heading}...`} />
//           <CommandEmpty>No {heading} found.</CommandEmpty>
//           <CommandGroup>
//             {options.map((option) => (
//               <CommandItem
//                 key={option.value}
//                 value={option.label}
//                 onSelect={() => {
//                   onChange(option.value);
//                   setOpen(false);
//                 }}
//               >
//                 <Check
//                   className={cn(
//                     "mr-2 h-4 w-4",
//                     value === option.value ? "opacity-100" : "opacity-0"
//                   )}
//                 />
//                 {option.label}
//               </CommandItem>
//             ))}
//           </CommandGroup>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// };

// export default ComboBox;
"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";

interface ComboBoxProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  heading: string;
  placeholder?: string;
}

export const ComboBox = ({ 
  options, 
  value, 
  onChange, 
  heading, 
  placeholder 
}: ComboBoxProps) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full bg-white text-left justify-between"
        >
          {selectedOption ? selectedOption.label : placeholder || `Select ${heading}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-full p-0 bg-white shadow-md border border-gray-200" 
        align="start"
        sideOffset={5}
      >
        <Command className="bg-white">
          <CommandInput placeholder={`Search ${heading}...`} className="h-9" />
          <CommandEmpty>No {heading} found.</CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-y-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.label}
                onSelect={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className="flex items-center hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboBox;