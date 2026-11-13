import React, { useState, useMemo } from 'react';
import { ProgrammeItem } from '../../types';
import { Search, Plus, Edit2, Trash2, X, Upload, Download, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { store } from '../../services/store';

interface AdminProgrammeViewProps {
  programmeItems: ProgrammeItem[];
  onAddItem: (item: Omit<ProgrammeItem, 'id'>) => void;
  onUpdateItem: (item: ProgrammeItem) => void;
  onDeleteItem: (id: string) => void;
}

// Robust local CSV parser helper
function parseCSV(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let currentValue = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentValue += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentValue);
      currentValue = "";
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(currentValue);
      result.push(row);
      row = [];
      currentValue = "";
    } else {
      currentValue += char;
    }
  }
  if (currentValue || row.length > 0) {
    row.push(currentValue);
    result.push(row);
  }
  return result;
}

export const AdminProgrammeView: React.FC<AdminProgrammeViewProps> = ({
  programmeItems,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProgrammeItem | null>(null);

  // CSV Import State
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Form State
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [title, setTitle] = useState('');
  const [presenterName, setPresenterName] = useState('');
  const [coAuthors, setCoAuthors] = useState('');
  const [institution, setInstitution] = useState('');
  const [track, setTrack] = useState('');
  const [room, setRoom] = useState('');
  const [abstractDescription, setAbstractDescription] = useState('');

  const openAddForm = () => {
    setEditingItem(null);
    setDate('');
    setStartTime('');
    setEndTime('');
    setTitle('');
    setPresenterName('');
    setCoAuthors('');
    setInstitution('');
    setTrack('');
    setRoom('');
    setAbstractDescription('');
    setIsFormOpen(true);
  };

  const openEditForm = (item: ProgrammeItem) => {
    setEditingItem(item);
    setDate(item.date);
    setStartTime(item.startTime);
    setEndTime(item.endTime);
    setTitle(item.title);
    setPresenterName(item.presenterName);
    setCoAuthors(item.coAuthors || '');
    setInstitution(item.institution);
    setTrack(item.track);
    setRoom(item.room);
    setAbstractDescription(item.abstractDescription || '');
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !presenterName.trim()) return;

    if (editingItem) {
      onUpdateItem({
        id: editingItem.id,
        date: date.trim(),
        startTime: startTime.trim(),
        endTime: endTime.trim(),
        title: title.trim(),
        presenterName: presenterName.trim(),
        coAuthors: coAuthors.trim(),
        institution: institution.trim(),
        track: track.trim(),
        room: room.trim(),
        abstractDescription: abstractDescription.trim(),
      });
    } else {
      onAddItem({
        date: date.trim(),
        startTime: startTime.trim(),
        endTime: endTime.trim(),
        title: title.trim(),
        presenterName: presenterName.trim(),
        coAuthors: coAuthors.trim(),
        institution: institution.trim(),
        track: track.trim(),
        room: room.trim(),
        abstractDescription: abstractDescription.trim(),
      });
    }

    setIsFormOpen(false);
    setEditingItem(null);
  };

  const downloadTemplate = () => {
    const headers = "Date,Start Time,End Time,Title,Presenter Name,Co-Authors,Institution,Track,Room,Abstract Description\n";
    const row1 = "Oct 24 2026,09:30 AM,11:00 AM,Introduction to Emerging AI Trends,Dr. Tariq Rahman,Prof. A. Siddiqui,Faculty of Management Sciences (FoMS) KIET,Operations & Tech,Seminar Hall 1,An analysis of digital transformation and AI capabilities in emerging South Asian economies.\n";
    const row2 = "Oct 24 2026,11:30 AM,01:00 PM,Global Supply Chains Resilience,Ms. Nadia Farooq,,KIET Graduate School of Business,Operations & Tech,Conference Room 2,Machine learning applications for inventory forecasting and disruption resilience in volatile commercial markets.\n";
    
    const blob = new Blob([headers + row1 + row2], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "ircbm_programme_template.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) {
          setImportStatus({ success: false, message: "Could not read empty or corrupted file." });
          return;
        }

        const rows = parseCSV(text);
        if (rows.length <= 1) {
          setImportStatus({ success: false, message: "No data rows found in the CSV file (only headers or empty)." });
          return;
        }

        // Map headers
        const headers = rows[0].map(h => h.trim().toLowerCase());
        
        // Find indices of important columns
        const dateIdx = headers.indexOf("date");
        const startIdx = headers.indexOf("start time");
        const endIdx = headers.indexOf("end time");
        const titleIdx = headers.indexOf("title");
        const presenterIdx = headers.indexOf("presenter name");
        const authorsIdx = headers.indexOf("co-authors");
        const instIdx = headers.indexOf("institution");
        const trackIdx = headers.indexOf("track");
        const roomIdx = headers.indexOf("room");
        const abstractIdx = headers.indexOf("abstract description");

        if (titleIdx === -1 || startIdx === -1 || endIdx === -1) {
          setImportStatus({
            success: false,
            message: "Missing required columns in CSV! Ensure 'Title', 'Start Time', and 'End Time' are present."
          });
          return;
        }

        const parsedItems: any[] = [];
        let skippedRowsCount = 0;

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (row.length === 0 || (row.length === 1 && !row[0])) continue; // empty line

          const titleVal = row[titleIdx]?.trim();
          const startVal = row[startIdx]?.trim();
          const endVal = row[endIdx]?.trim();

          if (!titleVal || !startVal || !endVal) {
            skippedRowsCount++;
            continue;
          }

          parsedItems.push({
            date: dateIdx !== -1 ? row[dateIdx] : 'Oct 24, 2026',
            startTime: startVal,
            endTime: endVal,
            title: titleVal,
            presenterName: presenterIdx !== -1 ? row[presenterIdx] : '',
            coAuthors: authorsIdx !== -1 ? row[authorsIdx] : '',
            institution: instIdx !== -1 ? row[instIdx] : '',
            track: trackIdx !== -1 ? row[trackIdx] : 'General Track',
            room: roomIdx !== -1 ? row[roomIdx] : 'Seminar Hall 1',
            abstractDescription: abstractIdx !== -1 ? row[abstractIdx] : '',
          });
        }

        if (parsedItems.length === 0) {
          setImportStatus({
            success: false,
            message: `No valid programme sessions were parsed. Skipped ${skippedRowsCount} incomplete rows.`
          });
          return;
        }

        // Call store import action
        store.importProgrammeItems(parsedItems);
        
        setImportStatus({
          success: true,
          message: `Successfully imported ${parsedItems.length} programme sessions! ${skippedRowsCount > 0 ? `(Skipped ${skippedRowsCount} incomplete records)` : ''}`
        });

        // Auto-clear message after 5 seconds
        setTimeout(() => setImportStatus(null), 5000);
      } catch (err) {
        setImportStatus({ success: false, message: "Failed to parse CSV file structure. Please use the download template." });
      }
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return programmeItems;
    return programmeItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.presenterName.toLowerCase().includes(q) ||
        item.institution.toLowerCase().includes(q) ||
        item.track.toLowerCase().includes(q) ||
        item.room.toLowerCase().includes(q)
    );
  }, [programmeItems, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B2038]">
            Programme Management
          </h2>
          <p className="text-xs text-[#4B6178] mt-0.5">
            Create, update, and manage official conference sessions and papers
          </p>
        </div>

        <button
          id="admin-add-programme-btn"
          onClick={openAddForm}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1793D1] text-white text-xs font-semibold rounded-lg hover:bg-[#127EB5] active:bg-[#0F6B9B] shadow-sm self-start sm:self-auto transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Programme Item
        </button>
      </div>

      {/* CSV Bulk Import Panel */}
      <div className="bg-white border border-[#E2EDF4] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#F0F5F9]">
          <div>
            <h3 className="text-sm font-bold text-[#0B2038] flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-[#1793D1]" />
              Bulk Import Programme Sessions via CSV
            </h3>
            <p className="text-xs text-[#63788E] mt-0.5">
              Rapidly set up the entire conference schedule by uploading a session grid spreadsheet.
            </p>
          </div>
          <button
            onClick={downloadTemplate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-[#EBF6FB] text-[#1793D1] hover:text-[#127EB5] text-xs font-semibold rounded-lg border border-[#E2EDF4] hover:border-[#BAE3F7] transition-all whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            Download Sample CSV Template
          </button>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
            dragActive
              ? "border-[#1793D1] bg-[#EBF6FB]/30"
              : "border-[#E2EDF4] hover:border-[#1793D1]/50 bg-slate-50/50"
          }`}
        >
          <div className="max-w-md mx-auto space-y-2.5">
            <div className="mx-auto w-10 h-10 rounded-full bg-[#EBF6FB] flex items-center justify-center text-[#1793D1]">
              <FileText className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <label className="font-bold text-[#1793D1] hover:text-[#127EB5] cursor-pointer focus-within:outline-none">
                <span>Click to upload CSV</span>
                <input
                  type="file"
                  accept=".csv"
                  className="sr-only"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
              </label>
              <span className="text-[#63788E]"> or drag and drop your file here</span>
            </div>
            <p className="text-[10px] text-[#63788E]">
              Required columns: <strong className="text-[#0B2038]">Title</strong>, <strong className="text-[#0B2038]">Start Time</strong>, <strong className="text-[#0B2038]">End Time</strong>. (Supports date, presenter name, co-authors, institution, track, room, description)
            </p>
          </div>
        </div>

        {/* Import Status Alert */}
        {importStatus && (
          <div
            className={`p-3.5 rounded-lg border text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 ${
              importStatus.success
                ? "bg-emerald-50 text-emerald-800 border-emerald-150"
                : "bg-rose-50 text-rose-800 border-rose-150"
            }`}
          >
            {importStatus.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">{importStatus.success ? "Import Succeeded" : "Import Failed"}</p>
              <p className="opacity-90 mt-0.5">{importStatus.message}</p>
            </div>
          </div>
        )}
      </div>

      {/* Basic Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#63788E]" />
        <input
          id="admin-programme-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search programme items..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#E2EDF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1793D1] text-[#0B2038]"
        />
      </div>

      {/* Form Modal / Drawer */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2038]/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-[#E2EDF4] p-6 space-y-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F5F9]">
              <h3 className="text-lg font-bold text-[#0B2038]">
                {editingItem ? 'Edit Programme Item' : 'Add Programme Item'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-[#63788E] hover:text-[#0B2038] rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Date, Start Time, End Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#4B6178] mb-1">
                    Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. Day 1"
                    className="w-full p-2 bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#4B6178] mb-1">
                    Start Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="09:00 AM"
                    className="w-full p-2 bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#4B6178] mb-1">
                    End Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="10:30 AM"
                    className="w-full p-2 bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
                  />
                </div>
              </div>

              {/* Paper / Session Title */}
              <div>
                <label className="block font-semibold text-[#4B6178] mb-1">
                  Paper / Session Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title of paper or keynote session"
                  className="w-full p-2 bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg text-[#0B2038] font-semibold focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
                />
              </div>

              {/* Presenter Name & Co-Authors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#4B6178] mb-1">
                    Presenter Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={presenterName}
                    onChange={(e) => setPresenterName(e.target.value)}
                    placeholder="Primary presenter"
                    className="w-full p-2 bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#4B6178] mb-1">
                    Co-Authors
                  </label>
                  <input
                    type="text"
                    value={coAuthors}
                    onChange={(e) => setCoAuthors(e.target.value)}
                    placeholder="Comma separated"
                    className="w-full p-2 bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
                  />
                </div>
              </div>

              {/* Institution, Track, Room */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#4B6178] mb-1">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="University / Organization"
                    className="w-full p-2 bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#4B6178] mb-1">
                    Track
                  </label>
                  <input
                    type="text"
                    value={track}
                    onChange={(e) => setTrack(e.target.value)}
                    placeholder="e.g. Finance & Accounting"
                    className="w-full p-2 bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#4B6178] mb-1">
                    Room
                  </label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="e.g. Main Auditorium"
                    className="w-full p-2 bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
                  />
                </div>
              </div>

              {/* Abstract / Description */}
              <div>
                <label className="block font-semibold text-[#4B6178] mb-1">
                  Abstract / Description
                </label>
                <textarea
                  rows={4}
                  value={abstractDescription}
                  onChange={(e) => setAbstractDescription(e.target.value)}
                  placeholder="Abstract summary or session overview..."
                  className="w-full p-2 bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg text-[#0B2038] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
                />
              </div>

              {/* Actions: Save / Cancel */}
              <div className="pt-3 border-t border-[#F0F5F9] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-[#4B6178] hover:text-[#0B2038] text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="admin-save-programme-btn"
                  type="submit"
                  className="px-5 py-2 bg-[#1793D1] hover:bg-[#127EB5] active:bg-[#0F6B9B] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Programme Items Table/List */}
      {programmeItems.length === 0 ? (
        <div className="bg-white border border-[#E2EDF4] rounded-xl p-8 text-center text-[#4B6178]">
          <p className="text-sm">No programme items created yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#E2EDF4] rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2EDF4] text-[#0B2038] font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Time / Date</th>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Presenter</th>
                  <th className="p-3.5">Track / Room</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F5F9] text-[#4B6178]">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8FAFC]/70 transition-colors">
                    <td className="p-3.5 font-mono text-[#0B2038] whitespace-nowrap">
                      <div>{item.startTime} - {item.endTime}</div>
                      <div className="text-[11px] text-[#63788E]">{item.date}</div>
                    </td>
                    <td className="p-3.5 font-semibold text-[#0B2038] max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-semibold text-[#0B2038]">{item.presenterName}</div>
                      <div className="text-[11px] text-[#63788E] truncate max-w-[150px]">{item.institution}</div>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EBF6FB] text-[#1793D1] border border-[#BAE3F7]">
                        {item.track}
                      </span>
                      <div className="text-[11px] text-[#63788E] mt-0.5">Room: {item.room}</div>
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          id={`admin-edit-prog-${item.id}`}
                          onClick={() => openEditForm(item)}
                          className="p-1.5 text-[#1793D1] hover:bg-[#EBF6FB] rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`admin-delete-prog-${item.id}`}
                          onClick={() => {
                            if (window.confirm('Delete this programme item?')) {
                              onDeleteItem(item.id);
                            }
                          }}
                          className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
