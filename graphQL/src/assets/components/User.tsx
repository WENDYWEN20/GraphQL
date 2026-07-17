import React from "react";
import { useState } from "react";
import "../../App.css";
import { Checkbox } from "@mui/material";
type User = {
  id: string;
  name: string;
  age: number;
  isMarried: boolean;
};
type UserPatch = {
  name?: string;
  age?: number;
  isMarried?: boolean;
};
interface UserProps {
  user: User;
  onSaveButton: (id: string, patch: UserPatch) => void;
}
export default function User({ user, onSaveButton }: UserProps) {
  const { id, name, age, isMarried } = user;
  const [updateName, setUpdateName] = useState<string>(name);
  const [updateAge, setUpdateAge] = useState<number>(Number(age));
  const [updateMarried, setUpdateMarried] = useState<boolean>(isMarried);

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const handleSave = () => {
    onSaveButton(id, {
      name: updateName,
      age: updateAge,
      isMarried: updateMarried,
    });
    setIsEdit(false);
  };
  return (
    <div key={id}>
      {!isEdit ? (
        <>
          <li>Name: {name} </li>
          <li>Age: {age}</li>
          <li>{isMarried ? "Yes" : "No"}</li>
          <button onClick={() => setIsEdit(true)}>Edit</button>
        </>
      ) : (
        <>
          <input
            placeholder={updateName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUpdateName(e.target.value)
            }
          />
          <input
            placeholder={updateAge.toString()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUpdateAge(Number(e.target.value))
            }
          />
          <label>
            Married
            <input
              type="checkbox"
              checked={updateMarried}
              onChange={(e) => setUpdateMarried(e.target.checked)}
            />
          </label>
          <button onClick={handleSave}>{!isEdit || "Submit"}</button>
        </>
      )}

      <hr className="break" />
    </div>
  );
}
