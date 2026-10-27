import React from "react";
import { Card, Row, Col, Badge, Button } from "react-bootstrap";

function CacheStatus({ diagnostics, onClearCache, onRefresh, loading, onCancelRequest }) {
  return (
    <Card className="border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
      <Row className="g-3 align-items-center">
        <Col md={3}>
          <div className="d-flex align-items-center gap-2">
            <span className="fs-3">💾</span>
            <div>
              <div className="small text-muted fw-semibold">CACHE POLICY</div>
              <div className="fw-bold">
                {diagnostics.hasCache ? (
                  <Badge bg="success">Active (TTL: {diagnostics.ttlSeconds}s)</Badge>
                ) : (
                  <Badge bg="secondary">No Cache</Badge>
                )}
              </div>
            </div>
          </div>
        </Col>

        <Col md={3}>
          <div className="small text-muted">Cache Age:</div>
          <div className="fw-bold text-primary">
            {diagnostics.ageSeconds !== null ? `${diagnostics.ageSeconds}s ago` : "N/A"}
          </div>
        </Col>

        <Col md={3}>
          <div className="small text-muted">Hits / Network:</div>
          <div className="fw-bold">
            <span className="text-success">{diagnostics.cacheHits} Hits</span> •{" "}
            <span className="text-info">{diagnostics.networkRequests} Req</span>
          </div>
        </Col>

        <Col md={3} className="d-flex justify-content-md-end gap-2">
          {loading ? (
            <Button variant="danger" size="sm" onClick={onCancelRequest}>
              ⏹ Cancel Request
            </Button>
          ) : (
            <>
              <Button variant="primary" size="sm" onClick={() => onRefresh(false)}>
                ↻ Fetch
              </Button>
              <Button variant="outline-primary" size="sm" onClick={() => onRefresh(true)} title="Force Network Refresh">
                ⚡ Force Network
              </Button>
              <Button variant="outline-danger" size="sm" onClick={onClearCache} title="Clear Cache">
                🗑️
              </Button>
            </>
          )}
        </Col>
      </Row>
    </Card>
  );
}

export default CacheStatus;
