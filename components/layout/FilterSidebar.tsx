"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useDebounce } from "@/hooks/useDebounce";

type FilterSidebarProps = {
  statusOptions?: string[];
  selectedStatuses?: string[];
  onStatusChange?: (statuses: string[]) => void;

  enablePriceFilter?: boolean;
  minPrice?: number;
  maxPrice?: number;
  onPriceChange?: (range: { min: number; max: number }) => void;
};

export default function FilterSidebar({
  statusOptions = [],
  selectedStatuses = [],
  onStatusChange,
  enablePriceFilter = false,
  minPrice = 0,
  maxPrice = 100000,
  onPriceChange,
}: FilterSidebarProps) {
  const [selected, setSelected] = useState<string[]>(selectedStatuses || []);
  const [priceMin, setPriceMin] = useState<number | undefined>(minPrice);
  const [priceMax, setPriceMax] = useState<number | undefined>(maxPrice);

  // Debounce the current input values
  const debouncedMin = useDebounce(priceMin, 800);
  const debouncedMax = useDebounce(priceMax, 800);

  useEffect(() => {
    if (
      onStatusChange &&
      typeof debouncedMin === "number" &&
      typeof debouncedMax === "number"
    )
      onStatusChange(selected);
  }, [selected]);

  // Debounced price range change
  useEffect(() => {
    if (onPriceChange)
      onPriceChange({ min: debouncedMin!, max: debouncedMax! });
  }, [debouncedMin, debouncedMax]);

  const toggleStatus = (status: string) => {
    setSelected((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  return (
    <div className="w-full mb-4">
      <Accordion
        type="single"
        collapsible
        defaultValue="filters"
      >
        <AccordionItem value="filters">
          <AccordionTrigger
            isDark
            className="text-lg font-semibold text-slate-800"
          >
            Filters
          </AccordionTrigger>
          <AccordionContent>
            <div className="bg-white p-4 rounded-md border border-slate-200 space-y-6">
              {statusOptions.length > 0 && (
                <div>
                  <h3 className="text-base font-medium mb-2 text-slate-700">
                    Status
                  </h3>
                  <div className="flex flex-col gap-2">
                    {statusOptions.map((status) => (
                      <label
                        key={status}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={selected.includes(status)}
                          onChange={() => toggleStatus(status)}
                          className="form-checkbox h-4 w-4 text-slate-600"
                        />
                        <span className="text-sm capitalize text-slate-700">
                          {status}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {enablePriceFilter && (
                <div>
                  <h3 className="text-base font-medium mb-2 text-slate-700">
                    Price Range (SR)
                  </h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={priceMin !== undefined ? priceMin : ""}
                      onChange={(e) =>
                        setPriceMin(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      className="w-full border border-slate-300 rounded-md p-1 text-sm"
                      placeholder="Min"
                    />
                    <span className="text-slate-500">-</span>
                    <input
                      type="number"
                      min={0}
                      value={priceMax !== undefined ? priceMax : ""}
                      onChange={(e) =>
                        setPriceMax(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      className="w-full border border-slate-300 rounded-md p-1 text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
