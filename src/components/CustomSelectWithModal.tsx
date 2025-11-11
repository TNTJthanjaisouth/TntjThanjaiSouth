import { useState } from "react";
import Modal from "./Modal";

// CustomSelectWithModal Component
const CustomSelectWithModal = ({
  value,
  options,
  onValueChange,
  label,
  disabledOptions,
}: {
  value: string;
  options: string[];
  onValueChange: (value: string) => void;
  label: string;
  disabledOptions: string[];
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string>(value);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectOption = (option: string) => {
    setSelected(option);
    onValueChange(option);
    handleCloseModal();
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <button
        className="w-full text-sm py-2 px-4 border border-gray-300 rounded-md text-left focus:outline-none"
        onClick={handleOpenModal}
      >
        {selected || "Select Dhayi"}
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        options={filteredOptions}
        selected={selected}
        onSelect={handleSelectOption}
        disabledOptions={disabledOptions}
        label={label}
      />
    </div>
  );
};

export default CustomSelectWithModal;
