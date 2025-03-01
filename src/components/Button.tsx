import { MouseEventHandler } from "react";

interface ButtonProps {
  name: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const Button = ({ name, onClick }: ButtonProps) => {
  return (
    <div className="flex justify-center">
      <button
        onClick={onClick}
        type="submit"
        className="mt-6 px-4 py-2 cursor-pointer bg-green-500 text-white rounded hover:bg-green-600"
      >
        {name}
      </button>
    </div>
  );
};
