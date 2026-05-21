import { useState, useEffect } from 'react';
import { Loader2, Plus, Edit, Trash2, X, Save } from 'lucide-react';

export function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'petugas' });
  const [isSaving, setIsSaving] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers(data.users || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.role) {
      alert('Nama, Email, dan Role wajib diisi');
      return;
    }

    if (!editingUser && !formData.password) {
      alert('Password wajib diisi untuk pengguna baru');
      return;
    }

    setIsSaving(true);
    try {
      const url = '/api/admin/users';
      const method = editingUser ? 'PUT' : 'POST';
      const body = editingUser ? { ...formData, id: editingUser.id } : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      setShowModal(false);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus pengguna ini?')) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'petugas' });
    setShowModal(true);
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    setShowModal(true);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1e3a5f]">Manajemen Pengguna</h2>
          <p className="text-sm text-gray-500">Kelola akun superadmin dan petugas</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-[#1e3a5f] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#1e3a5f]/90 transition-colors"
        >
          <Plus size={18} /> Tambah Akun
        </button>
      </div>

      {error && <div className="text-rose-600 mb-4 text-sm">{error}</div>}

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-[#1e3a5f]" size={32} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="text-xs uppercase bg-gray-50 text-gray-400 font-bold">
              <tr>
                <th className="px-6 py-4 rounded-l-2xl">Nama</th>
                <th className="px-6 py-4">Username/Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4 rounded-r-2xl text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{u.name || '-'}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${u.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {u.last_login ? new Date(u.last_login).toLocaleString('id-ID') : 'Belum pernah'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEditModal(u)} className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(u.id)} className="p-2 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">Belum ada pengguna</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-blue-900">
                {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-[#1e3a5f]/10 outline-none"
                  placeholder="Nama Pengguna"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Email (Username)</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-[#1e3a5f]/10 outline-none"
                  placeholder="email@domain.com"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Role</label>
                <select 
                  value={formData.role} 
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-[#1e3a5f]/10 outline-none"
                >
                  <option value="petugas">Petugas</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">
                  Password {editingUser && '(Kosongkan jika tidak ingin diubah)'}
                </label>
                <input 
                  type="password" 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-[#1e3a5f]/10 outline-none"
                  placeholder={editingUser ? "Biarkan kosong" : "Minimal 6 karakter"}
                />
              </div>

              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full mt-4 py-3 bg-[#1e3a5f] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#1e3a5f]/90 transition-all disabled:bg-gray-300"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {editingUser ? 'SIMPAN PERUBAHAN' : 'BUAT AKUN'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
