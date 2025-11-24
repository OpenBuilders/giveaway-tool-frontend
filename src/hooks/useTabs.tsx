import { useState, useCallback, useRef } from 'react';
import type { ReactElement, ReactNode, TouchEvent } from 'react';
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

  const webApp = window.Telegram?.WebApp;

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
    touchEndX.current = null;
    touchEndY.current = null;
  };

  const onTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const onTouchEnd = () => {
    if (
      !touchStartX.current ||
      !touchEndX.current ||
      !touchStartY.current ||
      !touchEndY.current
    )
      return;

    const diffX = touchStartX.current - touchEndX.current;
    const diffY = touchStartY.current - touchEndY.current;

    const isHorizontal = Math.abs(diffX) > Math.abs(diffY);

    if (isHorizontal && Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) {
        // Swiped left -> next tab
        if (activeTab < tabs.length - 1) {
          setActiveTab(activeTab + 1);
        }
      } else {
        // Swiped right -> prev tab
        if (activeTab > 0) {
          setActiveTab(activeTab - 1);
        }
      }
    }
  };

  const setActiveTab = useCallback((index: number): void => {
    if (index !== activeTab) {
      webApp?.HapticFeedback?.impactOccurred('light');
      setActiveTabState(index);
      if (onTabChange) {
        onTabChange(index);
      }
    }
  }, [onTabChange, activeTab, webApp]);

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
    return (
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ height: '100%', width: '100%' }}
      >
        {currentTab.content}
      </div>
    );
  }, [activeTab, tabs, activeTab]);

  return {
    activeTab,
    activeTabKey: tabs[activeTab]?.key || '',
    setActiveTab,
    tabProps,
    TabsComponent,
    TabContent,
  };
};
