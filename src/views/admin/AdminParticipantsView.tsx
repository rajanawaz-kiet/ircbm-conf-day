import React, { useState, useMemo } from 'react';
import { Participant, ParticipantCategory } from '../../types';
import { Search, CheckCircle2, XCircle, QrCode, Edit2, Eye, X, Check, Upload, Download, FileText } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { store } from '../../services/store';

interface AdminParticipantsViewProps {
  participants: Participant[];
  onCheckIn: (participantId: string) => void;
  onUpdateParticipant: (participant: Participant) => void;
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

export const AdminParticipantsView: React.FC<AdminParticipantsViewProps> = ({
  participants,
  onCheckIn,
  onUpdateParticipant,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingParticipant, setViewingParticipant] = useState<Participant | null>(null);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [showQrModal, setShowQrModal] = useState<Participant | null>(null);

  // Bulk CSV Upload State
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editInstitution, setEditInstitution] = useState('');
  const [editDesignation, setEditDesignation] = useState('');
  const [editCategory, setEditCategory] = useState<ParticipantCategory>('Faculty / Academic');
  const [editMobile, setEditMobile] = useState('');

  const openEditModal = (p: Participant) => {
    setEditingParticipant(p);
    setEditTitle(p.title || '');
    setEditFirstName(p.firstName);
    setEditLastName(p.lastName);
    setEditEmail(p.email);
    setEditInstitution(p.institution);
    setEditDesignation(p.designation);
    setEditCategory(p.participantCategory);
    setEditMobile(p.mobile || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParticipant) return;

    onUpdateParticipant({
      ...editingParticipant,
      title: editTitle.trim(),
      firstName: editFirstName.trim(),
      lastName: editLastName.trim(),
      email: editEmail.trim(),
      institution: editInstitution.trim(),
      designation: editDesignation.trim(),
      participantCategory: editCategory,
      mobile: editMobile.trim(),
    });

    setEditingParticipant(null);
  };

  const downloadTemplate = () => {
    const headers = "Participant ID,Name,Email,Institution,Participant Category,Check-in Status\n";
    const row1 = "IRCBM-ADMIN-01,Prof. Conference Admin,admin@ircbm2026.kiet.edu.pk,Faculty of Management Sciences (FoMS), KIET,Faculty / Academic,Checked In\n";
    const row2 = "IRCBM-2026-1001,Dr. Tariq Rahman,tariq.rahman@kiet.edu.pk,Faculty of Management Sciences (FoMS), KIET,Presenter,Pending\n";
    const blob = new Blob([headers + row1 + row2], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "ircbm_participants_template.csv");
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
        
        // Find indices of columns specified in the image
        const idIdx = headers.indexOf("participant id");
        const nameIdx = headers.indexOf("name");
        const emailIdx = headers.indexOf("email");
        const institutionIdx = headers.indexOf("institution");
        const categoryIdx = headers.indexOf("participant category");
        const checkInIdx = headers.indexOf("check-in status");

        if (nameIdx === -1 || emailIdx === -1) {
          setImportStatus({
            success: false,
            message: "Missing required columns in CSV! Ensure 'Name' and 'Email' are present as headers."
          });
          return;
        }

        const parsedItems: any[] = [];
        let skippedRowsCount = 0;

        // Parse Name field helper
        const parseNameField = (fullName: string) => {
          const trimmed = fullName.trim();
          const parts = trimmed.split(/\s+/);
          if (parts.length === 0) {
            return { title: "", firstName: "", lastName: "" };
          }
          
          const titles = ["Dr.", "Prof.", "Mr.", "Ms.", "Mrs.", "Engr.", "Dr", "Prof", "Mr", "Ms", "Mrs"];
          let title = "";
          let startIndex = 0;
          
          const firstPart = parts[0];
          const normalizedFirst = firstPart.endsWith('.') ? firstPart : firstPart + '.';
          const matchedTitle = titles.find(t => t.toLowerCase() === firstPart.toLowerCase() || t.toLowerCase() === normalizedFirst.toLowerCase());
          
          if (matchedTitle) {
            title = firstPart;
            startIndex = 1;
          }
          
          const remainingParts = parts.slice(startIndex);
          if (remainingParts.length === 0) {
            return { title, firstName: "Participant", lastName: "" };
          } else if (remainingParts.length === 1) {
            return { title, firstName: remainingParts[0], lastName: "" };
          } else {
            return {
              title,
              firstName: remainingParts.slice(0, remainingParts.length - 1).join(" "),
              lastName: remainingParts[remainingParts.length - 1]
            };
          }
        };

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (row.length === 0 || (row.length === 1 && !row[0])) continue; // empty line

          const email = row[emailIdx]?.trim();
          const fullName = row[nameIdx]?.trim();

          if (!email || !fullName) {
            skippedRowsCount++;
            continue;
          }

          const { title, firstName, lastName } = parseNameField(fullName);
          const participantId = idIdx !== -1 ? row[idIdx]?.trim() : undefined;
          
          let checkedIn = false;
          let checkedInAt: string | null = null;
          if (checkInIdx !== -1) {
            const status = row[checkInIdx]?.trim().toLowerCase();
            if (status === "checked in" || status === "checked" || status === "yes" || status === "true" || status === "1") {
              checkedIn = true;
              checkedInAt = new Date().toISOString();
            }
          }

          parsedItems.push({
            title,
            firstName,
            lastName,
            email,
            mobile: '',
            institution: institutionIdx !== -1 ? row[institutionIdx] : '',
            designation: '',
            city: '',
            country: '',
            participantCategory: categoryIdx !== -1 ? row[categoryIdx] : 'Other',
            submissionReferenceId: '',
            passwordHash: 'welcome2026',
            participantId: participantId || undefined,
            checkedIn,
            checkedInAt,
          });
        }

