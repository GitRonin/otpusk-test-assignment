import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import styles from "./Dropdown.module.scss";

interface DropdownContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  itemCount: number;
  registerItem: (index: number, value: unknown) => void;
  onSelect: (value: unknown) => void;
  selectFirst: () => void;
  clearItems: () => void;
  isItemsReady: boolean;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("Dropdown components must be used within Dropdown.Root");
  }
  return context;
}

interface RootProps {
  children: ReactNode;
  onSelect?: (value: unknown) => void;
}

function Root({ children, onSelect }: RootProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [itemCount, setItemCount] = useState(0);
  const [isItemsReady, setIsItemsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemValuesRef = useRef<Map<number, unknown>>(new Map());

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
    setItemCount(0);
    setIsItemsReady(false);
    itemValuesRef.current.clear();
  }, []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const clearItems = useCallback(() => {
    setItemCount(0);
    setHighlightedIndex(-1);
    setIsItemsReady(false);
    itemValuesRef.current.clear();
  }, []);

  const registerItem = useCallback((index: number, value: unknown) => {
    setItemCount((prev) => Math.max(prev, index + 1));
    itemValuesRef.current.set(index, value);
    setIsItemsReady(true);
  }, []);

  const handleSelect = useCallback(
    (value: unknown) => {
      onSelect?.(value);
      close();
    },
    [onSelect, close]
  );

  const selectFirst = useCallback(() => {
    if (!isItemsReady) return;
    const firstValue = itemValuesRef.current.get(0);
    if (firstValue !== undefined) {
      handleSelect(firstValue);
    }
  }, [handleSelect, isItemsReady]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        close();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [close]);

  return (
    <DropdownContext.Provider
      value={{
        isOpen,
        open,
        close,
        toggle,
        highlightedIndex,
        setHighlightedIndex,
        itemCount,
        registerItem,
        onSelect: handleSelect,
        selectFirst,
        clearItems,
        isItemsReady,
      }}
    >
      <div ref={containerRef} className={styles.root}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

interface TriggerProps {
  children: (props: {
    isOpen: boolean;
    onFocus: () => void;
    onClick: () => void;
    onKeyDown: (e: KeyboardEvent) => void;
  }) => ReactNode;
}

function Trigger({ children }: TriggerProps) {
  const {
    isOpen,
    open,
    close,
    highlightedIndex,
    setHighlightedIndex,
    itemCount,
    selectFirst,
    isItemsReady,
  } = useDropdownContext();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen && e.key === "ArrowDown") {
        e.preventDefault();
        open();
        return;
      }

      if (isOpen) {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            if (isItemsReady && itemCount > 0) {
              setHighlightedIndex(
                highlightedIndex < itemCount - 1 ? highlightedIndex + 1 : 0
              );
            }
            break;
          case "ArrowUp":
            e.preventDefault();
            if (isItemsReady && itemCount > 0) {
              setHighlightedIndex(
                highlightedIndex > 0 ? highlightedIndex - 1 : itemCount - 1
              );
            }
            break;
          case "Enter":
            e.preventDefault();
            if (!isItemsReady) {
              break;
            }
            if (highlightedIndex < 0 && itemCount > 0) {
              selectFirst();
            } else if (highlightedIndex < 0) {
              close();
            }
            break;
          case "Escape":
            e.preventDefault();
            close();
            break;
        }
      }
    },
    [
      isOpen,
      open,
      setHighlightedIndex,
      highlightedIndex,
      itemCount,
      close,
      selectFirst,
      isItemsReady,
    ]
  );

  return (
    <>
      {children({
        isOpen,
        onFocus: open,
        onClick: open,
        onKeyDown: handleKeyDown,
      })}
    </>
  );
}

interface MenuProps {
  children: ReactNode;
  isLoading?: boolean;
  emptyText?: string;
  isEmpty?: boolean;
}

function Menu({
  children,
  isLoading,
  emptyText = "Нічого не знайдено",
  isEmpty,
}: MenuProps) {
  const { isOpen, clearItems } = useDropdownContext();
  const prevLoadingRef = useRef(isLoading);

  useEffect(() => {
    if (isLoading && !prevLoadingRef.current) {
      clearItems();
    }
    prevLoadingRef.current = isLoading;
  }, [isLoading, clearItems]);

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className={styles.menu} role="listbox">
        <div className={styles.loading}>Завантаження...</div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={styles.menu} role="listbox">
        <div className={styles.empty}>{emptyText}</div>
      </div>
    );
  }

  return (
    <div className={styles.menu} role="listbox">
      {children}
    </div>
  );
}

interface ItemProps {
  children: ReactNode;
  value: unknown;
  index: number;
}

function Item({ children, value, index }: ItemProps) {
  const { highlightedIndex, setHighlightedIndex, onSelect, registerItem } =
    useDropdownContext();
  const isHighlighted = highlightedIndex === index;

  useEffect(() => {
    registerItem(index, value);
  }, [index, value, registerItem]);

  useEffect(() => {
    if (isHighlighted) {
      const handleKeyDown = (e: Event) => {
        const keyboardEvent = e as globalThis.KeyboardEvent;
        if (keyboardEvent.key === "Enter") {
          keyboardEvent.preventDefault();
          onSelect(value);
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isHighlighted, onSelect, value]);

  const itemClasses = [styles.item, isHighlighted ? styles.highlighted : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={itemClasses}
      role="option"
      aria-selected={isHighlighted}
      onMouseEnter={() => setHighlightedIndex(index)}
      onClick={() => onSelect(value)}
    >
      {children}
    </div>
  );
}

export {
  Item as DropdownItem,
  Menu as DropdownMenu,
  Root as DropdownRoot,
  Trigger as DropdownTrigger,
};
