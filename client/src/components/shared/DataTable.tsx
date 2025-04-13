import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Download } from "lucide-react";

type Column<T> = {
  header: string;
  accessorKey: keyof T;
  cell?: (data: T) => React.ReactNode;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  searchable?: boolean;
  onSearch?: (searchTerm: string) => void;
  filterableBy?: {
    key: string;
    options: { label: string, value: string }[];
    onChange: (value: string) => void;
  };
  exportable?: boolean;
  onExport?: () => void;
  isLoading?: boolean;
};

export function DataTable<T>({
  data,
  columns,
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  searchable = true,
  onSearch,
  filterableBy,
  exportable = true,
  onExport,
  isLoading = false
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border-b border-neutral-100 gap-4">
        <h2 className="font-bold text-lg">Data Table</h2>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          {searchable && (
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input 
                type="text" 
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full sm:w-48 pl-8" 
                placeholder="Cari..."
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-neutral-400" size={16} />
              </div>
            </form>
          )}
          
          {filterableBy && (
            <Select onValueChange={filterableBy.onChange}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={`Filter by ${filterableBy.key}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                {filterableBy.options.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {exportable && (
            <Button 
              className="flex items-center gap-1 bg-primary text-white"
              onClick={onExport}
            >
              <Download size={16} />
              <span>Export</span>
            </Button>
          )}
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="w-full text-sm">
          <TableHeader className="bg-neutral-50">
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className="text-neutral-600 font-semibold">
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="border-t border-neutral-100 hover:bg-neutral-50">
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className="px-4 py-3">
                      {column.cell ? column.cell(row) : row[column.accessorKey] as React.ReactNode}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-100">
        <div className="text-sm text-neutral-500">
          Menampilkan {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalItems)} dari {totalItems} data
        </div>
        
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} 
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // For simplicity, just show 5 pages
              let pageNum = currentPage;
              if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              if (pageNum > 0 && pageNum <= totalPages) {
                return (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      isActive={pageNum === currentPage}
                      onClick={() => onPageChange(pageNum)}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              return null;
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} 
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
