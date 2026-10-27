import React, { useEffect, useState } from "react";
import { Button, Container, Spinner, Table, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAllOrchids, deleteOrchid } from "../api/orchidApi";
import OrchidForm from "../components/OrchidForm";

export default function ListOfOrchids() {
  const [orchids, setOrchids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  async function loadOrchids() {
    try {
      setLoading(true);
      setError("");
      const response = await getAllOrchids();
      setOrchids(response.data);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? "Cannot load orchids");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrchids();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Bạn có chắc muốn xóa hoa lan này?")) return;
    try {
      setDeletingId(id);
      await deleteOrchid(id);
      setOrchids((current) => current.filter((x) => (x.orchidId ?? x.orchidID) !== id));
    } catch (err) {
      setError(err.response?.data?.message ?? "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Đang tải danh sách hoa lan từ Backend (GET /orchids)...</p>
      </Container>
    );
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-1">🌿 Danh Sách Hoa Lan (Orchids)</h2>
          <p className="text-muted small mb-0">Hiển thị {orchids.length} bản ghi lấy từ Backend qua Axios Client</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={loadOrchids}>
            🔄 Làm mới
          </Button>
          <Button variant="primary" onClick={() => setShowCreate(true)}>
            ➕ Create Orchid
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">⚠️ {error}</Alert>}

      {orchids.length === 0 ? (
        <Alert variant="info" className="text-center py-4">
          Chưa có dữ liệu hoa lan nào. Bấm <strong>Create Orchid</strong> để thêm mới.
        </Alert>
      ) : (
        <Table striped bordered hover responsive className="align-middle shadow-sm">
          <thead className="table-dark">
            <tr>
              <th style={{ width: "60px" }}>ID</th>
              <th style={{ width: "80px" }}>Hình ảnh</th>
              <th>Tên hoa lan</th>
              <th>Danh mục</th>
              <th style={{ width: "120px" }} className="text-center">Tự nhiên</th>
              <th style={{ width: "120px" }} className="text-center">Quyến rũ</th>
              <th style={{ width: "180px" }} className="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orchids.map((o) => {
              const id = o.orchidId ?? o.orchidID;
              const isNat = o.isNatural ?? o.natural;
              const isAtt = o.isAttractive ?? o.attractive;
              return (
                <tr key={id}>
                  <td className="fw-bold text-secondary">#{id}</td>
                  <td>
                    {o.orchidURL ? (
                      <img
                        src={o.orchidURL}
                        alt={o.orchidName}
                        referrerPolicy="no-referrer"
                        style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }}
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1598880940371-c756e015fea1?w=100&auto=format&fit=crop&q=80";
                        }}
                      />
                    ) : (
                      <div style={{ width: "50px", height: "50px", background: "#e2e8f0", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        🌸
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="fw-semibold">{o.orchidName}</div>
                    {o.orchidDescription && (
                      <small className="text-muted text-truncate d-block" style={{ maxWidth: "280px" }}>
                        {o.orchidDescription}
                      </small>
                    )}
                  </td>
                  <td>
                    <span className="badge bg-secondary text-uppercase">{o.orchidCategory || "Chưa phân loại"}</span>
                  </td>
                  <td className="text-center">
                    {isNat ? <span className="badge bg-success">🌿 Yes</span> : <span className="badge bg-light text-dark border">🧪 No</span>}
                  </td>
                  <td className="text-center">
                    {isAtt ? <span className="badge bg-warning text-dark">✨ Yes</span> : <span className="badge bg-light text-muted border">No</span>}
                  </td>
                  <td className="text-center">
                    <Button as={Link} to={`/orchids/${id}/edit`} size="sm" variant="outline-warning" className="me-2 fw-semibold">
                      ✏️ Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      disabled={deletingId === id}
                      onClick={() => handleDelete(id)}
                      className="fw-semibold"
                    >
                      {deletingId === id ? "Đang xóa..." : "🗑️ Delete"}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      <OrchidForm show={showCreate} onHide={() => setShowCreate(false)} onCreated={loadOrchids} />
    </Container>
  );
}
