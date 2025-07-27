"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "../ui/button";

type FilterProps = {
  statusOptions?: string[];
  selectedStatuses?: string[];
  onStatusChange?: (statuses: string[]) => void;

  enablePriceFilter?: boolean;
  minPrice?: number | string;
  maxPrice?: number | string;
  onPriceChange?: (range: {
    min: number | string | undefined;
    max: number | string | undefined;
  }) => void;

  enableSearch?: boolean;
  searchFieldName?: string;
  onSearchChange?: (query: string) => void;

  colorOptions?: string[];
  selectedColor?: string;
  onColorChange?: (colors: string) => void;
};

export default function Filter({
  statusOptions = [],
  selectedStatuses = [],
  onStatusChange,
  enablePriceFilter = false,
  minPrice,
  maxPrice,
  onPriceChange,
  enableSearch = false,
  searchFieldName,
  onSearchChange,
  colorOptions = [],
  selectedColor,
  onColorChange,
}: FilterProps) {
  const [selectedStats, setSelectedStats] = useState<string[]>(
    selectedStatuses || []
  );

  const [selectedCol, setSelectedCol] = useState<string | undefined>(
    selectedColor
  );

  const [priceMin, setPriceMin] = useState<number | string | undefined>(
    minPrice
  );
  const [priceMax, setPriceMax] = useState<number | string | undefined>(
    maxPrice
  );

  const [search, setSearch] = useState("");

  // Debounce the current input values
  const debouncedMin = useDebounce(priceMin, 800);
  const debouncedMax = useDebounce(priceMax, 800);
  const debouncedSearch = useDebounce(search, 800);

  useEffect(() => {
    if (onStatusChange) onStatusChange(selectedStats);
  }, [selectedStats]);

  useEffect(() => {
    if (onPriceChange)
      onPriceChange({ min: Number(debouncedMin)!, max: Number(debouncedMax)! });
  }, [debouncedMin, debouncedMax]);

  useEffect(() => {
    if (onSearchChange) onSearchChange(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    if (onColorChange) onColorChange(selectedCol || "");
  }, [selectedCol]);

  const handleColorClick = (color: string) => {
    setSelectedCol((prev) => (prev === color ? undefined : color));
  };

  const toggleStatus = (status: string) => {
    setSelectedStats((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleResetFilters = () => {
    setSelectedStats([]);
    setSelectedCol(undefined);
    setPriceMin(undefined);
    setPriceMax(undefined);
    setSearch("");

    onStatusChange?.([]);
    onColorChange?.("");
    onPriceChange?.({ min: undefined, max: undefined }); // or undefined, depending on your app
    onSearchChange?.("");
  };

  return (
    <div className="w-full bg-white px-4 rounded-md">
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
              {enableSearch && (
                <div>
                  <h3 className="text-base font-medium mb-2 text-slate-700">
                    Search
                  </h3>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border border-slate-300 rounded-md p-1 text-sm"
                    placeholder={`Search by ${searchFieldName || "name"}`}
                  />
                </div>
              )}

              {statusOptions.length > 0 && (
                <div>
                  <h3 className="text-base font-medium mb-2 text-slate-700">
                    Status{" "}
                    <span className="text-slate-500">
                      {selectedStats.length > 0 ? "" : "(showing all)"}
                    </span>
                  </h3>
                  <div className="flex flex-col gap-2">
                    {statusOptions.map((status) => (
                      <label
                        key={status}
                        className="flex items-center gap-2 hover:cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStats.includes(status)}
                          onChange={() => toggleStatus(status)}
                          className="form-checkbox h-4 w-4 text-slate-600 hover:cursor-pointer"
                        />
                        <span className="text-sm capitalize text-slate-700 hover:cursor-pointer">
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
                      type="text"
                      min={0}
                      value={
                        priceMin !== undefined && !Number.isNaN(priceMin)
                          ? priceMin
                          : ""
                      }
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
                      type="text"
                      min={0}
                      value={
                        priceMax !== undefined && !Number.isNaN(priceMax)
                          ? priceMax
                          : ""
                      }
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

              {colorOptions.length > 0 && (
                <div>
                  <h3 className="text-base font-medium mb-2 text-slate-700">
                    Colors
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color, index) => (
                      <div
                        key={`${color} - ${index}`}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${
                          selectedCol === color
                            ? "border-green-600"
                            : "border-gray-300"
                        }`}
                      >
                        <button
                          onClick={() => handleColorClick(color)}
                          style={{ backgroundColor: color }}
                          className={`w-5 h-5 rounded-full transition-transform duration-300 hover:scale-105  hover:cursor-pointer `}
                          title={color}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(selectedStats.length > 0 ||
                selectedCol ||
                (priceMin !== undefined && !Number.isNaN(priceMin)) ||
                (priceMax !== undefined && !Number.isNaN(priceMax)) ||
                search !== "") && (
                <div className="flex items-center justify-end">
                  <Button
                    onClick={handleResetFilters}
                    className="text-sm font-medium text-red-600 w-full md:w-fit bg-red-100"
                    variant={"ghost"}
                  >
                    Reset All Filters
                  </Button>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
