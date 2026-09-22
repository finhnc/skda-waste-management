import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  ClipboardList,
  Eye,
  FileText,
  KeyRound,
  Leaf,
  LogOut,
  Plus,
  Printer,
  Recycle,
  Search,
  Trash2,
  FileCheck,
  Clock,
  Scale,
  RotateCcw,
  Users,
  UserCheck,
} from 'lucide-react';
import api, { setAuthToken } from './api';
import * as XLSX from 'xlsx-js-style';
import UserManagement from './components/UserManagement';

const plantIds = { 'Plant 3': 1, 'Plant 5': 2 };
const departmentIds = { Produksi: 1, Gudang: 2 };
const categoryIds = { Kertas: 1, Plastik: 2, Logam: 3, Lainnya: 4 };
const ENABLE_ANIMATED_LOGIN = true;

function currentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function createBlankItem() {
  return { code: '', name: '', category: 'Kertas', weight: '', quantity: '1', packageType: 'Sak', time: currentTime(), notes: '' };
}

function displayDateInput(date) {
  if (!date) return '13/09/2026';
  const [year, month, day] = String(date).split('T')[0].split('-');
  return year && month && day ? `${day}/${month}/${year}` : date;
}

function Brand({ light = false }) {
  return <div className={`brand ${light ? 'brand-light' : ''}`}><span className="brand-mark"><Leaf size={19} /></span><span><strong>SKDA</strong><small>Sistem Penyerahan Sampah</small></span></div>;
}

function LoadingScreen({ message = 'Memuat data...' }) {
  return <main className="loading-screen"><div className="loading-mark"><Recycle size={42} strokeWidth={1.7} /></div><strong>SKDA</strong><span>{message}</span></main>;
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('operator@skda.test');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    if (!email || !password) return setError('Email dan password wajib diisi.');
    try {
      setError('');
      const response = await api.post('/login', { email, password });
      onLogin(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Tidak dapat terhubung ke server.');
    }
  }

  return <main className={`login-page ${ENABLE_ANIMATED_LOGIN ? 'login-animated' : ''}`}>
    <section className="login-visual">
      <Brand light />
      <div className="visual-copy">
        <span className="eyebrow"><span className="eyebrow-dot" /> Plant 3 & 5 · Mojokerto</span>
        <h1>Sistem Penyerahan<br /><em>Sampah Digital</em></h1>
        <p>Kelola penyerahan sampah industri secara efisien, terdokumentasi, dan mudah diaudit langsung dari browser.</p>
        <div className="feature-list"><span>▣</span> Form digital terstruktur & terstandarisasi <span>✓</span> Alur persetujuan multi-level <span>▣</span> Cetak & ekspor PDF siap arsip</div>
      </div>
      <div className="visual-footer"><strong>PT. Sinar Karya Duta Abadi</strong><small>Terbit tanggal: 26 Mei 2025 · Rev: 01</small></div>
    </section>
    <section className="login-panel">
      <div className="login-panel-inner">
        <span className="login-kicker">PORTAL ADMINISTRASI</span>
        <h2>Selamat Datang</h2><p>Masuk ke akun Anda untuk melanjutkan</p>
        <form onSubmit={submit}>
          <label>User<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Masukkan email" /></label>
          <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan password" /></label>
          {error && <div className="error-text">{error}</div>}
          <button className="button button-primary button-wide" type="submit">Masuk ke Sistem <ArrowRight size={16} /></button>
        </form>
        <small className="login-note">PT. Sinar Karya Duta Abadi · Plant 3 & 5 Mojokerto</small>
      </div>
    </section>
  </main>;
}

