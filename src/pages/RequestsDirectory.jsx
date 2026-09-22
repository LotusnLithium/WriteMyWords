import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import RequestCard from '../components/RequestCard.jsx';
import RequestDetailModal from '../components/RequestDetailModal.jsx';
import { IconSearch } from '../components/Icons.jsx';

const CATS = [
  'All',
  'Assignment Guidance',
  'Research Support',
  'Proofreading',
  'Formatting',
  'Presentation Support',
  'Tutoring',
  'Project Support',
  'Journal Guidance',
  'Other',
];

const LEVELS = ['All Levels', 'High School', 'Undergraduate', 'Postgraduate', 'Doctoral'];

export default function RequestsDirectory() {
  const { requests } = useApp();
  const [params, setParams] = useSearchParams();
  const initialCategory = params.get('category') || 'All';

  const [category, setCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [academicLevel, setAcademicLevel] = useState('All Levels');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const cat = params.get('category');
    if (cat && CATS.includes(cat)) {
      setCategory(cat);
    }
  }, [params]);

  // Filter requests
  const filtered = requests.filter((r) => {
    // Category match
    if (category !== 'All') {
      const matchCat = (r.category || '').toLowerCase() === category.toLowerCase();
      if (!matchCat) return false;
    }

    // Academic level match
    if (academicLevel !== 'All Levels') {
      if ((r.academic_level || '') !== academicLevel) return false;
    }

    // Search query match (title, description, subject, category)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = (r.title || '').toLowerCase().includes(q);
      const descMatch = (r.description || '').toLowerCase().includes(q);
      const subMatch = (r.subject || '').toLowerCase().includes(q);
      const catMatch = (r.category || '').toLowerCase().includes(q);
      if (!titleMatch && !descMatch && !subMatch && !catMatch) return false;
    }

    return true;
  });

  // Sort requests
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'budgetHigh') {
      return (Number(b.budget_max ?? b.budgetMax ?? 0)) - (Number(a.budget_max ?? a.budgetMax ?? 0));
    }
    if (sortBy === 'budgetLow') {
      return (Number(a.budget_min ?? a.budgetMin ?? 0)) - (Number(b.budget_min ?? b.budgetMin ?? 0));
    }
    return 0; // Default newest
  });

  function resetFilters() {
    setCategory('All');
    setSearchQuery('');
    setAcademicLevel('All Levels');
    setSortBy('newest');
    setParams({});
  }

  return (
    <section className="wrap" style={{ paddingTop: 40, minHeight: '80vh' }}>
      <div className="section-head" style={{ marginBottom: 24 }}>
        <div className="eyebrow">EXPLORE REQUESTS</div>
        <h1 style={{ fontSize: 'clamp(28px, 4.5vw, 40px)', marginTop: 8 }}>Find Academic Opportunities</h1>
        <p className="muted" style={{ fontSize: 15, marginTop: 6 }}>
          {requests.length} verified student requests currently open for expert assistance.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
        <div className="search-bar" style={{ margin: 0 }}>
          <IconSearch size={18} color="var(--ink-muted)" />
          <input
            type="text"
            placeholder="Search by topic, subject, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ color: 'var(--ink-muted)', fontSize: 14, padding: '2px 6px' }}
              aria-label="Clear search query"
            >
              ✕
            </button>
          )}
        </div>

        <select
          value={academicLevel}
          onChange={(e) => setAcademicLevel(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: 'var(--r-sm)',
            border: '1.5px solid var(--border-strong)',
            background: 'var(--surface)',
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--ink)'
          }}
        >
          {LEVELS.map((lvl) => (
            <option key={lvl} value={lvl}>{lvl}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: 'var(--r-sm)',
            border: '1.5px solid var(--border-strong)',
            background: 'var(--surface)',
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--ink)'
          }}
        >
          <option value="newest">Sort: Newest First</option>
          <option value="budgetHigh">Sort: Highest Budget</option>
          <option value="budgetLow">Sort: Lowest Budget</option>
        </select>
      </div>

      {/* Horizontal Scrollable Category Chips */}
      <div className="chip-container">
        <div className="chip-row">
          {CATS.map((c) => (
            <button
              key={c}
              className={`chip ${category === c ? 'selected' : ''}`}
              onClick={() => {
                setCategory(c);
                if (c === 'All') setParams({});
                else setParams({ category: c });
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Active Results Summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, fontSize: 14, color: 'var(--ink-muted)' }}>
        <div>
          Showing <strong>{sorted.length}</strong> {sorted.length === 1 ? 'request' : 'requests'}
          {category !== 'All' && <span> in <strong>{category}</strong></span>}
        </div>
        {(category !== 'All' || searchQuery || academicLevel !== 'All Levels') && (
          <button
            onClick={resetFilters}
            style={{ color: 'var(--blue)', fontWeight: 600, fontSize: 13.5 }}
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Results Grid or Empty State */}
      {sorted.length > 0 ? (
        <div className="grid grid-3">
          {sorted.map((r) => (
            <RequestCard
              r={r}
              key={r.id}
              onClick={(req) => setSelectedRequest(req)}
            />
          ))}
        </div>
      ) : (
        <div className="empty">
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <IconSearch size={28} color="var(--ink-muted)" />
          </div>
          <h3 style={{ fontSize: 20, marginBottom: 8 }}>No matching requests found</h3>
          <p className="muted" style={{ maxWidth: 420, margin: '0 auto 20px', fontSize: 14.5 }}>
            We couldn't find any requests matching your filters. Try adjusting your search keyword or browse all categories.
          </p>
          <button className="btn btn-primary btn-sm" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      )}

      {/* Request Detail Modal */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </section>
  );
}
