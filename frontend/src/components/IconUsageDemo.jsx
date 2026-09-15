import React from 'react';
import Icon from './IconPreview';

// Component untuk menunjukkan penggunaan ikon-ikon yang direkomendasikan
const IconUsageDemo = () => {
  const iconSections = [
    {
      title: '🏠 Dashboard & Statistics',
      examples: [
        { icon: 'BarChart3', label: 'Statistics', desc: 'Dashboard ringkasan statistik' },
        { icon: 'PieChart', label: 'Categories', desc: 'Diagram pie kategori sampah' },
        { icon: 'TrendingUp', label: 'Trends', desc: 'Tren dan metrik' },
        { icon: 'FileText', label: 'Forms', desc: 'Form penyerahan' },
      ]
    },
    {
      title: '🗂️ Management Features',
      examples: [
        { icon: 'PlusCircle', label: 'Create Form', desc: 'Buat form penyerahan baru' },
        { icon: 'Edit', label: 'Edit', desc: 'Edit form' },
        { icon: 'Trash2', label: 'Delete', desc: 'Hapus form' },
        { icon: 'Printer', label: 'Print', desc: 'Cetak form A4' },
        { icon: 'Download', label: 'Export', desc: 'Export ke Excel' },
        { icon: 'Upload', label: 'Import', desc: 'Import data' },
      ]
    },
    {
      title: '👥 User Management',
      examples: [
        { icon: 'Users', label: 'Users', desc: 'Daftar pengguna' },
        { icon: 'UserCheck', label: 'Approval', desc: 'Status approval' },
        { icon: 'Shield', label: 'Roles', desc: 'Manajemen role' },
        { icon: 'Building2', label: 'Departments', desc: 'Departemen' },
        { icon: 'MapPin', label: 'Plants', desc: 'Lokasi plant' },
        { icon: 'Phone', label: 'Contact', desc: 'Informasi kontak' },
        { icon: 'Mail', label: 'Email', desc: 'Komunikasi' },
      ]
    },
    {
      title: '🗑️ Waste Management',
      examples: [
        { icon: 'Package', label: 'Categories', desc: 'Kategori sampah' },
        { icon: 'Layers', label: 'Sub-items', desc: 'Item di dalam kategori' },
        { icon: 'Box', label: 'Containers', desc: 'Container waste' },
        { icon: 'Recycle', label: 'Recycling', desc: 'Sistem recycling' },
        { icon: 'Thermometer', label: 'Classification', desc: 'Klasifikasi suhu' },
        { icon: 'SortAsc', label: 'Sort', desc: 'Urutkan data' },
        { icon: 'Grid', label: 'Grid View', desc: 'Tampilan grid' },
        { icon: 'List', label: 'List View', desc: 'Tampilan list' },
      ]
    },
    {
      title: '⚙️ Status & Process',
      examples: [
        { icon: 'Clock', label: 'Pending', desc: 'Menunggu approval' },
        { icon: 'CheckCircle', label: 'Approved', desc: 'Disetujui' },
        { icon: 'XCircle', label: 'Rejected', desc: 'Ditolak' },
        { icon: 'AlertTriangle', label: 'Warning', desc: 'Peringatan' },
        { icon: 'AlertCircle', label: 'Error', desc: 'Error terjadi' },
        { icon: 'Loader2', label: 'Loading', desc: 'Memuat data' },
        { icon: 'RefreshCw', label: 'Refresh', desc: 'Refresh data' },
      ]
    },
    {
      title: '🎨 Navigation & Utilities',
      examples: [
        { icon: 'Search', label: 'Search', desc: 'Search data' },
        { icon: 'Filter', label: 'Filter', desc: 'Filter data' },
        { icon: 'Menu', label: 'Menu', desc: 'Main navigation' },
        { icon: 'AlignJustify', label: 'Menu Alt', desc: 'Alternative menu' },
        { icon: 'ChevronLeft', label: 'Back', desc: 'Navigasi kembali' },
        { icon: 'ChevronRight', label: 'Next', desc: 'Navigasi selanjutnya' },
        { icon: 'ChevronsLeft', label: 'First', desc: 'Ke halaman pertama' },
        { icon: 'ChevronsRight', label: 'Last', desc: 'Ke halaman terakhir' },
        { icon: 'Home', label: 'Home', desc: 'Dashboard beranda' },
        { icon: 'Settings', label: 'Settings', desc: 'Pengaturan' },
        { icon: 'LogOut', label: 'Logout', desc: 'Keluar aplikasi' },
      ]
    },
    {
      title: '📅 Schedule & Location',
      examples: [
        { icon: 'Calendar', label: 'Date', desc: 'Picker tanggal' },
        { icon: 'MapPin', label: 'Location', desc: 'Lokasi plant' },
        { icon: 'Building2', label: 'Department', desc: 'Detail departemen' },
      ]
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
          <h1 className="text-2xl font-bold mb-2">SKDA Waste Management - Ikon yang Direkomendasikan</h1>
          <p className="text-blue-100">Koleksi ikon yang siap pakai berdasarkan tema manajemen limbah</p>
        </div>
        
        <div className="p-6">
          {iconSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                {section.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.examples.map((example, exampleIndex) => (
                  <div key={exampleIndex} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Icon name={example.icon} size={20} color="#3B82F6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{example.label}</h3>
                        <p className="text-sm text-gray-500">{example.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IconUsageDemo;