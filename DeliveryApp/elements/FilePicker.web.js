import React, { useRef } from 'react';
import { Button } from 'react-native';

export default function FilePicker({ onFileSelected }) {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileSelected(file);
    }
  };

  return (
    <>
      <Button title="Выбрать файл" onPress={handleClick} />
      <input
        type="file"
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </>
  );
}
