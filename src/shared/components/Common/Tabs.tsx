import { useState } from 'react';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

export const Tabs = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'default',
  className = '',
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    const tab = tabs.find((t) => t.id === tabId);
    if (tab?.disabled) return;
    
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const variantStyles = {
    default: {
      container: 'border-b border-gray-200',
      tab: (isActive: boolean, disabled: boolean) => `
        px-4 py-2 text-sm font-medium transition-all duration-200
        ${disabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
        ${isActive 
          ? 'text-primary border-b-2 border-primary -mb-px' 
          : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
        }
      `,
    },
    pills: {
      container: 'flex gap-2',
      tab: (isActive: boolean, disabled: boolean) => `
        px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
        ${disabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
        ${isActive 
          ? 'bg-primary text-white shadow-sm' 
          : 'text-gray-600 hover:bg-gray-100'
        }
      `,
    },
    underline: {
      container: 'flex gap-6',
      tab: (isActive: boolean, disabled: boolean) => `
        px-1 py-2 text-sm font-medium transition-all duration-200 relative
        ${disabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
        ${isActive 
          ? 'text-primary' 
          : 'text-gray-500 hover:text-gray-700'
        }
        ${isActive ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary' : ''}
      `,
    },
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className={className}>
      <div className={variantStyles[variant].container}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            disabled={tab.disabled}
            className={variantStyles[variant].tab(activeTab === tab.id, !!tab.disabled)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {activeTabContent}
      </div>
    </div>
  );
};