// src/components/ErrorMessage.jsx
import { Alert, Button } from 'react-bootstrap';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <Alert variant="danger" className="my-4 shadow-sm">
      <Alert.Heading>Không thể tải dữ liệu</Alert.Heading>
      <p className="mb-3">{message}</p>
      {onRetry && (
        <Button variant="outline-danger" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </Alert>
  );
}
