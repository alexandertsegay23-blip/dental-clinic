'use client';

import { useEffect, useState, useRef } from 'react';
import { Plus, Edit2, Trash2, X, Search, Image as ImageIcon, Upload, XCircle } from 'lucide-react';

interface GalleryImage {
  id: number;
  title: string;
  url: string;
  alt_text: string;
  sort_order: number;
  is_active: number;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    alt_text: '',
    sort_order: 0,
    is_active: true
  });
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/admin/gallery');
      if (res.ok) {
        const data = await res.json();
        setImages(data.images || []);
      }
    } catch (error) {
      console.error('Failed to fetch images:', error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData({ ...formData, url: data.url });
        setPreviewUrl(data.url);
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url) {
      alert('Please upload an image or enter a URL');
      return;
    }
    try {
      const url = editingImage ? `/api/admin/gallery/${editingImage.id}` : '/api/admin/gallery';
      const method = editingImage ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchImages();
        setShowModal(false);
        setEditingImage(null);
        setFormData({ title: '', url: '', alt_text: '', sort_order: 0, is_active: true });
        setPreviewUrl('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Failed to save image:', error);
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title || '',
      url: image.url,
      alt_text: image.alt_text || '',
      sort_order: image.sort_order,
      is_active: image.is_active === 1
    });
    setPreviewUrl(image.url);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchImages();
      }
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  const filteredImages = images.filter(image =>
    image.title?.toLowerCase().includes(search.toLowerCase()) ||
    image.alt_text?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-primary text-lg">Loading gallery...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Gallery</h1>
          <p className="text-text/60">Manage gallery images</p>
        </div>
        <button
          onClick={() => {
            setEditingImage(null);
            setFormData({ title: '', url: '', alt_text: '', sort_order: 0, is_active: true });
            setPreviewUrl('');
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-text-inverse rounded-lg hover:bg-primary-hover transition-colors"
        >
          <Plus size={18} />
          Add Image
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search images..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card-bg text-text focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image) => (
          <div key={image.id} className="bg-card-bg rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all">
            <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <ImageIcon size={48} className="text-primary/30" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-text">{image.title || 'Untitled'}</h3>
                  <p className="text-sm text-text-muted">{image.alt_text}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(image)}
                    className="p-1 text-text-muted hover:text-primary transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="p-1 text-text-muted hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">Sort: {image.sort_order}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${image.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {image.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredImages.length === 0 && (
        <div className="text-center py-12 text-text/60">
          No images found. Click "Add Image" to get started.
        </div>
      )}

      {/* Image Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-text/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card-bg rounded-xl border border-border p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text">
                {editingImage ? 'Edit Image' : 'Add New Image'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-text-muted hover:text-text"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Upload Image</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-text-inverse file:cursor-pointer hover:file:bg-primary-hover"
                />
                {uploading && <p className="text-sm text-text-muted mt-1">Uploading...</p>}
                {previewUrl && (
                  <div className="mt-2 relative inline-block">
                    <img src={previewUrl} alt="Preview" className="h-20 w-auto rounded-lg border border-border" />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl('');
                        setFormData({ ...formData, url: '' });
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                )}
                <p className="text-xs text-text-muted mt-1">Or enter a URL below</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Image URL (optional)</label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => {
                    setFormData({ ...formData, url: e.target.value });
                    setPreviewUrl(e.target.value);
                  }}
                  placeholder="https://example.com/photo.jpg or /uploads/photo.jpg"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Alt Text</label>
                <input
                  type="text"
                  value={formData.alt_text}
                  onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Sort Order</label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <label htmlFor="is_active" className="text-sm text-text">Active</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 border border-border rounded-lg hover:bg-background transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary text-text-inverse rounded-lg hover:bg-primary-hover transition-colors"
                >
                  {editingImage ? 'Update' : 'Add'} Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
