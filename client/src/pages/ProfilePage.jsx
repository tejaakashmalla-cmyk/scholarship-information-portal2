import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { SectionHeader, Avatar, ProgressBar, Spinner } from '../components/ui/index.jsx';
import { Save, User, MapPin, BookOpen, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

const EDU_LEVELS  = ['Below 10th', '10th Pass', '12th Pass', 'Graduation', 'Post Graduation', 'PhD'];
const CATEGORIES  = ['General', 'OBC', 'SC', 'ST', 'Minority'];
const GENDERS     = ['Male', 'Female', 'Other', 'Prefer not to say'];
const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jammu & Kashmir','Jharkhand','Karnataka','Kerala','Ladakh',
  'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Puducherry',
  'Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand',
  'West Bengal','Other',
];

const EMPTY = { fullName: '', age: '', annualIncome: '', educationLevel: '', category: '', state: '', gender: 'Prefer not to say', disabilityStatus: false };

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();
  const [form, setForm]     = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        fullName:       profile.fullName       || '',
        age:            profile.age            || '',
        annualIncome:   profile.annualIncome   || '',
        educationLevel: profile.educationLevel || '',
        category:       profile.category       || '',
        state:          profile.state          || '',
        gender:         profile.gender         || 'Prefer not to say',
        disabilityStatus: profile.disabilityStatus || false,
      });
    }
  }, [profile]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const completeness = () => {
    const fields = ['fullName', 'age', 'annualIncome', 'educationLevel', 'category', 'state'];
    const filled  = fields.filter(f => form[f] !== '' && form[f] !== undefined && form[f] !== null);
    return Math.round((filled.length / fields.length) * 100);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.age || !form.educationLevel || !form.category || !form.state) {
      toast.error('Please fill all required fields');
      return;
    }
    setSaving(true);
    try {
      const { data } = await userAPI.saveProfile({
        ...form,
        age:          Number(form.age),
        annualIncome: Number(form.annualIncome),
      });
      updateProfile(data.profile);
      toast.success('Profile saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const pct = completeness();

  return (
    <div className="max-w-2xl animate-fade-in">
      <SectionHeader
        title="My Profile"
        subtitle="Keep your details updated for accurate scholarship matching"
      />

      {/* Profile card header */}
      <div className="card mb-5">
        <div className="flex items-center gap-4 mb-5">
          <Avatar name={form.fullName || user?.name || '?'} size="xl" />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 dark:text-slate-100 truncate">{form.fullName || 'Your Name'}</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {form.educationLevel || 'Education not set'} · {form.state || 'State not set'}
            </p>
            <div className="mt-2">
              <ProgressBar value={pct} color={pct === 100 ? 'success' : 'primary'} />
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
                {pct}% complete {pct === 100 ? '✓' : '— fill remaining fields'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="card space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <User className="w-4 h-4 text-primary-600" />
          <h4 className="font-bold text-sm text-gray-700 dark:text-slate-300 uppercase tracking-wide">Personal Details</h4>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label">Full Name <span className="text-red-400">*</span></label>
            <input className="input" placeholder="e.g. Rahul Sharma" value={form.fullName} onChange={e => set('fullName', e.target.value)} required />
          </div>
          <div>
            <label className="label">Age <span className="text-red-400">*</span></label>
            <input className="input" type="number" placeholder="e.g. 21" min="5" max="60" value={form.age} onChange={e => set('age', e.target.value)} required />
          </div>
          <div>
            <label className="label">Gender</label>
            <select className="select" value={form.gender} onChange={e => set('gender', e.target.value)}>
              {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <div className="divider" />
        <div className="flex items-center gap-2 mb-1">
          <IndianRupee className="w-4 h-4 text-primary-600" />
          <h4 className="font-bold text-sm text-gray-700 dark:text-slate-300 uppercase tracking-wide">Financial & Academic</h4>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Annual Family Income (₹) <span className="text-red-400">*</span></label>
            <input className="input" type="number" placeholder="e.g. 200000" min="0" value={form.annualIncome} onChange={e => set('annualIncome', e.target.value)} required />
          </div>
          <div>
            <label className="label">Education Level <span className="text-red-400">*</span></label>
            <select className="select" value={form.educationLevel} onChange={e => set('educationLevel', e.target.value)} required>
              <option value="">Select education</option>
              {EDU_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Category <span className="text-red-400">*</span></label>
            <select className="select" value={form.category} onChange={e => set('category', e.target.value)} required>
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">State <span className="text-red-400">*</span></label>
            <select className="select" value={form.state} onChange={e => set('state', e.target.value)} required>
              <option value="">Select state</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/40 rounded-xl">
          <input
            id="disability"
            type="checkbox"
            checked={form.disabilityStatus}
            onChange={e => set('disabilityStatus', e.target.checked)}
            className="w-4 h-4 rounded accent-primary-600 cursor-pointer"
          />
          <label htmlFor="disability" className="text-sm text-gray-700 dark:text-slate-300 cursor-pointer font-medium">
            I am a Person with Disability (PwD)
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn btn-primary flex-1 py-3 gap-2">
            {saving ? <Spinner /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
          <button type="button" className="btn btn-ghost px-5" onClick={() => profile && setForm({ ...profile })}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
