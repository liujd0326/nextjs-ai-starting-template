import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PageSkeletonProps {
  showHeader?: boolean;
  cardCount?: number;
  gridCols?: 1 | 2 | 3 | 4;
  className?: string;
}

export const PageSkeleton = ({ 
  showHeader = true, 
  cardCount = 3, 
  gridCols = 3,
  className 
}: PageSkeletonProps) => {
  const gridClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2", 
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {showHeader && (
        <div>
          <Skeleton className="h-9 w-80 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
      )}
      
      <div className={`grid gap-6 ${gridClass[gridCols]}`}>
        {[...Array(cardCount)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
};

export const ListSkeleton = ({ itemCount = 5 }: { itemCount?: number }) => {
  return (
    <div className="space-y-3">
      {[...Array(itemCount)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
          <Skeleton className="h-10 w-10 rounded" />
          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
};

export const FormSkeleton = ({ fieldCount = 4 }: { fieldCount?: number }) => {
  return (
    <div className="space-y-4">
      {[...Array(fieldCount)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex gap-3 pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
};

export const TableSkeleton = ({ 
  rowCount = 5, 
  columnCount = 4 
}: { 
  rowCount?: number; 
  columnCount?: number; 
}) => {
  return (
    <div className="space-y-3">
      {/* Table Header */}
      <div className="flex gap-4 p-3 border-b">
        {[...Array(columnCount)].map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      
      {/* Table Rows */}
      {[...Array(rowCount)].map((_, i) => (
        <div key={i} className="flex gap-4 p-3">
          {[...Array(columnCount)].map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};