function Header({ user, onLogout, onNavigateUsers, onChangePassword }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="topbar">
      <Brand />
      <div className="topbar-actions">
        <span className="context">Plant 3 & 5 · Mojokerto</span>
        <span className="revision">Rev: 01</span>
        
        <div className="user-dropdown-container" ref={dropdownRef} style={{ position: 'relative' }}>
          <button 
            type="button" 
            className="user-chip-button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: dropdownOpen ? '#e8f3ec' : '#fff',
              border: '1px solid #c9dbd2',
              borderRadius: '24px',
              padding: '4px 12px 4px 6px',
              cursor: 'pointer',
              color: '#173027',
              transition: 'all 0.2s',
            }}
          >
            <span style={{
              display: 'grid',
              placeItems: 'center',
              background: '#145f3c',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              fontWeight: 700,
              color: 'white',
              fontSize: '14px',
            }}>
              {user.name.charAt(0).toUpperCase()}
            </span>
            <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
              <strong style={{ display: 'block', fontSize: '13px' }}>{user.name}</strong>
              <small style={{ fontSize: '11px', color: '#65766f', textTransform: 'capitalize' }}>{user.role}</small>
            </div>
            <ChevronDown size={14} style={{ marginLeft: '4px', transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {dropdownOpen && (
            <div 
              className="user-menu-dropdown"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                background: 'white',
                border: '1px solid #d2e0da',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                minWidth: '220px',
                zIndex: 1000,
                overflow: 'hidden',
                padding: '6px 0',
              }}
            >
              <div style={{ padding: '10px 16px', borderBottom: '1px solid #eef3f0', background: '#fafcfb' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#65766f', textTransform: 'uppercase' }}>Akun Pengguna</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#173027', marginTop: '2px', wordBreak: 'break-all' }}>{user.email}</div>
              </div>

              {user.role === 'admin' && (
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    onNavigateUsers();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '10px 16px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    color: '#173027',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f7f3')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <Users size={16} color="#145f3c" />
                  Manajemen Pengguna
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  onChangePassword();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 16px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  color: '#173027',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f7f3')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                <KeyRound size={16} color="#145f3c" />
                Ubah Password
              </button>

              <div style={{ height: '1px', background: '#eef3f0', margin: '4px 0' }} />

              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  onLogout();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 16px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  color: '#dc2626',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                <LogOut size={16} color="#dc2626" />
                Keluar (Logout)
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function ChangePasswordModal({ user, onClose, onSuccess }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      return setError('Password baru minimal 8 karakter.');
    }
    if (newPassword !== confirmPassword) {
      return setError('Konfirmasi password tidak cocok.');
    }

    try {
      setLoading(true);
      const payload = {
        password: newPassword,
      };
      if (user.role !== 'admin') {
        payload.current_password = currentPassword;
      }

      await api.put(`/users/${user.id}/password`, payload);
      onSuccess('Password Anda berhasil diperbarui!');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengubah password. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 1100, padding: '20px' }}>
      <div className="modal-content" style={{ background: 'white', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '420px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ background: '#dcefe5', padding: '8px', borderRadius: '8px', display: 'grid', placeItems: 'center' }}>
            <KeyRound size={20} color="#145f3c" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', color: '#173027' }}>Ubah Password</h2>
            <small style={{ color: '#65766f' }}>Akun: {user.email}</small>
          </div>
        </div>

        {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px 12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
          {user.role !== 'admin' && (
            <div style={{ display: 'grid', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#49665a', textTransform: 'uppercase' }}>Password Saat Ini</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #c9dbd2', borderRadius: '8px' }}
              />
            </div>
          )}

          <div style={{ display: 'grid', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#49665a', textTransform: 'uppercase' }}>Password Baru (Min. 8 karakter)</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #c9dbd2', borderRadius: '8px' }}
            />
          </div>

          <div style={{ display: 'grid', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#49665a', textTransform: 'uppercase' }}>Konfirmasi Password Baru</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #c9dbd2', borderRadius: '8px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{ flex: 1, padding: '10px', background: '#f2f7f4', border: '1px solid #d2e0da', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ flex: 1, padding: '10px', background: '#145f3c', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
            >
              {loading ? 'Menyimpan...' : 'Simpan Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StatCard({ label, value, hint, tone = '' }) {
  const getIcon = () => {
    if (label === 'TOTAL FORM') return <FileCheck size={16} />;
    if (label === 'DISETUJUI') return <Check size={16} />;
    if (label === 'MENUNGGU') return <Clock size={16} />;
    if (label === 'TOTAL BERAT') return <Scale size={16} />;
    return null;
  };
  
  return (
    <div className={`stat-card ${tone}`}>
      {getIcon()}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}


function DashboardLegacy({ forms, onNew, onDetail }) {
  const [query, setQuery] = useState('');
  const filtered = forms.filter((form) => Object.values(form).join(' ').toLowerCase().includes(query.toLowerCase()));
  const totalWeight = forms.reduce((total, form) => total + Number.parseFloat(form.weight), 0).toFixed(1);
  return <div className="page-wrap"><div className="page-heading"><div><span className="page-kicker">OVERVIEW</span><h1>Dashboard</h1><p>Ringkasan aktivitas penyerahan sampah Anda.</p></div><button className="button button-primary" onClick={onNew}><Plus size={18} /> Buat Form</button></div>
    <div className="stats"><StatCard label="TOTAL FORM" value={statistics.total} hint="sesuai filter" /><StatCard label="DISETUJUI" value={statistics.approved} hint="seluruh hasil" tone="green-soft" /><StatCard label="MENUNGGU" value={statistics.pending} hint="seluruh hasil" tone="yellow-soft" /><StatCard label="TOTAL BERAT" value={`${Number(statistics.total_weight).toFixed(1)} kg`} hint="seluruh hasil" tone="green-dark" /></div>
    <section className="table-section"><div className="section-head"><div><h2>Daftar Form Penyerahan</h2><p>PT. Sinar Karya Duta Abadi — Plant 3 & 5</p></div><div className="search-box"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari form..." /></div></div><div className="table-scroll"><table><thead><tr><th>No. Form</th><th>Tanggal</th><th>Dept / Plant</th><th>Dibuat Oleh</th><th>Total Berat</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{filtered.map((form) => <tr key={form.number}><td className="form-number">{form.number}</td><td>{form.date}</td><td>{form.department} · <span className="muted">{form.plant}</span></td><td>{form.creator}</td><td>{form.weight}</td><td><span className={`status ${form.status === 'Disetujui' ? 'approved' : 'pending'}`}>{form.status}</span></td><td><button className="button button-outline button-small" onClick={() => onDetail(form)}><Eye size={15} /> Detail</button></td></tr>)}</tbody></table></div></section>
    <div className="dashboard-bottom"><div><BarChart3 size={18} /><span>Data tersinkron dengan aktivitas terakhir</span></div><span>Diperbarui beberapa saat lalu</span></div>
  </div>;
}

function SubmissionForm({ onBack, onSaved, initialForm = null }) {
  const [form, setForm] = useState(() => initialForm ? { date: displayDateInput(initialForm.raw?.submission_date), plant: initialForm.plant, department: initialForm.department, creator: initialForm.creator, supervisor: initialForm.raw?.supervisor_name || '', manager: initialForm.raw?.tps_manager_name || '' } : { date: '13/09/2026', plant: 'Plant 3', department: 'Produksi', creator: '', supervisor: '', manager: '' });
  const [items, setItems] = useState(() => initialForm?.raw?.items?.map((item) => ({ code: item.waste_code, name: item.waste_name, category: item.category?.name || 'Kertas', weight: item.weight_kg, quantity: item.package_quantity, packageType: item.package_type, time: item.handover_time, notes: item.notes || '' })) || [createBlankItem()]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const updateForm = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const updateItem = (index, key, value) => setItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  const addItem = () => setItems((current) => [...current, createBlankItem()]);
  const removeItem = (index) => setItems((current) => current.length === 1 ? current : current.filter((_, itemIndex) => itemIndex !== index));
  async function save() {
    if (!form.creator || items.some((item) => !item.code || !item.name || !item.weight || !item.packageType)) return setError('Lengkapi data pembuat dan seluruh item terlebih dahulu.');
    try {
      setSaving(true); setError('');
      await onSaved({ submission_date: form.date.split('/').reverse().join('-'), plant_id: plantIds[form.plant], department_id: departmentIds[form.department], supervisor_name: form.supervisor || null, tps_manager_name: form.manager || null, items: items.map((item) => ({ waste_code: item.code, waste_name: item.name, waste_category_id: categoryIds[item.category], weight_kg: Number(item.weight), package_quantity: Number(item.quantity), package_type: item.packageType, handover_time: item.time, notes: item.notes || null })) });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Form belum dapat disimpan.');
    } finally { setSaving(false); }
  }
  return <div className="page-wrap form-page"><button className="back-link" onClick={onBack}><ArrowLeft size={16} /> Kembali <span>/</span> Form Baru</button><section className="form-card intro-card"><div className="form-banner"><span>FORMULIR PENYERAHAN SAMPAH</span><h1>PT. Sinar Karya Duta Abadi</h1></div><div className="form-grid form-meta"><Field label="Tanggal"><input type="text" value={form.date} onChange={(e) => updateForm('date', e.target.value)} /></Field><Field label="Plant"><Select value={form.plant} onChange={(e) => updateForm('plant', e.target.value)} options={['Plant 3', 'Plant 5']} /></Field><Field label="Departemen"><input value={form.department} onChange={(e) => updateForm('department', e.target.value)} /></Field><Field required label="Dibuat Oleh"><input placeholder="Nama karyawan" value={form.creator} onChange={(e) => updateForm('creator', e.target.value)} /></Field><Field label="Disetujui (opsional)"><input placeholder="Nama supervisor" value={form.supervisor} onChange={(e) => updateForm('supervisor', e.target.value)} /></Field><Field label="Pengurus TPS"><input placeholder="Nama pengurus" value={form.manager} onChange={(e) => updateForm('manager', e.target.value)} /></Field></div></section><section className="form-card item-card"><div className="section-head item-head"><div><h2>Tambah Item Sampah</h2><p>Ketik kode atau jenis secara manual, atau pilih dari saran yang muncul</p></div><span className="item-count">{items.length} item</span></div>{items.map((item, index) => <div className="item-block" key={index}><div className="form-grid item-grid"><Field required label="Kode Sampah"><input placeholder="W-001 atau kustom" value={item.code} onChange={(e) => updateItem(index, 'code', e.target.value)} /></Field><Field required label="Jenis / Nama Sampah" wide><input placeholder="Nama sampah" value={item.name} onChange={(e) => updateItem(index, 'name', e.target.value)} /></Field><Field label="Kategori"><Select value={item.category} onChange={(e) => updateItem(index, 'category', e.target.value)} options={['Kertas', 'Plastik', 'Logam', 'Lainnya']} /></Field><Field required label="Berat (kg)"><input type="number" min="0" step="0.01" placeholder="0.00" value={item.weight} onChange={(e) => updateItem(index, 'weight', e.target.value)} /></Field><Field label="Jml. Kemasan"><input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} /></Field><Field required label="Jenis Kemasan"><input value={item.packageType} onChange={(e) => updateItem(index, 'packageType', e.target.value)} /></Field><Field label="Waktu Penyerahan"><input type="time" value={item.time} onChange={(e) => updateItem(index, 'time', e.target.value)} /></Field><Field label="Keterangan (opsional)" wide full><input placeholder="Catatan tambahan" value={item.notes} onChange={(e) => updateItem(index, 'notes', e.target.value)} /></Field></div>{items.length > 1 && <button className="remove-item" onClick={() => removeItem(index)}><Trash2 size={14} /> Hapus item</button>}</div>)}<button className="button button-secondary" onClick={addItem}><Plus size={17} /> Tambah ke Daftar</button></section>{error && <div className="error-text form-error">{error}</div>}<div className="form-actions"><button className="button button-cancel" onClick={onBack}>Batal</button><button className="button button-primary" onClick={save} disabled={saving}><Check size={17} /> {saving ? 'Menyimpan...' : 'Simpan & Submit Form'}</button></div></div>;
}

function Field({ label, required, children, wide, full }) { return <label className={`${wide ? 'field-wide' : ''} ${full ? 'field-full' : ''}`}><span>{label}{required && <b>*</b>}</span>{children}</label>; }
function Select({ options, ...props }) { return <div className="select-wrap"><select {...props}>{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={15} /></div>; }

function exportFormToExcel(form, items) {
  const rows = [
    ['PT. SINAR KARYA DUTA ABADI'],
    ['PLANT 3 & 5 - MOJOKERTO'],
    ['FORM PENYERAHAN SAMPAH'],
    [],
    ['No. Form', form.number, '', 'Tanggal', form.date],
    ['Plant', form.plant, '', 'Departemen', form.department],
    [],
    ['NO', 'KODE', 'JENIS / NAMA SAMPAH', 'BERAT (KG)', 'JUMLAH KEMASAN', 'JENIS KEMASAN', 'WAKTU PENYERAHAN', 'KETERANGAN'],
    ...items.map((item, index) => [index + 1, item.waste_code, item.waste_name, Number(item.weight_kg), Number(item.package_quantity), item.package_type, item.handover_time, item.notes || '']),
    [],
    ['TOTAL', '', '', items.reduce((sum, item) => sum + Number(item.weight_kg), 0), items.reduce((sum, item) => sum + Number(item.package_quantity), 0), '', '', ''],
    [],
    ['Dibuat Oleh', '', '', 'Pengurus TPS'],
    [form.creator, '', '', form.raw?.tps_manager_name || ''],
  ];
  const sheet = XLSX.utils.aoa_to_sheet(rows);
  sheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }, { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } }, { s: { r: 2, c: 0 }, e: { r: 2, c: 7 } }];
  sheet['!cols'] = [6, 15, 32, 14, 17, 17, 19, 28].map((wch) => ({ wch }));
  const green = '145F3C';
  const lightGreen = 'DCEFE5';
  const border = { top: { style: 'thin', color: { rgb: 'B8CFC3' } }, bottom: { style: 'thin', color: { rgb: 'B8CFC3' } }, left: { style: 'thin', color: { rgb: 'B8CFC3' } }, right: { style: 'thin', color: { rgb: 'B8CFC3' } } };
  for (let column = 0; column < 8; column += 1) {
    ['A1', 'A2', 'A3'].forEach((cell) => { if (sheet[cell]) sheet[cell].s = { font: { bold: true, color: { rgb: green }, sz: cell === 'A1' ? 16 : 11 }, alignment: { horizontal: 'center' } }; });
    const headerCell = XLSX.utils.encode_cell({ r: 7, c: column });
    if (sheet[headerCell]) sheet[headerCell].s = { font: { bold: true, color: { rgb: 'FFFFFF' } }, fill: { fgColor: { rgb: green } }, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }, border };
  }
  for (let row = 8; row < 8 + items.length; row += 1) {
    for (let column = 0; column < 8; column += 1) {
      const cell = XLSX.utils.encode_cell({ r: row, c: column });
      if (sheet[cell]) sheet[cell].s = { border, alignment: { vertical: 'center', horizontal: column === 2 || column === 7 ? 'left' : 'center' }, numFmt: column === 3 ? '0.00' : undefined };
    }
  }
  for (let column = 0; column < 8; column += 1) {
    const cell = XLSX.utils.encode_cell({ r: 9 + items.length, c: column });
    if (sheet[cell]) sheet[cell].s = { font: { bold: true, color: { rgb: green } }, fill: { fgColor: { rgb: lightGreen } }, border, alignment: { horizontal: 'center' }, numFmt: column === 3 ? '0.00' : undefined };
  }
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, 'Form Penyerahan');
  XLSX.writeFile(workbook, `${form.number.replaceAll('/', '-')}.xlsx`);
}

function Detail({ form, onBack, onEdit, onApprovalChange, currentUser }) {
  const items = form.raw?.items || [];
  const isApproved = ['approved', 'selesai'].includes(form.raw?.status);
  const isPrinted = form.raw?.status === 'selesai';
  const canApprove = currentUser?.role === 'admin';

  async function approveForm() {
    try {
      const response = await api.patch(`/submission-forms/${form.raw.id}/approval`, { status: 'approved' });
      onApprovalChange(mapForm(response.data));
    } catch (requestError) {
      window.alert(requestError.response?.data?.message || 'Form gagal disetujui.');
    }
  }

  async function printForm() {
    try {
      if (!isPrinted) {
        const response = await api.patch(`/submission-forms/${form.raw.id}/print`);
        onApprovalChange({ ...form, raw: { ...form.raw, status: response.data.status }, status: 'Selesai' });
      }
      window.print();
    } catch (requestError) {
      window.alert(requestError.response?.data?.message || 'Form belum dapat dicetak.');
    }
  }

  return <><div className="page-wrap detail-screen"><button className="back-link" onClick={onBack}><ArrowLeft size={16} /> Kembali ke Dashboard</button><div className="detail-heading"><div><span className="page-kicker">DETAIL FORM</span><h1>{form.number}</h1><p>{form.date} · {form.department} · {form.plant}</p></div><div className="detail-actions"><span className={`status status-large ${isApproved ? 'approved' : 'pending'}`}>{isPrinted ? 'Selesai' : form.status}</span>{!isApproved && canApprove && <button className="button button-secondary" onClick={approveForm}><UserCheck size={16} /> Konfirmasi Disetujui</button>}<button className="button button-outline" onClick={onEdit}><FileText size={16} /> Edit Form</button><button className="button button-outline" onClick={() => exportFormToExcel(form, items)}><FileText size={16} /> Export Excel</button><button className="button button-primary" disabled={!isApproved} title={!isApproved ? 'Konfirmasi persetujuan terlebih dahulu' : 'Cetak form'} onClick={printForm}><Printer size={16} /> Cetak Form</button></div></div><section className="detail-sheet"><div className="sheet-title"><FileText size={20} /><div><h2>Form Penyerahan Sampah</h2><p>PT. Sinar Karya Duta Abadi</p></div></div><div className="detail-info"><span>Dibuat oleh<strong>{form.creator}</strong></span><span>Total berat<strong>{form.weight}</strong></span><span>Plant<strong>{form.plant}</strong></span></div><div className="detail-items"><table><thead><tr><th>No</th><th>Kode</th><th>Jenis / Nama Sampah</th><th>Berat (kg)</th><th>Kemasan</th><th>Waktu</th></tr></thead><tbody>{items.map((item, index) => <tr key={item.id || index}><td>{index + 1}</td><td>{item.waste_code}</td><td>{item.waste_name}</td><td>{Number(item.weight_kg).toFixed(2)}</td><td>{item.package_quantity} {item.package_type}</td><td>{item.handover_time}</td></tr>)}</tbody></table></div><button className="button button-outline" onClick={onBack}><ArrowLeft size={16} /> Kembali ke daftar</button></section></div><PrintableForm form={form} items={items} /></>;
}

function PrintableForm({ form, items }) {
  const total = items.reduce((sum, item) => sum + Number(item.weight_kg), 0);
  return <section className="print-document"><div className="print-topline"><span>{new Date().toLocaleDateString('id-ID')}</span><span>Form Penyerahan Sampah - {form.number}</span></div><header className="print-header"><strong>PT. SINAR KARYA DUTA ABADI</strong><b>PLANT 3 & 5 - MOJOKERTO</b><h1>PENYERAHAN SAMPAH</h1></header><div className="print-meta"><span><b>No. Form:</b> {form.number}<br /><b>Tanggal:</b> {form.date}<br /><b>Plant:</b> {form.plant}</span><span><b>Departemen:</b> {form.department}<br /><b>Rev:</b> 01</span></div><table className="print-table"><thead><tr><th>NO</th><th>KODE</th><th>JENIS</th><th>JUMLAH<br />BERAT (kg)</th><th>JUMLAH KEMASAN<br />(Sak/Jumbo<br />Bag/Pallet)</th><th>WAKTU<br />PENYERAHAN</th></tr></thead><tbody>{[...items, ...Array(Math.max(0, 10 - items.length)).fill(null)].slice(0, 10).map((item, index) => <tr key={index}><td>{index + 1}</td><td>{item?.waste_code || ''}</td><td>{item?.waste_name || ''}</td><td>{item ? Number(item.weight_kg).toFixed(2) : ''}</td><td>{item ? `${item.package_quantity} ${item.package_type}` : ''}</td><td>{item?.handover_time || ''}</td></tr>)}<tr className="print-total"><td colSpan="3">TOTAL</td><td>{total.toFixed(2)}</td><td>{items.reduce((sum, item) => sum + Number(item.package_quantity), 0)} unit</td><td /></tr></tbody></table><div className="signature-grid signature-grid-two"><span>Dibuat Oleh,<small>Dept. {form.department}</small><b>{form.creator}</b></span><span>Pengurus TPS,<small>Tempat Penampungan Sementara</small><b>{form.raw?.tps_manager_name || ''}</b></span></div><footer className="print-footer">F. Serah Terima Sampah · Rev: 01</footer></section>;
}

function PrintableFormLegacy({ form, items }) {
  const total = items.reduce((sum, item) => sum + Number(item.weight_kg), 0);
  return <section className="print-document"><div className="print-topline"><span>{new Date().toLocaleDateString('id-ID')}</span><span>Form Penyerahan Sampah - {form.number}</span></div><header className="print-header"><strong>PT. SINAR KARYA DUTA ABADI</strong><b>PLANT 3 & 5 - MOJOKERTO</b><h1>PENYERAHAN SAMPAH</h1></header><div className="print-meta"><span><b>No. Form:</b> {form.number}<br /><b>Tanggal:</b> {form.date}<br /><b>Plant:</b> {form.plant}</span><span><b>Departemen:</b> {form.department}<br /><b>Rev:</b> 01</span></div><table className="print-table"><thead><tr><th rowSpan="2">NO</th><th colSpan="2">KODE</th><th rowSpan="2">JENIS</th><th rowSpan="2">JUMLAH<br />BERAT (kg)</th><th rowSpan="2">JUMLAH KEMASAN<br />(Sak/Jumbo<br />Bag/Pallet)</th><th rowSpan="2">WAKTU<br />PENYERAHAN</th></tr><tr><th>KODE</th><th>KODE</th></tr></thead><tbody>{[...items, ...Array(Math.max(0, 10 - items.length)).fill(null)].slice(0, 10).map((item, index) => <tr key={index}><td>{index + 1}</td><td>{item?.waste_code || ''}</td><td>{item?.waste_code || ''}</td><td>{item?.waste_name || ''}</td><td>{item ? Number(item.weight_kg).toFixed(2) : ''}</td><td>{item ? `${item.package_quantity} ${item.package_type}` : ''}</td><td>{item?.handover_time || ''}</td></tr>)}<tr className="print-total"><td colSpan="4">TOTAL</td><td>{total.toFixed(2)}</td><td>{items.reduce((sum, item) => sum + Number(item.package_quantity), 0)} unit</td><td /></tr></tbody></table><div className="signature-grid"><span>Dibuat Oleh,<small>Dept. {form.department}</small><b>{form.creator}</b></span><span>Disetujui,<b>{form.raw?.supervisor_name || ''}</b></span><span>Pengurus TPS,<small>Tempat Penampungan Sementara</small><b>{form.raw?.tps_manager_name || ''}</b></span></div><footer className="print-footer">F. Serah Terima Sampah · Rev: 01</footer></section>;
}

function mapForm(form) {
  return {
    number: form.form_number,
    date: displayDateInput(form.submission_date),
    department: form.department?.name || '-',
    plant: form.plant?.name || '-',
    creator: form.creator?.name || '-',
    weight: `${(form.items || []).reduce((total, item) => total + Number(item.weight_kg), 0).toFixed(1)} kg`,
    itemCount: (form.items || []).length,
    status: ['approved', 'selesai'].includes(form.status) ? 'Disetujui' : 'Menunggu',
    raw: form,
  };
}

export default function App() {
  const savedUrlState = new URLSearchParams(window.location.search);
  const initialFilters = { search: savedUrlState.get('search') || '', date_from: savedUrlState.get('date_from') || '', date_to: savedUrlState.get('date_to') || '', status: savedUrlState.get('status') || '' };
  const initialPage = Number(savedUrlState.get('page')) || 1;
  const [user, setUser] = useState(null);
  const [forms, setForms] = useState([]);
  const [statistics, setStatistics] = useState({ total: 0, approved: 0, pending: 0, total_weight: 0 });
  const [pagination, setPagination] = useState({ current_page: initialPage, last_page: 1, total: 0, from: 0, to: 0 });
  const [filters, setFilters] = useState(initialFilters);
  const [screen, setScreen] = useState('dashboard');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [appSuccessMessage, setAppSuccessMessage] = useState('');

  async function loadForms(nextFilters = filters, page = 1) {
    const params = { ...nextFilters, page, per_page: 10 };
    const response = await api.get('/submission-forms', { params });
    setForms(response.data.data.map(mapForm));
    setStatistics(response.data.statistics || { total: 0, approved: 0, pending: 0, total_weight: 0 });
    setPagination({ current_page: response.data.current_page, last_page: response.data.last_page, total: response.data.total, from: response.data.from, to: response.data.to });
    const url = new URL(window.location.href);
    url.search = '';
    if (page > 1) url.searchParams.set('page', page);
    Object.entries(nextFilters).forEach(([key, value]) => { if (value) url.searchParams.set(key, value); });
    window.history.replaceState({}, '', url);
  }
  useEffect(() => {
    const token = localStorage.getItem('skda_token');
    if (!token) return setBooting(false);
    setAuthToken(token);
    Promise.all([api.get('/user'), loadForms(initialFilters, initialPage)])
      .then(([userResponse]) => { setUser(userResponse.data); })
      .catch(() => { localStorage.removeItem('skda_token'); setAuthToken(null); })
      .finally(() => setBooting(false));
  }, []);
  async function handleLogin(data) {
    localStorage.setItem('skda_token', data.token); setAuthToken(data.token); setUser(data.user); setLoading(true);
    try { await loadForms(); } catch (requestError) { setLoadError(requestError.response?.data?.message || 'Data form belum dapat dimuat.'); } finally { setLoading(false); }
  }
  async function handleLogout() { try { await api.post('/logout'); } finally { localStorage.removeItem('skda_token'); setAuthToken(null); setUser(null); setForms([]); } }
  async function handleSave(payload) { const response = await api.post('/submission-forms', payload); setForms((current) => [mapForm(response.data), ...current]); setScreen('dashboard'); }
  async function handleUpdate(payload) { const response = await api.put(`/submission-forms/${selected.raw.id}`, payload); const updated = mapForm(response.data); setForms((current) => current.map((form) => form.raw.id === updated.raw.id ? updated : form)); setSelected(updated); setScreen('detail'); }
  function handleApprovalChange(updated) { setSelected(updated); setForms((current) => current.map((form) => form.raw.id === updated.raw.id ? updated : form)); }

  const handleShowSuccess = (msg) => {
    setAppSuccessMessage(msg);
    setTimeout(() => setAppSuccessMessage(''), 5000);
  };

  if (booting) return <LoadingScreen message="Memulihkan sesi..." />;
  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <>
      <Header
        user={user}
        onLogout={handleLogout}
        onNavigateUsers={() => setScreen('users')}
        onChangePassword={() => setShowPasswordModal(true)}
      />

      {appSuccessMessage && (
        <div style={{ maxWidth: '1220px', margin: '16px auto 0', padding: '0 28px' }}>
          <div style={{ background: '#d4edda', color: '#155724', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, border: '1px solid #c3e6cb' }}>
            <Check size={18} /> {appSuccessMessage}
          </div>
        </div>
      )}

      {showPasswordModal && (
        <ChangePasswordModal
          user={user}
          onClose={() => setShowPasswordModal(false)}
          onSuccess={handleShowSuccess}
        />
      )}

      {screen === 'new' && <SubmissionForm onBack={() => setScreen('dashboard')} onSaved={handleSave} />}
      {screen === 'edit' && <SubmissionForm initialForm={selected} onBack={() => setScreen('detail')} onSaved={handleUpdate} />}
      {screen === 'detail' && <Detail form={selected} onBack={() => setScreen('dashboard')} onEdit={() => setScreen('edit')} onApprovalChange={handleApprovalChange} currentUser={user} />}
      {screen === 'report' && <Report onBack={() => setScreen('dashboard')} />}
      {screen === 'users' && <UserManagement onBack={() => setScreen('dashboard')} currentUser={user} />}
      {screen === 'dashboard' && (
        loading ? (
          <LoadingScreen message="Memuat data form..." />
        ) : (
          <>
            <Dashboard
              forms={forms}
              statistics={statistics}
              pagination={pagination}
              filters={filters}
              currentUser={user}
              onFilter={(nextFilters) => { setFilters(nextFilters); loadForms(nextFilters, 1); }}
              onPageChange={(page) => loadForms(filters, page)}
              onNew={() => setScreen('new')}
              onReport={() => setScreen('report')}
              onDetail={(form) => { setSelected(form); setScreen('detail'); }}
            />
            {loadError && <div className="error-text">{loadError}</div>}
          </>
        )
      )}
    </>
  );
}

const REPORT_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const REPORT_MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
];

function formatReportPeriod(periodStr, isDaily) {
  if (!periodStr) return '-';
  const parts = periodStr.split('-');
  if (isDaily && parts.length === 3) {
    const day = parts[2];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const yearVal = parts[0];
    return `${day} ${REPORT_MONTHS_SHORT[monthIndex] || parts[1]} ${yearVal}`;
  }
  if (!isDaily && parts.length === 2) {
    const monthIndex = parseInt(parts[1], 10) - 1;
    const yearVal = parts[0];
    return `${REPORT_MONTHS[monthIndex] || parts[1]} ${yearVal}`;
  }
  return periodStr;
}

function formatReportChartLabel(periodStr, isDaily) {
  if (!periodStr) return '';
  const parts = periodStr.split('-');
  if (isDaily && parts.length === 3) {
    return `${parts[2]}/${parts[1]}`;
  }
  if (!isDaily && parts.length === 2) {
    const monthIndex = parseInt(parts[1], 10) - 1;
    return REPORT_MONTHS_SHORT[monthIndex] || parts[1];
  }
  return periodStr;
}

function Report({ onBack }) {
  const [report, setReport] = useState(null);
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    const params = {};
    if (dateFrom || dateTo) {
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;
    } else {
      params.year = year;
      if (month) params.month = month;
    }
    api.get('/reports/submissions', { params })
      .then((response) => setReport(response.data))
      .catch((error) => console.error('Gagal memuat laporan statistik:', error));
  }, [year, month, dateFrom, dateTo]);

  if (!report) return <LoadingScreen message="Menyiapkan laporan statistik..." />;

  const isDaily = report.period_type === 'daily';
  const rows = report.monthly || [];
  const maxWeight = rows.length > 0 ? Math.max(...rows.map((row) => row.total_weight), 1) : 1;

  const chartData = rows.map((row, index) => {
    const x = rows.length > 1 ? (index / (rows.length - 1)) * 100 : 50;
    const y = 100 - (row.total_weight / maxWeight) * 80 - 10;
    return { ...row, x, y };
  });
  const points = chartData.map((d) => `${d.x},${d.y}`).join(' ');

  const totalCategoryWeight = report.categories.reduce((total, item) => total + item.total_weight, 0) || 1;
  const hasActiveFilters = Boolean(month || dateFrom || dateTo || String(year) !== String(currentYear));

  let periodDescription = `Tren total berat pada tahun ${year}`;
  if (dateFrom && dateTo) {
    periodDescription = `Periode ${dateFrom} s/d ${dateTo}`;
  } else if (dateFrom) {
    periodDescription = `Mulai dari tanggal ${dateFrom}`;
  } else if (dateTo) {
    periodDescription = `Sampai tanggal ${dateTo}`;
  } else if (month) {
    periodDescription = `Bulan ${REPORT_MONTHS[parseInt(month, 10) - 1]} ${year}`;
  }

  function resetFilters() {
    setYear(currentYear);
    setMonth('');
    setDateFrom('');
    setDateTo('');
  }

  return (
    <div className="page-wrap report-page">
      <button className="back-link" onClick={onBack}>
        <ArrowLeft size={16} /> Kembali ke Dashboard
      </button>

      <div className="page-heading">
        <div>
          <span className="page-kicker">ANALYTICS</span>
          <h1>Laporan Statistik</h1>
          <p>Rekap penyerahan sampah berdasarkan periode dan kategori.</p>
        </div>
      </div>

      <div className="report-filter-bar">
        <div className="report-filter-group">
          <div className="report-filter-item">
            <label>Tahun</label>
            <select
              value={year}
              disabled={Boolean(dateFrom || dateTo)}
              onChange={(event) => setYear(Number(event.target.value))}
            >
              <option value={currentYear}>{currentYear}</option>
              <option value={currentYear - 1}>{currentYear - 1}</option>
              <option value={currentYear - 2}>{currentYear - 2}</option>
            </select>
          </div>

          <div className="report-filter-item">
            <label>Bulan</label>
            <select
              value={month}
              disabled={Boolean(dateFrom || dateTo)}
              onChange={(event) => setMonth(event.target.value)}
            >
              <option value="">Semua Bulan (1 Tahun)</option>
              {REPORT_MONTHS.map((name, index) => (
                <option key={index + 1} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="report-filter-sep">
          <span>atau rentang tanggal:</span>
        </div>

        <div className="report-filter-group">
          <div className="report-filter-item">
            <label>Dari Tanggal</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(event) => {
                setDateFrom(event.target.value);
                setMonth('');
              }}
            />
          </div>

          <div className="report-filter-item">
            <label>Sampai Tanggal</label>
            <input
              type="date"
              value={dateTo}
              onChange={(event) => {
                setDateTo(event.target.value);
                setMonth('');
              }}
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className="button button-outline button-small report-reset-btn"
              onClick={resetFilters}
              title="Reset semua filter"
            >
              <RotateCcw size={14} /> Reset
            </button>
          )}
        </div>
      </div>

      <div className="stats">
        <StatCard label="TOTAL FORM" value={report.summary.total_forms} />
        <StatCard label="DISETUJUI" value={report.summary.approved} tone="green-soft" />
        <StatCard label="MENUNGGU" value={report.summary.pending} tone="yellow-soft" />
        <StatCard label="TOTAL BERAT" value={`${report.summary.total_weight.toFixed(1)} kg`} tone="green-dark" />
      </div>

      <div className="report-grid">
        <section className="report-card">
          <div className="section-head">
            <div>
              <h2>{isDaily ? 'Berat Sampah per Tanggal' : 'Berat Sampah per Bulan'}</h2>
              <p>{periodDescription}</p>
            </div>
          </div>
          <div className="line-chart">
            {rows.length === 0 ? (
              <div className="empty-history" style={{ padding: '60px 20px' }}>
                Tidak ada data tren pada periode ini.
              </div>
            ) : (
              <>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                  {rows.length > 1 && (
                    <polyline
                      points={points}
                      fill="none"
                      stroke="#145f3c"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                  {chartData.map((d, index) => (
                    <circle
                      key={d.month || d.period || index}
                      cx={d.x}
                      cy={d.y}
                      r="3"
                      fill="#145f3c"
                      stroke="#fff"
                      strokeWidth="1"
                      vectorEffect="non-scaling-stroke"
                    >
                      <title>{`${d.month || d.period}: ${d.total_weight.toFixed(1)} kg (${d.total_forms} form)`}</title>
                    </circle>
                  ))}
                </svg>
                <div className="chart-labels">
                  {chartData.map((row, idx) => {
                    const step = chartData.length > 20 ? 4 : (chartData.length > 12 ? 2 : 1);
                    const show = idx === 0 || idx === chartData.length - 1 || idx % step === 0;
                    return (
                      <span
                        key={row.month || row.period || idx}
                        style={{
                          visibility: show ? 'visible' : 'hidden',
                          fontSize: chartData.length > 15 ? '10px' : '11px',
                        }}
                      >
                        {formatReportChartLabel(row.month || row.period, isDaily)}
                      </span>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>

        <section className="report-card">
          <div className="section-head">
            <div>
              <h2>Distribusi Tipe Sampah</h2>
              <p>Total berat berdasarkan kategori</p>
            </div>
          </div>
          {report.categories.length === 0 ? (
            <div className="empty-history" style={{ padding: '60px 20px' }}>
              Tidak ada data kategori pada periode ini.
            </div>
          ) : (
            <>
              <div
                className="donut-chart"
                style={{
                  background: `conic-gradient(#145f3c 0 ${
                    report.categories[0] ? (report.categories[0].total_weight / totalCategoryWeight) * 100 : 0
                  }%, #4b9b6c 0 55%, #9ac8a8 0 77%, #d5e8da 0 100%)`,
                }}
              >
                <span>
                  {report.summary.total_weight.toFixed(1)}
                  <small>kg</small>
                </span>
              </div>
              <div className="legend">
                {report.categories.map((item, index) => (
                  <span key={item.category}>
                    <i className={`legend-${index % 4}`} />
                    {item.category} <b>{item.total_weight.toFixed(1)} kg</b>
                  </span>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      <section className="report-card report-table">
        <div className="section-head">
          <div>
            <h2>{isDaily ? 'Rekap Harian' : 'Rekap Bulanan'}</h2>
            <p>{periodDescription}</p>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>{isDaily ? 'Tanggal' : 'Bulan'}</th>
                <th>Total Form</th>
                <th>Disetujui</th>
                <th>Menunggu</th>
                <th>Total Berat</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-history">
                    Tidak ada data transaksi untuk periode yang dipilih.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.month || row.period}>
                    <td style={{ fontWeight: 600 }}>{formatReportPeriod(row.month || row.period, isDaily)}</td>
                    <td>{row.total_forms} form</td>
                    <td><span className="status approved">{row.approved}</span></td>
                    <td><span className="status pending">{row.pending}</span></td>
                    <td><b>{row.total_weight.toFixed(1)} kg</b></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Dashboard({ forms, statistics = { total: 0, approved: 0, pending: 0, total_weight: 0 }, pagination = { current_page: 1, last_page: 1, total: 0, from: 0, to: 0 }, filters = { search: '', date_from: '', date_to: '', status: '' }, onFilter, onPageChange, onNew, onDetail, onReport }) {
  const [query, setQuery] = useState(filters.search || '');
  const [dateFrom, setDateFrom] = useState(filters.date_from || '');
  const [dateTo, setDateTo] = useState(filters.date_to || '');
  const [status, setStatus] = useState(filters.status || '');

  function submitFilter(event) {
    event.preventDefault();
    onFilter({ search: query, date_from: dateFrom, date_to: dateTo, status });
  }

  function resetFilter() {
    setQuery('');
    setDateFrom('');
    setDateTo('');
    setStatus('');
    onFilter({ search: '', date_from: '', date_to: '', status: '' });
  }

  const totalWeight = Number(statistics.total_weight).toFixed(1);
  const approved = statistics.approved;
  const pending = statistics.pending;

  return <div className="page-wrap">
    <div className="page-heading"><div><span className="page-kicker">OVERVIEW</span><h1>Dashboard</h1><p>Ringkasan aktivitas penyerahan sampah Anda.</p></div><div className="heading-actions"><button className="button button-outline" onClick={onReport}><BarChart3 size={17} /> Laporan Statistik</button><button className="button button-primary" onClick={onNew}><Plus size={18} /> Buat Form</button></div></div>
    <div className="stats"><StatCard label="TOTAL FORM" value={pagination.total} hint="semua dokumen" /><StatCard label="DISETUJUI" value={approved} hint="di halaman ini" tone="green-soft" /><StatCard label="MENUNGGU" value={pending} hint="di halaman ini" tone="yellow-soft" /><StatCard label="TOTAL BERAT" value={`${totalWeight} kg`} hint={`${forms.reduce((total, form) => total + (form.itemCount || 0), 0)} item di halaman`} tone="green-dark" /></div><div className="status-tabs"><button className={!filters.status ? 'active' : ''} onClick={() => onFilter({ ...filters, status: '' })}>Semua</button><button className={filters.status === 'pending' ? 'active pending-tab' : ''} onClick={() => onFilter({ ...filters, status: 'pending' })}>Menunggu</button><button className={filters.status === 'approved' ? 'active approved-tab' : ''} onClick={() => onFilter({ ...filters, status: 'approved' })}>Disetujui</button></div>
    <section className="table-section"><div className="section-head history-head"><div><h2>Daftar Form Penyerahan</h2><p>Menampilkan {pagination.from || 0}-{pagination.to || 0} dari {pagination.total} form</p></div><form className="history-filters" onSubmit={submitFilter}><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nomor, nama, plant..." /><label>Dari<input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} /></label><label>Sampai<input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} /></label><button className="button button-primary button-small" type="submit"><Search size={14} /> Cari</button><button className="button button-outline button-small" type="button" onClick={resetFilter}>Reset</button></form></div><div className="table-scroll"><table><thead><tr><th className="row-number-heading">No.</th><th>No. Form</th><th>Tanggal</th><th>Dept / Plant</th><th>Dibuat Oleh</th><th>Total Berat</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{forms.map((form, index) => <tr key={form.number}><td className="row-number">{(pagination.from || 1) + index}</td><td className="form-number">{form.number}</td><td>{form.date}</td><td>{form.department} · <span className="muted">{form.plant}</span></td><td>{form.creator}</td><td>{form.weight}</td><td><span className={`status ${form.status === 'Disetujui' ? 'approved' : 'pending'}`}>{form.status}</span></td><td><button className="button button-outline button-small" onClick={() => onDetail(form)}><Eye size={15} /> Detail</button></td></tr>)}{forms.length === 0 && <tr><td colSpan="8" className="empty-history">Tidak ada histori form yang sesuai.</td></tr>}</tbody></table></div><div className="pagination"><span>Halaman {pagination.current_page} dari {pagination.last_page}</span><div><button className="button button-outline button-small" disabled={pagination.current_page <= 1} onClick={() => onPageChange(pagination.current_page - 1)}><ArrowLeft size={14} /> Sebelumnya</button><button className="button button-outline button-small" disabled={pagination.current_page >= pagination.last_page} onClick={() => onPageChange(pagination.current_page + 1)}>Berikutnya <ArrowRight size={14} /></button></div></div></section>
    <div className="dashboard-bottom"><div><BarChart3 size={18} /><span>Data tersinkron dengan aktivitas terakhir</span></div><span>Diperbarui beberapa saat lalu</span></div>
  </div>;
}