        if (parsedItems.length === 0) {
          setImportStatus({
            success: false,
            message: `No valid participants were parsed. Skipped ${skippedRowsCount} incomplete rows.`
          });
          return;
        }

        // Call store import action
        store.importParticipants(parsedItems);
        
        setImportStatus({
          success: true,
          message: `Successfully imported ${parsedItems.length} participants! ${skippedRowsCount > 0 ? `(Skipped ${skippedRowsCount} incomplete records)` : ''}`
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

  const filteredParticipants = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return participants;
    return participants.filter(
      (p) =>
        p.participantId.toLowerCase().includes(q) ||
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.institution.toLowerCase().includes(q) ||
        p.participantCategory.toLowerCase().includes(q)
    );
  }, [participants, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B2038]">Participants</h2>
          <p className="text-xs text-[#4B6178] mt-0.5">
            Registered conference participants, badges, and check-in status
          </p>
        </div>
      </div>

      {/* CSV Bulk Import Panel */}
      <div className="bg-white border border-[#E2EDF4] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#F0F5F9]">
          <div>
            <h3 className="text-sm font-bold text-[#0B2038] flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-[#1793D1]" />
              Bulk Import Participants via CSV
            </h3>
            <p className="text-xs text-[#63788E] mt-0.5">
              Rapidly register dozens of participants at once by uploading a standard spreadsheet.
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
              Required columns: <strong className="text-[#0B2038]">Name</strong>, <strong className="text-[#0B2038]">Email</strong>. (Supports Participant ID, Institution, Participant Category, Check-in Status)
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

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#63788E]" />
        <input
          id="admin-participants-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by ID, name, email, institution..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#E2EDF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1793D1] text-[#0B2038]"
        />
      </div>

      {/* Table: Participant ID, Name, Email, Institution, Participant Category, Check-In Status */}
      <div className="bg-white border border-[#E2EDF4] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2EDF4] text-[#0B2038] font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Participant ID</th>
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Institution</th>
                <th className="p-3.5">Participant Category</th>
                <th className="p-3.5">Check-In Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F5F9] text-[#4B6178]">
              {filteredParticipants.map((p) => (
                <tr key={p.participantId} className="hover:bg-[#F8FAFC]/70 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-[#0B2038] whitespace-nowrap">
                    {p.participantId}
                  </td>
                  <td className="p-3.5 font-semibold text-[#0B2038] whitespace-nowrap">
                    {p.title ? `${p.title} ` : ''}{p.firstName} {p.lastName}
                  </td>
                  <td className="p-3.5 text-[#4B6178] whitespace-nowrap">
                    {p.email}
                  </td>
                  <td className="p-3.5 text-[#4B6178] max-w-xs truncate">
                    {p.institution}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EBF6FB] text-[#1793D1] border border-[#BAE3F7]">
                      {p.participantCategory}
                    </span>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    {p.checkedIn ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Checked In
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[#63788E] bg-[#F8FAFC] px-2 py-0.5 rounded text-[11px] border border-[#E2EDF4]">
                        <XCircle className="w-3 h-3 text-[#63788E]" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Check In Action if pending */}
                      {!p.checkedIn && (
                        <button
                          id={`admin-checkin-btn-${p.participantId}`}
                          onClick={() => onCheckIn(p.participantId)}
                          className="px-2.5 py-1 bg-[#1793D1] hover:bg-[#127EB5] active:bg-[#0F6B9B] text-white rounded-lg text-[11px] font-semibold transition-colors"
                        >
                          Check In
                        </button>
                      )}

                      {/* View Action */}
                      <button
                        id={`admin-view-participant-${p.participantId}`}
                        onClick={() => setViewingParticipant(p)}
                        className="p-1.5 text-[#1793D1] hover:bg-[#EBF6FB] rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit Action */}
                      <button
                        id={`admin-edit-participant-${p.participantId}`}
                        onClick={() => openEditModal(p)}
                        className="p-1.5 text-[#1793D1] hover:bg-[#EBF6FB] rounded-lg transition-colors"
                        title="Edit Participant"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* View QR Code */}
                      <button
                        id={`admin-qr-participant-${p.participantId}`}
                        onClick={() => setShowQrModal(p)}
                        className="p-1.5 text-[#1793D1] hover:bg-[#EBF6FB] rounded-lg transition-colors"
                        title="View QR Code"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW PARTICIPANT MODAL */}
      {viewingParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2038]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#E2EDF4]">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F5F9]">
              <h3 className="text-base font-bold text-[#0B2038]">Participant Details</h3>
              <button
                onClick={() => setViewingParticipant(null)}
                className="p-1 text-[#63788E] hover:text-[#0B2038] rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-[#F0F5F9]">
                <span className="text-[#63788E] font-semibold">Participant ID:</span>
                <span className="font-mono font-bold text-[#0B2038]">{viewingParticipant.participantId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F0F5F9]">
                <span className="text-[#63788E] font-semibold">Full Name:</span>
                <span className="font-bold text-[#0B2038]">
                  {viewingParticipant.title ? `${viewingParticipant.title} ` : ''}{viewingParticipant.firstName} {viewingParticipant.lastName}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F0F5F9]">
                <span className="text-[#63788E] font-semibold">Email:</span>
                <span className="text-[#0B2038] font-medium">{viewingParticipant.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F0F5F9]">
                <span className="text-[#63788E] font-semibold">Mobile:</span>
                <span className="text-[#0B2038] font-medium">{viewingParticipant.mobile || '—'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F0F5F9]">
                <span className="text-[#63788E] font-semibold">Institution:</span>
                <span className="text-[#0B2038] font-medium">{viewingParticipant.institution}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F0F5F9]">
                <span className="text-[#63788E] font-semibold">Designation:</span>
                <span className="text-[#0B2038] font-medium">{viewingParticipant.designation}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F0F5F9]">
                <span className="text-[#63788E] font-semibold">Category:</span>
                <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EBF6FB] text-[#1793D1] border border-[#BAE3F7]">
                  {viewingParticipant.participantCategory}
                </span>
              </div>
              {viewingParticipant.submissionReferenceId && (
                <div className="flex justify-between py-1 border-b border-[#F0F5F9]">
                  <span className="text-[#63788E] font-semibold">Submission Ref ID:</span>
                  <span className="font-mono font-bold text-[#0B2038]">{viewingParticipant.submissionReferenceId}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-[#F0F5F9]">
                <span className="text-[#63788E] font-semibold">Check-In Status:</span>
                <span>
                  {viewingParticipant.checkedIn ? (
                    <span className="text-emerald-700 font-semibold">
                      Checked In ({new Date(viewingParticipant.checkedInAt || '').toLocaleTimeString()})
                    </span>
                  ) : (
                    <span className="text-[#4B6178] font-semibold">Pending</span>
                  )}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingParticipant(null)}
                className="px-4 py-2 bg-[#EBF6FB] text-[#1793D1] hover:bg-[#DDF0FA] text-xs font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PARTICIPANT MODAL */}
      {editingParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2038]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-[#E2EDF4]">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0F5F9]">
              <h3 className="text-base font-bold text-[#0B2038]">
                Edit Participant ({editingParticipant.participantId})
              </h3>
              <button
                onClick={() => setEditingParticipant(null)}
                className="p-1 text-[#63788E] hover:text-[#0B2038] rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div className="grid grid-cols-5 gap-2">
                <div className="col-span-1">
                  <label className="block font-semibold text-[#4B6178] mb-1">Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-2 bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-semibold text-[#4B6178] mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    className="w-full p-2 bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-semibold text-[#4B6178] mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    className="w-full p-2 bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#4B6178] mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full p-2 bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-[#4B6178] mb-1">Institution</label>
                  <input
                    type="text"
                    value={editInstitution}
                    onChange={(e) => setEditInstitution(e.target.value)}
                    className="w-full p-2 bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#4B6178] mb-1">Designation</label>
                  <input
                    type="text"
                    value={editDesignation}
                    onChange={(e) => setEditDesignation(e.target.value)}
                    className="w-full p-2 bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-[#4B6178] mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as ParticipantCategory)}
                    className="w-full p-2 bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
                  >
                    <option value="Presenter">Presenter</option>
                    <option value="Faculty / Academic">Faculty / Academic</option>
                    <option value="Student">Student</option>
                    <option value="Industry Participant">Industry Participant</option>
                    <option value="Guest">Guest</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#4B6178] mb-1">Mobile</label>
                  <input
                    type="text"
                    value={editMobile}
                    onChange={(e) => setEditMobile(e.target.value)}
                    className="w-full p-2 bg-[#F8FAFC] border border-[#DCE8F1] rounded-lg text-[#0B2038] focus:outline-none focus:ring-2 focus:ring-[#1793D1]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0F5F9] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingParticipant(null)}
                  className="px-4 py-2 text-[#4B6178] hover:text-[#0B2038] font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1793D1] hover:bg-[#127EB5] active:bg-[#0F6B9B] text-white font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW QR CODE MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2038]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xs w-full p-6 text-center space-y-4 shadow-xl border border-[#E2EDF4]">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0F5F9]">
              <span className="text-xs font-bold text-[#0B2038]">Participant QR Code</span>
              <button
                onClick={() => setShowQrModal(null)}
                className="p-1 text-[#63788E] hover:text-[#0B2038] rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="font-bold text-[#0B2038] text-sm">
              {showQrModal.firstName} {showQrModal.lastName}
            </div>
            <div className="font-mono text-xs text-[#63788E]">
              {showQrModal.participantId}
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2EDF4] flex justify-center">
              <QRCodeSVG
                value={showQrModal.qrToken || showQrModal.participantId}
                size={180}
                level="H"
                includeMargin={true}
              />
            </div>

            <button
              onClick={() => setShowQrModal(null)}
              className="w-full py-2 bg-[#1793D1] hover:bg-[#127EB5] active:bg-[#0F6B9B] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
