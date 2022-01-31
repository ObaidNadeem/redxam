import { Dispatch, SetStateAction } from "react";

interface ITextInput {
  placeholder: string;
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
}
const TextInput = ({ placeholder, value, onChange }: ITextInput) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-center bg-gradient-to placeholder-grayscale-500 placeholder:font-bold"
    />
  );
};

export default TextInput;
