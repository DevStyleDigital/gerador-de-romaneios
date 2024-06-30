"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils/cn";

export function Combobox({
  data,
  id,
  label,
  setValue,
  value,
  loading,
  form,
  align,
  fallback,
  hiddenSelect = [],
}: {
  data: { name: string; id: string | number }[];
  hiddenSelect?: (string | number)[];
  id: string;
  align?: "center" | "end";
  label: string;
  loading?: boolean;
  form?: string;
  value?: string;
  fallback?: string;
  setValue: (v: string | undefined) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover modal={false} open={open} onOpenChange={setOpen}>
      <div className="relative w-full">
        <input
          id={id}
          name={id}
          value={value || ""}
          onChange={() => {}}
          required
          form={form}
          className="absolute opacity-0 pointer-events-none"
          tabIndex={-1}
        />
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full overflow-hidden justify-between"
          >
            <span className="w-full truncate text-left">
              {loading
                ? "Carregando..."
                : value
                ? data.find(({ id }) => id.toString() === value)?.name ||
                  fallback
                : `Selecione ${
                    label[label.length - 1] === "o"
                      ? `um ${label}`
                      : `uma ${label}`
                  }`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent align={align} className="w-[370px] p-0">
        <Command>
          <CommandInput placeholder={`Selecione uma ${label}`} />
          <CommandEmpty>Nenhuma {label} encontrada.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {data
                .filter(({ id }) => !hiddenSelect.includes(id.toString()))
                .map((item) => (
                  <CommandItem
                    key={item.id}
                    value={`${item.id} ${item.name}`}
                    onSelect={(currentValue: string) => {
                      const id = currentValue.split(" ")[0];
                      id !== value && setValue(id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.id.toString()
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {item.name}
                  </CommandItem>
                ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
