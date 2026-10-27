// src/components/CategoryFilter.jsx
import { Form } from 'react-bootstrap';

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  specialOnly,
  onToggleSpecial
}) {
  return (
    <div className="d-flex flex-wrap align-items-center gap-3">
      <Form.Select
        value={selectedCategory}
        onChange={(e) => onSelectCategory(e.target.value)}
        aria-label="Filter by category"
        style={{ minWidth: '160px' }}
      >
        <option value="ALL">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </Form.Select>
      <Form.Check
        type="switch"
        id="special-switch"
        label="Special only"
        checked={specialOnly}
        onChange={(e) => onToggleSpecial(e.target.checked)}
      />
    </div>
  );
}
