import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { proofsAPI } from '../services/api';
import { PropertyProof, ProofType } from '../types';
import {
  FileCheck, Upload, FileText, Image as ImageIcon, X, Loader2,
  CheckCircle, Clock, AlertCircle, Eye, Trash2, ShieldCheck,
  Zap, Droplets, Flame, Receipt, FileSignature, IdCard, Building2
} from 'lucide-react';

interface Props {
  setActiveTab?: (t: string) => void;
}

const PROOF_TYPES: { value: ProofType; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: 'ELECTRICITY_BILL', label: 'Electricity Bill', icon: <Zap className="w-5 h-5" />, desc: 'Recent bill (last 3 months) showing your name & property address' },
  { value: 'PROPERTY_DEED',    label: 'Property Deed',    icon: <FileSignature className="w-5 h-5" />, desc: 'Government-issued ownership document' },
  { value: 'TAX_RECEIPT',      label: 'Property Tax',     icon: <Receipt className="w-5 h-5" />, desc: 'Latest property tax payment receipt' },
  { value: 'RENTAL_AGREEMENT', label: 'Rental Agreement', icon: <FileText className="w-5 h-5" />, desc: 'Notarized rental/lease agreement (if you\'re the tenant landlord)' },
  { value: 'AADHAAR_CARD',     label: 'Aadhaar Card',     icon: <IdCard className="w-5 h-5" />, desc: 'Your government ID for landlord verification' },
  { value: 'WATER_BILL',       label: 'Water Bill',       icon: <Droplets className="w-5 h-5" />, desc: 'Recent water utility bill' },
  { value: 'GAS_CONNECTION',   label: 'Gas Connection',   icon: <Flame className="w-5 h-5" />, desc: 'Gas connection certificate' },
  { value: 'SOCIETY_NOC',      label: 'Society NOC',      icon: <Building2 className="w-5 h-5" />, desc: 'No-Objection Certificate from housing society (if applicable)' },
];

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string; icon: React.ReactNode }> = {
  pending:  { bg: 'bg-amber-100',   text: 'text-amber-700',   label: '⏳ Under Review',   icon: <Clock className="w-3 h-3" /> },
  approved: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: '✓ Approved',        icon: <CheckCircle className="w-3 h-3" /> },
  rejected: { bg: 'bg-rose-100',    text: 'text-rose-700',    label: '✗ Rejected',        icon: <X className="w-3 h-3" /> },
};

