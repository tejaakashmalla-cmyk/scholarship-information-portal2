import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eligibilityAPI } from '../services/api';
import { SectionHeader, EmptyState, SkeletonCard, ProgressBar } from '../components/ui/index.jsx';
import SchemeCard from '../components/dashboard/SchemeCard.jsx';
import { RefreshCw, Search } from 'lucide-react';

const FILTERS = [
  { key: 'all',     label: 'All' },
  { key: 'eligible',    label: '✅ Eligible' },
  { key: 'ineligible',  label: '❌ Not Eligible' },
];

export default function ResultsPage() {
  const navigate               = useNavigate();
  const [results, setResults]  = useState(null);
  const [loading, setLoading]  = useState(true);
  const [filter, setFilter]    = useState('all');
  const [search, setSearch]    = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await eligibilityAPI.getResults();
        setResults(data);
      } catch {/* ignore */} finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-8 w-48 skeleton rounded-xl" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <EmptyState
        icon="🔍"
        title="No Results Yet"
        description="Run the eligibility check to see which scholarships you qualify for."
        action={
          <button className="btn btn-primary" onClick={() => navigate('/eligibility')}>
            Run Eligibility Check →
          </button>
        }
      />
    );
  }

  const allSchemes = results.results?.map(r => ({ ...r.scheme, eligible: r.eligible, reasons: r.reasons, matchScore: r.matchScore })) || [];
  const eligible    = allSchemes.filter(s => s.eligible);
  const ineligible  = allSchemes.filter(s => !s.eligible);

  const displayed = allSchemes
    .filter(s => {
      if (filter === 'eligible' && !s.eligible) return false;
      if (filter === 'ineligible' && s.eligible) return false;
      if (search && !s.name?.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    // eligible first
    .sort((a, b) => (b.eligible ? 1 : 0) - (a.eligible ? 1 : 0));

  return (
    <div className="animate-fade-in space-y-6">
      <SectionHeader
        title="My Results"
        subtitle={`Last checked: ${new Date(results.checkedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
        action={
          <button className="btn btn-outline btn-sm gap-1.5" onClick={() => navigate('/eligibility')}>
            <RefreshCw className="w-3.5 h-3.5" /> Re-check
          </button>
        }
      />

      {/* Summary banner */}
      <div className="card bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800 dark:to-slate-700/50">
        <div className="flex flex-wrap gap-6 items-center mb-3">
          <div className="text-center">
            <p className="text-2xl font-extrabold text-emerald-600">{eligible.length}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Eligible</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-red-500">{ineligible.length}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Not Eligible</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-gray-800 dark:text-slate-100">{allSchemes.length}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Total Checked</p>
          </div>
          <div className="flex-1 min-w-[160px]">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500 dark:text-slate-400">Match Rate</span>
              <span className="font-bold text-primary-600">{allSchemes.length ? Math.round((eligible.length / allSchemes.length) * 100) : 0}%</span>
            </div>
            <ProgressBar value={allSchemes.length ? (eligible.length / allSchemes.length) * 100 : 0} color="success" />
          </div>
        </div>
      </div>

      {/* Filters + search */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`chip ${filter === f.key ? 'chip-active' : ''}`}
            >
              {f.label}
              <span className="ml-1 text-[10px] font-bold opacity-70">
                {f.key === 'all' ? allSchemes.length : f.key === 'eligible' ? eligible.length : ineligible.length}
              </span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input className="input pl-9 text-xs py-2" placeholder="Search schemes…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Grid */}
      {displayed.length === 0 ? (
        <EmptyState icon="🔎" title="No schemes match" description="Try adjusting your filter or search." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayed.map(s => (
            <SchemeCard
              key={s._id}
              scheme={s}
              showEligibility
              onViewDetails={() => navigate(`/schemes/${s._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
