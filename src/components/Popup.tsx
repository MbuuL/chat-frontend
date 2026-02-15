import { useState, useRef, useEffect, useCallback } from "react";

export function Popup({ children, items, classNames }: PopupProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, handleClickOutside]);

  return (
    <div ref={menuRef} className={classNames?.container ?? "relative"}>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className={classNames?.trigger}
      >
        {children}
      </button>

      {open && (
        <div className={classNames?.dropdown ?? "absolute right-0 mt-2 w-40 rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"}>
          {items.map(item => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className={classNames?.item ?? "w-full cursor-pointer px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
