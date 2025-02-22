import React, { useState } from 'react';

const AddCharacterForm = ({ onAddCharacter }) => {
  const [characterName, setCharacterName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (characterName.trim()) {
      onAddCharacter(characterName); // Pass the character name to the parent component
      setCharacterName(''); // Clear the input field
    }
  };

  return (
    <div style={{ margin: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h3>Add New Character</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter character name"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          style={{ padding: '8px', marginRight: '10px', width: '200px' }}
        />
        <button type="submit" style={{ padding: '8px 12px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>
          Add Character
        </button>
      </form>
    </div>
  );
};

export default AddCharacterForm;