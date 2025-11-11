import DhayiNamesManager from "../components/DhayiNamesManager";
import { ArrowLeft } from "lucide-react";
import ImageManager from "../components/ImageManager";
import { useNavigate } from "react-router-dom";
const ManageDataPage = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-8">
      <header className="bg-green-600 text-white py-4 px-4 sm:px-8  shadow-md flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold">Dhayi List</h1>

        <button
          className="bg-white text-green-600 px-3 py-2 rounded-md text-md font-bold hover:bg-green-100 inline-flex"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-3" /> back
        </button>
      </header>

      <ImageManager />
      <DhayiNamesManager />
    </div>
  );
};

export default ManageDataPage;
