// src/components/Orchids.jsx
import { useMemo, useState } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import useOrchids from '../hooks/useOrchids';
import CategoryFilter from './CategoryFilter';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';
import OrchidCard from './OrchidCard';
import OrchidDetailModal from './OrchidDetailModal';
import SearchBox from './SearchBox';

export default function Orchids() {
  const { orchids, loading, error, reload } = useOrchids();
  const [show, setShow] = useState(false);
  const [selectedOrchid, setSelectedOrchid] = useState(null);

  // Search & Filter state (Step 23 - Derived view)
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('ALL');
  const [specialOnly, setSpecialOnly] = useState(false);

  const categories = useMemo(() => {
    return Array.from(new Set(orchids.map((item) => item.category)));
  }, [orchids]);

  const visibleOrchids = orchids.filter((o) => {
    const matchName = o.orchidName.toLowerCase().includes(keyword.trim().toLowerCase());
    const matchCategory = category === 'ALL' || o.category === category;
    const matchSpecial = !specialOnly || o.isSpecial;
    return matchName && matchCategory && matchSpecial;
  });

  const handleShow = (orchid) => {
    setSelectedOrchid(orchid);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedOrchid(null);
  };

  return (
    <Container id="orchids" className="py-4">
      {/* Header and Force Reload */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="mb-0 fw-bold">Orchids List</h2>
          <small className="text-muted">Explore our curated collection of exotic orchids</small>
        </div>
        <Button variant="outline-primary" onClick={reload} disabled={loading}>
          {loading ? 'Refreshing...' : '🔄 Force Reload (Bypass Cache)'}
        </Button>
      </div>

      {/* Search & Filter Bar (Derived state - does not re-fetch) */}
      {!loading && !error && orchids.length > 0 && (
        <Card className="filter-card p-3 mb-4">
          <Row className="g-3 align-items-center">
            <Col xs={12} md={5}>
              <SearchBox value={keyword} onChange={setKeyword} />
            </Col>
            <Col xs={12} md={7}>
              <CategoryFilter
                categories={categories}
                selectedCategory={category}
                onSelectCategory={setCategory}
                specialOnly={specialOnly}
                onToggleSpecial={setSpecialOnly}
              />
            </Col>
          </Row>
        </Card>
      )}

      {/* Loading state */}
      {loading && <LoadingSpinner />}

      {/* Error state */}
      {error && <ErrorMessage message={error} onRetry={reload} />}

      {/* Empty data state */}
      {!loading && !error && orchids.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted fs-5">Không có Orchid nào.</p>
        </div>
      )}

      {/* Filter result empty state */}
      {!loading && !error && orchids.length > 0 && visibleOrchids.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted fs-5">Không tìm thấy Orchid nào khớp với điều kiện tìm kiếm.</p>
        </div>
      )}

      {/* Orchid Cards Grid */}
      {!loading && !error && visibleOrchids.length > 0 && (
        <Row>
          {visibleOrchids.map((orchid) => (
            <Col xs={12} sm={6} lg={3} key={orchid.id} className="mb-4">
              <OrchidCard orchid={orchid} onDetail={handleShow} />
            </Col>
          ))}
        </Row>
      )}

      {/* Detail Modal */}
      <OrchidDetailModal show={show} orchid={selectedOrchid} onClose={handleClose} />
    </Container>
  );
}
