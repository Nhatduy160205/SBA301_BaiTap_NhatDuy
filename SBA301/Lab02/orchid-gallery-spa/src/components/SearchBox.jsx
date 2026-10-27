// src/components/SearchBox.jsx
import { Form, InputGroup } from 'react-bootstrap';

export default function SearchBox({ value, onChange }) {
  return (
    <InputGroup>
      <InputGroup.Text id="search-addon">🔍</InputGroup.Text>
      <Form.Control
        type="text"
        placeholder="Search orchid by name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search orchids"
        aria-describedby="search-addon"
      />
    </InputGroup>
  );
}
