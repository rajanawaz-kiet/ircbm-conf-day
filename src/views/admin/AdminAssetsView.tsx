import React, { useState } from 'react';
import { ConferenceAsset } from '../../types';

interface AdminAssetsViewProps {
  assets: ConferenceAsset[];
  onAddAsset: (name: string, type: 'logo' | 'banner' | 'brochure' | 'other', url: string, description?: string) => void;
  onToggleAsset: (id: string) => void;
  onDeleteAsset: (id: string) => void;
  onResetAssets: () => void;
}

export const AdminAssetsView: React.FC<AdminAssetsViewProps> = ({
  assets,
  onAddAsset,
  onToggleAsset,
  onDeleteAsset,
  onResetAssets,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'logo' | 'banner' | 'brochure' | 'other'>('logo');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Handle direct file upload to base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG or JPEG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUrl(result);
      if (!name.trim()) {
        setName(file.name.split('.')[0]);
      }
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name.trim()) {
      setError('Please enter an asset name.');
      return;
    }
    if (!url.trim()) {
      setError('Please provide an image URL or upload an image file.');
      return;
    }

    onAddAsset(name.trim(), type, url.trim(), description.trim() || undefined);
    setName('');
    setUrl('');
    setDescription('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Asset Management</h2>
          <p className="text-xs text-slate-600 mt-1">
            Manage optional graphics. The three official KIET and IRCBM branding images are fixed in the website code and updated through GitHub and Netlify.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset all assets to defaults?')) {
              onResetAssets();
            }
          }}
          className="px-4 py-2 text-xs font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all cursor-pointer"
        >
          Reset to Default Assets
        </button>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-slate-800">
        <strong>Official branding is fixed:</strong> Header, homepage and participant pass use
        <code> /ircbm-2026-official.png</code>, <code> /kiet-official.png</code> and
        <code> /kiet-25-years.jpg</code> from the deployed public folder. Changes here will not replace those three logos.
      </div>

      {/* Success / Error Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl">
          Asset added successfully!
        </div>
      )}

      {/* Add Asset Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Add New Asset</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Asset Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Main Logo"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Asset Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="logo">Logo</option>
              <option value="banner">Banner</option>
              <option value="brochure">Brochure</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Upload Image (PNG / JPEG) or Image URL</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://... or upload file"
              className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 cursor-pointer flex items-center justify-center transition-all">
              Choose File
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Description (Optional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description"
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
        >
          Add Asset
        </button>
      </form>

      {/* Asset List */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Uploaded Assets ({assets.length})</h3>

        {assets.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No assets uploaded yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {assets.map((asset) => (
              <div key={asset.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{asset.name}</h4>
                    <p className="text-xs text-slate-500">{asset.type} • {asset.description || 'No description'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleAsset(asset.id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      asset.isActive
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {asset.isActive ? 'Active' : 'Set Active'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Delete this asset?')) {
                        onDeleteAsset(asset.id);
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-bold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg transition-all cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
