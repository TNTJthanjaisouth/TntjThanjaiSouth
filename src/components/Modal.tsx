import { useState, useEffect, useRef } from "react";

// Modal Component
const Modal = ({
  isOpen,
  onClose,
  options,
  selected,
  onSelect,
  disabledOptions,
  label,
}: {
  isOpen: boolean;
  onClose: () => void;
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  disabledOptions: string[];
  label: string;
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Disable body scrolling when modal is open
    } else {
      document.body.style.overflow = "auto"; // Enable body scrolling when modal is closed
    }
    return () => {
      document.body.style.overflow = "auto"; // Clean up the overflow style
    };
  }, [isOpen]);

  // Close the modal when clicking outside the modal content
  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    isOpen && (
      <div className="fixed inset-0 z-[9999] bg-black bg-opacity-70 flex justify-center items-center">
        <div
          ref={modalRef}
          className="bg-white p-4 rounded-md shadow-lg max-w-md w-full"
        >
          <div className="text-lg font-semibold text-center mb-3">{label}</div>
          <div className="mb-2">
            <input
              type="text"
              className="w-full p-2 border border-green-300 rounded-md text-sm mb-2"
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {/* Nil option */}
            <button
              key={"nil"}
              className={`block w-full text-left py-1 px-2 mb-2 text-sm hover:bg-gray-100 rounded ${
                selected === "Nil" ? "bg-green-100" : ""
              }`}
              onClick={() => onSelect("Nil")}
            >
              Nil
            </button>

            {/* Filtered options */}
            {filteredOptions.map((option) => (
              <button
                key={option}
                className={`block w-full text-left py-1 px-2 mb-2 text-sm hover:bg-gray-100 rounded ${
                  selected === option ? "border-2 border-green-700" : ""
                } ${
                  disabledOptions.includes(option)
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : ""
                }`}
                onClick={() =>
                  !disabledOptions.includes(option) && onSelect(option)
                }
                disabled={disabledOptions.includes(option)}
              >
                {disabledOptions.includes(option) && (
                  <span className="text-green-600 mr-3">✔</span>
                )}
                {option}
              </button>
            ))}
          </div>
          <div className="mt-3 text-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default Modal;
