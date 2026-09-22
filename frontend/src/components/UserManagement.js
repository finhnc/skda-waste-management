import React, { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Users, Shield, UserPlus, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import api from '../api';

export default function UserManagement({ onBack, currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form state untuk tambah user baru
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'operator',
    plant_id: '1',
    department_id: '1'
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      // Jika endpoint mengembalikan data langsung atau dibungkus .data
      setUsers(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (err) {
      setError('Gagal memuat daftar pengguna. Pastikan Anda masuk sebagai Admin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/users', {
        ...formData,
        plant_id: Number(formData.plant_id),
        department_id: Number(formData.department_id),
      });

      setSuccess('Pengguna berhasil ditambahkan!');
      setShowModal(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'operator',
        plant_id: '1',
        department_id: '1'
      });
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menambahkan pengguna. Periksa kembali input Anda.');
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Yakin ingin menghapus pengguna "${userName}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }
    setError('');
    setSuccess('');
    try {
      await api.delete(`/users/${userId}`);
      setSuccess(`Pengguna "${userName}" berhasil dihapus.`);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menghapus pengguna.');
    }
  };

  return (
    <div className="page-wrap">
      <button className="back-link" onClick={onBack} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#145f3c', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Kembali ke Dashboard
      </button>

      <div className="page-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <span className="page-kicker">ADMINISTRASI SISTEM</span>
          <h1>Manajemen Pengguna</h1>
          <p>Kelola akun operator dan supervisor untuk akses Plant 3 & 5.</p>
        </div>
        <button 
          className="button button-primary" 
          onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#145f3c', color: 'white', padding: '10px 18px', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer' }}
        >
          <UserPlus size={18} /> Tambah User Baru
        </button>
      </div>

      {error && <div className="error-message" style={{ background: '#f8d7da', color: '#721c24', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertCircle size={18} />{error}</div>}
      {success && <div className="success-message" style={{ background: '#d4edda', color: '#155724', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={18} />{success}</div>}

      <div className="table-section" style={{ background: 'white', borderRadius: '12px', border: '1px solid #d2e0da', overflow: 'hidden' }}>
        <div className="table-scroll">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f0f6f2', textAlign: 'left', color: '#41675a', fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '16px 20px' }}>Nama</th>
                <th style={{ padding: '16px 20px' }}>Email</th>
                <th style={{ padding: '16px 20px' }}>Role</th>
                <th style={{ padding: '16px 20px' }}>Plant</th>
                <th style={{ padding: '16px 20px' }}>Departemen</th>
                <th style={{ padding: '16px 20px' }}>Dibuat Pada</th>
                <th style={{ padding: '16px 20px', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#71827c' }}>Memuat data pengguna...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#71827c' }}>Tidak ada pengguna ditemukan.</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #e4eee9' }}>
                    <td style={{ padding: '16px 20px', fontWeight: 600 }}>{u.name}</td>
                    <td style={{ padding: '16px 20px', color: '#71827c' }}>{u.email}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span className={`status ${u.role === 'admin' ? 'approved' : 'pending'}`} style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, background: u.role === 'admin' ? '#d7f8e2' : '#fff1b5', color: u.role === 'admin' ? '#07824a' : '#a06900' }}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>{u.plant?.name || 'Plant 3'}</td>
                    <td style={{ padding: '16px 20px' }}>{u.department?.name || 'GA'}</td>
                    <td style={{ padding: '16px 20px', color: '#71827c', fontSize: '13px' }}>{new Date(u.created_at).toLocaleDateString('id-ID')}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDelete(u.id, u.name)}
                        disabled={currentUser?.id === u.id}
                        style={{
                          color: currentUser?.id === u.id ? '#9ca3af' : '#dc2626',
                          background: 'transparent',
                          border: 'none',
                          cursor: currentUser?.id === u.id ? 'not-allowed' : 'pointer',
                          padding: '6px',
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background 0.2s',
                        }}
                        title={currentUser?.id === u.id ? 'Tidak dapat menghapus akun sendiri' : 'Hapus pengguna'}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Popup Tambah User */}
      {showModal && (
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="modal-content" style={{ background: 'white', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '480px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: '20px', color: '#173027' }}>Tambah Pengguna Baru</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'grid', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#49665a', textTransform: 'uppercase' }}>Nama Lengkap</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Contoh: Budi Santoso" style={{ width: '100%', padding: '10px 12px', border: '1px solid #c9dbd2', borderRadius: '8px' }} />
              </div>

              <div style={{ display: 'grid', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#49665a', textTransform: 'uppercase' }}>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="budi@skda.test" style={{ width: '100%', padding: '10px 12px', border: '1px solid #c9dbd2', borderRadius: '8px' }} />
              </div>

              <div style={{ display: 'grid', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#49665a', textTransform: 'uppercase' }}>Password (Min. 8 karakter)</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" style={{ width: '100%', padding: '10px 12px', border: '1px solid #c9dbd2', borderRadius: '8px' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'grid', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#49665a', textTransform: 'uppercase' }}>Role</label>
                  <select name="role" value={formData.role} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid #c9dbd2', borderRadius: '8px', background: 'white' }}>
                    <option value="operator">Operator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#49665a', textTransform: 'uppercase' }}>Plant</label>
                  <select name="plant_id" value={formData.plant_id} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid #c9dbd2', borderRadius: '8px', background: 'white' }}>
                    <option value="1">Plant 3</option>
                    <option value="2">Plant 5</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#49665a', textTransform: 'uppercase' }}>Departemen</label>
                <select name="department_id" value={formData.department_id} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid #c9dbd2', borderRadius: '8px', background: 'white' }}>
                  <option value="1">GA</option>
                  <option value="2">Gudang</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px', background: '#f2f7f4', border: '1px solid #d2e0da', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Batal</button>
                <button type="submit" style={{ flex: 1, padding: '10px', background: '#145f3c', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Simpan User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
