import React from 'react';
import { cn } from '../../lib/utils';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

const Table: React.FC<TableProps> = ({ children, className }) => {
  return (
    <div className="@container px-4 @sm:px-6 @lg:px-8">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto @sm:-mx-6 @lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle @sm:px-6 @lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 @sm:rounded-lg">
              <table className={cn(
                'min-w-full divide-y divide-gray-300',
                'moonwave-table',
                className
              )}>
                {children}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return (
    <thead className={cn('bg-gray-50', className)}>
      {children}
    </thead>
  );
};

const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return (
    <tbody className={cn('divide-y divide-gray-200 bg-white', className)}>
      {children}
    </tbody>
  );
};

const TableRow: React.FC<TableRowProps> = ({ children, className, onClick }) => {
  return (
    <tr 
      className={cn(
        'hover:bg-gray-50 transition-colors duration-200',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

const TableHead: React.FC<TableHeadProps> = ({ children, className, align = 'left' }) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <th 
      scope="col" 
      className={cn(
        'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6',
        'font-sans tracking-ko-normal break-keep-ko',
        alignClasses[align],
        className
      )}
    >
      {children}
    </th>
  );
};

const TableCell: React.FC<TableCellProps> = ({ children, className, align = 'left' }) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <td 
      className={cn(
        'whitespace-nowrap px-3 py-4 text-sm text-gray-500',
        'font-sans tracking-ko-normal break-keep-ko',
        alignClasses[align],
        className
      )}
    >
      {children}
    </td>
  );
};

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };