import Link from "next/link";
import { formatDate } from "@/lib/blog";

export interface IndexListItem {
  slug: string;
  title: string;
  date?: string;
}

export interface IndexListProps {
  items: IndexListItem[];
  basePath?: string; // e.g., "/blog", "/projects", etc.
  showDate?: boolean;
  sortByDate?: boolean;
  className?: string;
  itemClassName?: string;
  dateClassName?: string;
  titleClassName?: string;
  dateFormat?: boolean; // whether to format the date nicely or show raw
}

export function IndexList({
  items,
  basePath = "",
  showDate = true,
  sortByDate = true,
  className = "",
  itemClassName = "flex flex-col space-y-1 mb-4",
  dateClassName = "text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums",
  titleClassName = "text-neutral-900 dark:text-neutral-100 tracking-tight",
  dateFormat = true,
}: IndexListProps) {
  const sortedItems =
    sortByDate && showDate
      ? [...items].sort((a, b) => {
          if (!a.date || !b.date) return 0;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        })
      : items;

  return (
    <div className={className}>
      {sortedItems.map((item) => (
        <Link
          key={item.slug}
          className={itemClassName}
          href={`${basePath}/${item.slug}`}
        >
          {showDate && item.date ? (
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className={dateClassName}>
                {dateFormat ? formatDate(item.date, false) : item.date}
              </p>
              <p className={`${titleClassName} text-right truncate w-full`}>
                {item.title}
              </p>
            </div>
          ) : (
            <div className="w-full">
              <p className={`${titleClassName} text-left`}>{item.title}</p>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