export default function ProofVerificationPage({ setActiveTab }: Props) {
  const { user } = useAuth();
  const [proofs, setProofs] = useState<PropertyProof[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [previewProof, setPreviewProof] = useState<PropertyProof | null>(null);
  const [toast, setToast] = useState('');

  // Upload form state
  const [proofType, setProofType] = useState<ProofType>('ELECTRICITY_BILL');
  const [propertyTitle, setPropertyTitle] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [authority, setAuthority] = useState('');
  const [notes, setNotes] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [fileData, setFileData] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  useEffect(() => {
    loadProofs();
  }, []);

  const loadProofs = async () => {
    setLoading(true);
    try {
      const data = await proofsAPI.getByLandlord(user?.id || 0);
      setProofs(data);
    } catch (e: any) {
      console.error(e);
      showToast('⚠️ ' + (e.message || 'Could not load proofs'));
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      showToast('⚠️ File too large. Max 5MB allowed.');
      return;
    }
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$|^application\/pdf$/)) {
      showToast('⚠️ Only JPG, PNG, WEBP or PDF allowed.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFileData(e.target?.result as string);
      setFileName(file.name);
      setFileSize(file.size);
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const resetForm = () => {
    setProofType('ELECTRICITY_BILL');
    setPropertyTitle('');
    setDocNumber('');
    setIssueDate('');
    setAuthority('');
    setNotes('');
    setFileName('');
    setFileSize(0);
    setFileData('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileData) {
      showToast('⚠️ Please upload a document image.');
      return;
    }

    setUploading(true);
    try {
      const newProof = await proofsAPI.upload({
        landlordId: user?.id,
        landlordName: user?.name,
        propertyTitle: propertyTitle || undefined,
        proofType,
        documentNumber: docNumber || undefined,
        issueDate: issueDate || undefined,
        issuingAuthority: authority || undefined,
        documentData: fileData,
        fileName,
        fileSize,
        notes: notes || undefined,
      });
      setProofs(prev => [newProof, ...prev]);
      resetForm();
      setShowUpload(false);
      showToast('✓ Proof uploaded successfully! Admin will verify within 24 hours.');
    } catch (e: any) {
      showToast('⚠️ Upload failed: ' + (e.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this proof?')) return;
    try {
      await proofsAPI.delete(id);
      setProofs(prev => prev.filter(p => p.id !== id));
      showToast('Proof deleted.');
    } catch (e: any) {
      showToast('⚠️ ' + e.message);
    }
  };

  const approvedCount = proofs.filter(p => p.status === 'approved').length;
  const pendingCount = proofs.filter(p => p.status === 'pending').length;
  const canList = approvedCount > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-pulse max-w-sm">
          {toast}
        </div>
      )}

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-6 h-6 text-blue-200" />
              <h2 className="text-xl font-black">Property Proof & Verification</h2>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed max-w-2xl">
              Before listing properties, upload at least one verified document (electricity bill, deed, etc.) so we can confirm you're the legitimate property owner. This protects students from fraud and gives you our trusted ✓ Verified badge.
            </p>
          </div>
          <button
            onClick={() => setShowUpload(s => !s)}
            className="shrink-0 bg-white text-indigo-700 font-black px-5 py-2.5 rounded-xl hover:bg-blue-50 transition flex items-center gap-2 shadow-md"
          >
            <Upload className="w-4 h-4" />
            {showUpload ? 'Close' : 'Upload Proof'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-blue-400/40">
          <div>
            <div className="text-2xl font-black text-emerald-300">{approvedCount}</div>
            <div className="text-xs text-blue-200">Approved Proofs</div>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-300">{pendingCount}</div>
            <div className="text-xs text-blue-200">Under Review</div>
          </div>
          <div>
            <div className="text-2xl font-black text-white">{canList ? '✅ Yes' : '❌ No'}</div>
            <div className="text-xs text-blue-200">Can List Properties?</div>
          </div>
        </div>
      </div>

      {/* Eligibility banner */}
      {canList ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-emerald-900">✓ Verification Complete</div>
              <div className="text-sm text-emerald-700">You can now list properties on CampusNest.</div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab?.('add-listing')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition"
          >
            Add Listing →
          </button>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <div className="font-bold text-amber-900">⚠️ Verification Pending</div>
            <div className="text-sm text-amber-700">
              {pendingCount > 0
                ? `You have ${pendingCount} document${pendingCount > 1 ? 's' : ''} under review. Admin verification takes 4–24 hours.`
                : 'Upload at least one government-issued document to start listing properties.'}
            </div>
          </div>
        </div>
      )}

      {/* ── Upload Form ── */}
      {showUpload && (
        <div className="bg-white rounded-2xl border border-indigo-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-black text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-600" /> Upload Proof Document
            </h3>
            <button onClick={() => { setShowUpload(false); resetForm(); }} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step 1: Choose proof type */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Step 1 · Select Document Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PROOF_TYPES.map(pt => (
                <button
                  key={pt.value}
                  type="button"
                  onClick={() => setProofType(pt.value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    proofType === pt.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-indigo-300 bg-white'
                  }`}
                >
                  <div className={`mb-1 ${proofType === pt.value ? 'text-indigo-600' : 'text-slate-500'}`}>
                    {pt.icon}
                  </div>
                  <div className={`text-xs font-bold ${proofType === pt.value ? 'text-indigo-900' : 'text-slate-700'}`}>
                    {pt.label}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-2 italic">
              {PROOF_TYPES.find(pt => pt.value === proofType)?.desc}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 2: Document details */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Step 2 · Document Details</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Property / Address Title</label>
                  <input
                    value={propertyTitle} onChange={e => setPropertyTitle(e.target.value)}
                    placeholder="e.g. Plot 42, Knowledge Park"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Document Number</label>
                  <input
                    value={docNumber} onChange={e => setDocNumber(e.target.value)}
                    placeholder="e.g. ELEC-2026-001-NB42"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Issue Date</label>
                  <input
                    type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Issuing Authority</label>
                  <input
                    value={authority} onChange={e => setAuthority(e.target.value)}
                    placeholder="e.g. Noida Power Company Ltd"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Notes (optional)</label>
                  <textarea
                    rows={2} value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder="Any additional context for the admin reviewing your document..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: File upload */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Step 3 · Upload Document Image</label>
              {!fileData ? (
                <div
                  onDrop={onDrop}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition"
                >
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <div className="text-sm font-bold text-slate-700">Drop your document here, or click to browse</div>
                  <div className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP or PDF · Max 5MB</div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg,application/pdf"
                    onChange={onFileChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="border-2 border-emerald-300 rounded-xl p-4 bg-emerald-50">
                  <div className="flex items-start gap-3">
                    {fileData.startsWith('data:image') ? (
                      <img src={fileData} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-emerald-300" />
                    ) : (
                      <div className="w-20 h-20 bg-white rounded-lg border border-emerald-300 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-rose-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-emerald-900 text-sm truncate">{fileName}</div>
                      <div className="text-xs text-emerald-700">{(fileSize / 1024).toFixed(1)} KB · ✓ Ready to upload</div>
                      <button
                        type="button"
                        onClick={() => { setFileData(''); setFileName(''); setFileSize(0); }}
                        className="mt-2 text-xs text-rose-600 font-bold hover:underline"
                      >
                        Remove file
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Documents are encrypted and stored securely in our verified database.
              </div>
              <button
                type="submit"
                disabled={uploading || !fileData}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-6 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm"
              >
                {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</> : <><Upload className="w-4 h-4" /> Submit for Verification</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── My Proofs List ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-slate-900 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-indigo-500" />
            My Submitted Proofs ({proofs.length})
          </h3>
        </div>

        {proofs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <FileCheck className="w-16 h-16 text-slate-200 mx-auto mb-3" />
            <div className="font-bold text-slate-700">No proofs submitted yet</div>
            <p className="text-sm text-slate-400 mt-1 mb-4">Upload your first document to get verified and start listing properties.</p>
            <button
              onClick={() => setShowUpload(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition inline-flex items-center gap-2"
            >
              <Upload className="w-4 h-4" /> Upload First Proof
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {proofs.map(proof => {
              const ptInfo = PROOF_TYPES.find(p => p.value === proof.proofType);
              const status = STATUS_STYLES[proof.status];
              return (
                <div key={proof.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                          {ptInfo?.icon}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{ptInfo?.label}</div>
                          {proof.documentNumber && (
                            <div className="text-xs text-slate-500 font-mono">#{proof.documentNumber}</div>
                          )}
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${status.bg} ${status.text}`}>
                        {status.icon} {status.label}
                      </span>
                    </div>

                    {proof.propertyTitle && (
                      <div className="text-xs text-slate-600 mb-2">
                        <strong>Property:</strong> {proof.propertyTitle}
                      </div>
                    )}

                    {/* Document preview thumbnail */}
                    {proof.documentData && proof.documentData.startsWith('data:image') && (
                      <img
                        src={proof.documentData}
                        alt="proof"
                        className="w-full h-32 object-cover rounded-lg border border-slate-200 mb-3 cursor-pointer hover:opacity-90"
                        onClick={() => setPreviewProof(proof)}
                      />
                    )}

                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div className="bg-slate-50 rounded-lg p-2">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">File</div>
                        <div className="text-slate-700 font-medium truncate">{proof.fileName}</div>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-2">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Uploaded</div>
                        <div className="text-slate-700 font-medium">
                          {proof.uploadedAt ? new Date(proof.uploadedAt).toLocaleDateString() : '—'}
                        </div>
                      </div>
                    </div>

                    {/* Review notes */}
                    {proof.status !== 'pending' && proof.reviewNotes && (
                      <div className={`p-2.5 rounded-lg text-xs mb-3 ${proof.status === 'approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                        <div className="font-bold mb-0.5">
                          {proof.status === 'approved' ? '✓ Admin Note:' : '✗ Rejection Reason:'}
                        </div>
                        {proof.reviewNotes}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <button
                        onClick={() => setPreviewProof(proof)}
                        className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Details
                      </button>
                      {proof.status === 'pending' && (
                        <button
                          onClick={() => handleDelete(proof.id)}
                          className="text-xs text-rose-600 font-bold hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Preview Modal ── */}
      {previewProof && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setPreviewProof(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="font-black text-slate-900 flex items-center gap-2">
                {PROOF_TYPES.find(p => p.value === previewProof.proofType)?.icon}
                {PROOF_TYPES.find(p => p.value === previewProof.proofType)?.label}
              </h3>
              <button onClick={() => setPreviewProof(null)}><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
              {previewProof.documentData?.startsWith('data:image') ? (
                <img src={previewProof.documentData} alt="" className="w-full rounded-xl border border-slate-200" />
              ) : (
                <div className="p-8 bg-slate-50 rounded-xl text-center text-slate-500 text-sm flex items-center justify-center gap-2">
                  <ImageIcon className="w-6 h-6" /> PDF document (preview unavailable)
                </div>
              )}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {previewProof.documentNumber && (<div><span className="text-slate-500">Doc #:</span> <strong>{previewProof.documentNumber}</strong></div>)}
                {previewProof.issueDate && (<div><span className="text-slate-500">Issued:</span> <strong>{previewProof.issueDate}</strong></div>)}
                {previewProof.issuingAuthority && (<div className="col-span-2"><span className="text-slate-500">Authority:</span> <strong>{previewProof.issuingAuthority}</strong></div>)}
                {previewProof.notes && (<div className="col-span-2"><span className="text-slate-500">Notes:</span> {previewProof.notes}</div>)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
