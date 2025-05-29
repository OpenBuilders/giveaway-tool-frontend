import { useState, useCallback } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { Tabs } from '../components/ui/other/Tabs';

export interface TabItem {
  key: string;
  label: string;
  content?: ReactNode;
}

export interface UseTabsProps {
  tabs: TabItem[];
  defaultTab?: number;
  onTabChange?: (index: number) => void;
}

export interface UseTabsResult {
  activeTab: number;
  activeTabKey: string;
  setActiveTab: (index: number) => void;
  tabProps: {
    activeIndex: number;
    setActiveIndex: (index: number) => void;
  };
  TabsComponent: () => ReactElement;
  TabContent: () => ReactElement | null;
}

/**
 * Custom hook for managing tabs state
 * @param tabs - Array of tab items containing key, label and optional content
 * @param defaultTab - Initial active tab index (defaults to 0)
 * @param onTabChange - Optional callback function triggered when tab changes
 * @returns Object containing active tab state, components and helper functions
 */
export const useTabs = ({ tabs, defaultTab = 0, onTabChange }: UseTabsProps): UseTabsResult => {
  const [activeTab, setActiveTabState] = useState<number>(defaultTab);

  const setActiveTab = useCallback((index: number): void => {
    setActiveTabState(index);
    if (onTabChange) {
      onTabChange(index);
    }
  }, [onTabChange]);

  // Props object that can be directly spread into the Tabs component
  const tabProps = {
    activeIndex: activeTab,
    setActiveIndex: setActiveTab,
  };

  // The TabsComponent renders the Tabs with the current state
  const TabsComponent = useCallback((): ReactElement => {
    const categories = tabs.map(tab => tab.label);
    return (
      <Tabs
        categories={categories}
        activeIndex={activeTab}
        setActiveIndex={setActiveTab}
      />
    );
  }, [activeTab, tabs, setActiveTab]);

  // TabContent renders the content of the active tab
  const TabContent = useCallback((): ReactElement | null => {
    const currentTab = tabs[activeTab];
    if (!currentTab?.content) return null;
    return <>{currentTab.content}</>;
  }, [activeTab, tabs]);

  return {
    activeTab,
    activeTabKey: tabs[activeTab]?.key || '',
    setActiveTab,
    tabProps,
    TabsComponent,
    TabContent,
  };
};
