import React, { ChangeEvent } from "react";

interface Props {
  placeholder: string;
  icon: string;
  onChange: (event: ChangeEvent) => void;
}

const TextInput = ({ placeholder, onChange, icon }: Props) => {
  return (
    <div className="input-group mb-3">
      <span className="input-group-text" id="basic-addon1">
        {icon}
      </span>
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        aria-label="Username"
        aria-describedby="basic-addon1"
        onChange={(event) => onChange(event)}
      />
    </div>
  );
};

export default TextInput;
