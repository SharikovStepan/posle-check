import { FilterButton } from "@/app/lib/types/types.filters";

export default function TabChangeButton<T extends string>({ currentTab, tabs, changeTab }: { currentTab: T; tabs: FilterButton<T>[]; changeTab: (targetTab: T) => void }) {
  return (
    <>
      {tabs.map((tab,index) => {
        return (
          <button
			 key={`${index}-${tab.text}`}
            type="button"
            disabled={currentTab == tab.filterType}
            onClick={() => changeTab(tab.filterType)}
            className={`${
              currentTab === tab.filterType ? "bg-accent pointer-events-none text-text-inverted" : "text-text-primary bg-surface hover:bg-surface-hover"
            } w-full cursor-pointer rounded-xl transition-all duration-200`}>
            {tab.text}
          </button>
        );
      })}
    </>
  );
}
