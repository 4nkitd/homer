
import React from 'react';
import { CategoryItem, ThemeClasses } from '../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface FolderHeaderProps {
  category: CategoryItem;
  itemCount: number;
  isCollapsed: boolean;
  onToggle?: () => void;
  themeClasses: ThemeClasses;
  isOverlay?: boolean;
}

const FolderHeader: React.FC<FolderHeaderProps> = ({ category, itemCount, isCollapsed, onToggle, themeClasses, isOverlay }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id, disabled: isOverlay });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging || isOverlay ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
    cursor: isOverlay ? 'grabbing' : 'grab',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="group mb-4"
    >
      <button 
        onClick={onToggle}
        {...attributes}
        {...listeners}
        className={`w-full flex items-center justify-between border-b pb-1 ${themeClasses.border} transition-colors hover:border-gray-500 cursor-grab active:cursor-grabbing`}
      >
        <div className="flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${category.color || 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-400 group-hover:text-gray-200 transition-colors">{category.name}</h2>
        </div>
        <div className="flex items-center space-x-2 pointer-events-none">
          <span className="text-xs text-gray-600 group-hover:text-gray-400">{itemCount} items</span>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default FolderHeader;
