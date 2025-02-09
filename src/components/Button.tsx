import { useNavigate } from "react-router-dom";

export const Button = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center">
      <button
        onClick={() => navigate("/pdf-preview")}
        type="submit"
        className="mt-6 px-4 py-2 bg-green-500 text-white  rounded hover:bg-green-600"
      >
        Generate Invoice
      </button>
    </div>
  );
};
