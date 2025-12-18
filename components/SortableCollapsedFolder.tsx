
import React from 'react';
import { CategoryItem, ThemeClasses } from '../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableCollapsedFolderProps {
  category: CategoryItem;
  itemCount: number;
  onToggle: () => void;
  themeClasses: ThemeClasses;
  isOverlay?: boolean;
}

const SortableCollapsedFolder: React.FC<SortableCollapsedFolderProps> = ({ category, itemCount, onToggle, themeClasses, isOverlay }) => {
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
    <button
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onToggle}
      className={`flex flex-col items-center p-4 rounded-xl ${themeClasses.card} border ${themeClasses.border} hover:border-gray-500 transition-all group text-center`}
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${themeClasses.button} transition-colors pointer-events-none`}>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${category.color || 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      </div>
      <span className="text-sm font-medium text-gray-300 group-hover:text-white truncate w-full px-1 pointer-events-none">{category.name}</span>
      <span className="text-[10px] text-gray-600 mt-1 pointer-events-none">{itemCount} items</span>
    </button>
  );
};

export default SortableCollapsedFolder;
