import { useState } from "react";
import CustomSelectWithModal from "./CustomSelectWithModal";
import { TableRow, DhayiName } from "../types";

interface DataTableProps {
  data: TableRow[];
  dayiNames: DhayiName[];
  onChange: (data: TableRow[]) => void;
  onDelete?: (id: string) => void;
}

export const DataTable = ({ data, dayiNames, onChange }: DataTableProps) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleChange = (id: string, value: string) => {
    const updated = data.map((row) =>
      row.id === id ? { ...row, dai_name_contact: value } : row
    );
    onChange(updated);

    const updatedSelectedOptions = updated
      .filter((row) => row.dai_name_contact !== "-")
      .map((row) => row.dai_name_contact);
    setSelectedOptions(updatedSelectedOptions);
  };

  return (
    <div className="w-full overflow-hidden rounded-xl shadow-lg border border-gray-200 bg-white">
      {/* Table container with responsive scroll */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm sm:text-base">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="border border-gray-300 px-2 sm:px-4 py-3 text-left font-semibold text-xs sm:text-sm uppercase tracking-wide">
                S.No
              </th>
              <th className="border border-gray-300 px-2 sm:px-4 py-3 text-left font-semibold text-xs sm:text-sm uppercase tracking-wide">
                Branch Name / <br className="sm:hidden" /> கிளை பெயர்
              </th>
              <th className="border border-gray-300 px-2 sm:px-4 py-3 text-left font-semibold text-xs sm:text-sm uppercase tracking-wide">
                Dhayi Name & Contact
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                className="even:bg-gray-50 hover:bg-green-50 transition-colors duration-150"
              >
                <td className="border border-gray-200 px-2 sm:px-4 py-2 text-center font-medium text-gray-700">
                  {row.s_no}
                </td>

                <td className="border border-gray-200 px-2 sm:px-4 py-2 text-gray-700 whitespace-nowrap ">
                  <div className="flex flex-col">
                    <span className="font-semibold mb-2">{row.branch}</span>

                    <span className="text-xs md:text-sm text-gray-500 ">
                      {row.time} — {row.phone}
                    </span>
                  </div>
                </td>

                <td className="border border-gray-200 px-2 sm:px-4 py-2 whitespace-nowrap">
                  <CustomSelectWithModal
                    value={row.dai_name_contact || "-"}
                    options={dayiNames.map((dayi) => dayi.name)}
                    onValueChange={(value) => handleChange(row.id, value)}
                    label={`${row.branch} — Choose Dhayi`}
                    disabledOptions={selectedOptions}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Optional note or footer */}
      <div className="bg-gray-50 border-t border-gray-200 text-center py-2 text-xs sm:text-sm text-gray-600">
        📱 Scroll horizontally on small screens to view all columns
      </div>
    </div>
  );
};
