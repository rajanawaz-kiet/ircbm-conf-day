import React, { useState } from 'react';
import { Announcement } from '../../types';
import { Plus, Edit2, Trash2, Calendar, X } from 'lucide-react';

interface AdminAnnouncementsViewProps {
  announcements: Announcement[];
  onAddAnnouncement: (title: string, message: string) => void;
  onUpdateAnnouncement: (announcement: Announcement) => void;
  onDeleteAnnouncement: (id: string) => void;
}

export const AdminAnnouncementsView: React.FC<AdminAnnouncementsViewProps> = ({
  announcements,
  onAddAnnouncement,
  onUpdateAnnouncement,
  onDeleteAnnouncement,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const openPublishForm = () => {
    setEditingAnnouncement(null);
    setTitle('');
    setMessage('');
    setIsFormOpen(true);
  };

  const openEditForm = (item: Announcement) => {
    setEditingAnnouncement(item);
    setTitle(item.title);
    setMessage(item.message);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    if (editingAnnouncement) {
      onUpdateAnnouncement({
        ...editingAnnouncement,
        title: title.trim(),
        message: message.trim(),
      });
    } else {
      onAddAnnouncement(title.trim(), message.trim());
    }

    setIsFormOpen(false);
    setEditingAnnouncement(null);
  };

  // Sort reverse chronological
  const sorted = [...announcements].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B2038]">Announcements</h2>
          <p className="text-xs text-[#4B6178] mt-0.5">
            Broadcast official conference notices and updates to attendees
          </p>
        </div>

        <button
          id="admin-publish-announcement-btn"
          onClick={openPublishForm}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1793D1] text-white text-xs font-semibold rounded-lg hover:bg-[#127EB5] active:bg-[#0F6B9B] shadow-sm self-start sm:self-auto transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Publish Announcement
        </button>
      </div>

      {/* Modal for Publish / Edit */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2038]/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-[#E2EDF4]"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F5F9]">
              <h3 className="text-base font-bold text-[#0B2038]">
                {editingAnnouncement ? 'Edit Announcement' : 'Publish Announcement'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-[#63788E] hover:text-[#0B2038] rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Announcement Title */}
              <div>
                <label className="block font-semibold text-[#4B6178] mb-1">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Keynote Session Room Update"
                  className="w-full p-2.5 bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1] font-semibold"
                />
              </div>

              {/* Announcement Text */}
              <div>
                <label className="block font-semibold text-[#4B6178] mb-1">
                  Announcement Text *
                </label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write announcement text here..."
                  className="w-full p-2.5 bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1] leading-relaxed"
                />
              </div>

              {/* Automatically record publication date/time */}
              <p className="text-[11px] text-[#63788E]">
                * Publication timestamp will be automatically recorded upon publishing.
              </p>

              <div className="pt-3 border-t border-[#F0F5F9] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-[#4B6178] hover:text-[#0B2038] font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="admin-submit-announcement-btn"
                  type="submit"
                  className="px-5 py-2 bg-[#1793D1] hover:bg-[#127EB5] active:bg-[#0F6B9B] text-white font-semibold rounded-lg shadow-sm transition-colors"
                >
                  {editingAnnouncement ? 'Save Changes' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List of Announcements */}
      {sorted.length === 0 ? (
        <div className="bg-white border border-[#E2EDF4] rounded-xl p-8 text-center text-[#4B6178]">
          <p className="text-sm">No announcements published yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#E2EDF4] rounded-xl p-5 shadow-xs space-y-2"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#63788E] font-semibold mb-1">
                    <Calendar className="w-3.5 h-3.5 text-[#1793D1]" />
                    <span>{new Date(item.publishedAt).toLocaleString()}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#0B2038]">{item.title}</h3>
                </div>

                {/* Actions: Edit, Delete */}
                <div className="flex items-center gap-1">
                  <button
                    id={`admin-edit-ann-${item.id}`}
                    onClick={() => openEditForm(item)}
                    className="p-1.5 text-[#1793D1] hover:bg-[#EBF6FB] rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    id={`admin-delete-ann-${item.id}`}
                    onClick={() => {
                      if (window.confirm('Delete this announcement?')) {
                        onDeleteAnnouncement(item.id);
                      }
                    }}
                    className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#4B6178] whitespace-pre-line leading-relaxed">
                {item.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
