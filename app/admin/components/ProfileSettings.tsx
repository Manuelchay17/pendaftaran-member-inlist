import { useState, useEffect } from 'react';
import { Loader2, Save, User } from 'lucide-react';

export function ProfileSettings() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/admin/profile');
        const data = await res.json();
        if (res.ok && data.user) {
          setFormData({ name: data.user.name || '', email: data.user.email || '', password: '' });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      setMessage({ type: 'error', text: 'Nama dan Email wajib diisi' });
      return;
    }

    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
      setFormData(prev => ({ ...prev, password: '' })); // clear password field
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex justify-center py-20">
        <Loader2 className="animate-spin text-[#1e3a5f]" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
          <User size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#1e3a5f]">Pengaturan Profil</h2>
          <p className="text-sm text-gray-500">Perbarui informasi akun Anda</p>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-rose-50 text-rose-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Nama Lengkap</label>
          <input 
            type="text" 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} 
            className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3.5 text-sm focus:bg-white focus:border-[#1e3a5f]/10 outline-none transition-all"
            placeholder="Nama Anda"
          />
        </div>
        
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email (Username)</label>
          <input 
            type="email" 
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})} 
            className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3.5 text-sm focus:bg-white focus:border-[#1e3a5f]/10 outline-none transition-all"
            placeholder="email@domain.com"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Password Baru (Opsional)</label>
          <input 
            type="password" 
            value={formData.password} 
            onChange={e => setFormData({...formData, password: e.target.value})} 
            className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-3.5 text-sm focus:bg-white focus:border-[#1e3a5f]/10 outline-none transition-all"
            placeholder="Kosongkan jika tidak ingin mengubah sandi"
          />
          <p className="text-xs text-gray-400 mt-2 ml-1">Minimal 6 karakter jika ingin diubah</p>
        </div>

        <button 
          onClick={handleSave}
          disabled={isSaving || (formData.password.length > 0 && formData.password.length < 6)}
          className="w-full mt-2 py-4 bg-[#1e3a5f] text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-[#1e3a5f]/90 transition-all active:scale-95 disabled:bg-gray-300 shadow-lg shadow-blue-900/20"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          SIMPAN PERUBAHAN PROFIL
        </button>
      </div>
    </div>
  );
}
