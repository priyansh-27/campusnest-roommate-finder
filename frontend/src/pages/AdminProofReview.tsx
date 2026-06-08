import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { proofsAPI } from '../services/api';
import { PropertyProof } from '../types';
import {
  FileCheck, X, Loader2, Eye, CheckCircle, XCircle,
  Zap, Droplets, Flame, Receipt, FileSignature, IdCard, Building2, FileText
} from 'lucide-react';

const PROOF_ICONS: Record<string, React.ReactNode> = {
  ELECTRICITY_BILL: <Zap className="w-5 h-5" />,
  PROPERTY_DEED:    <FileSignature className="w-5 h-5" />,
  TAX_RECEIPT:      <Receipt className="w-5 h-5" />,
  RENTAL_AGREEMENT: <FileText className="w-5 h-5" />,
  AADHAAR_CARD:     <IdCard className="w-5 h-5" />,
  WATER_BILL:       <Droplets className="w-5 h-5" />,
  GAS_CONNECTION:   <Flame className="w-5 h-5" />,
  SOCIETY_NOC:      <Building2 className="w-5 h-5" />,
};

const PROOF_LABELS: Record<string, string> = {
  ELECTRICITY_BILL: 'Electricity Bill',
  PROPERTY_DEED:    'Property Deed',
  TAX_RECEIPT:      'Property Tax',
  RENTAL_AGREEMENT: 'Rental Agreement',
  AADHAAR_CARD:     'Aadhaar Card',
  WATER_BILL:       'Water Bill',
  GAS_CONNECTION:   'Gas Connection',
  SOCIETY_NOC:      'Society NOC',
};

export default function AdminProofReview() {
  const { user } = useAuth();
  const [proofs, setProofs] = useState<PropertyProof[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [previewProof, setPreviewProof] = useState<PropertyProof | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => { loadProofs(); }, []);

  const loadProofs = async () => {
    setLoading(true);
    try {
      const data = await proofsAPI.getAll();
      setProofs(data);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleApprove = async (proof: PropertyProof) => {
    setActionLoading(true);
    try {
      const updated = await proofsAPI.approve(proof.id, reviewNotes || 'Document verified successfully', user?.name);
      setProofs(prev => prev.map(p => p.id === proof.id ? updated : p));
      setPreviewProof(null);
      setReviewNotes('');
      showToast(`✓ Approved ${proof.landlordName}'s ${PROOF_LABELS[proof.proofType]}`);
    } catch (e: any) {
      showToast('⚠️ ' + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (proof: PropertyProof) => {
    if (!reviewNotes.trim()) {
      showToast('⚠️ Please provide a rejection reason');
      return;
    }
    setActionLoading(true);
    try {
      const updated = await proofsAPI.reject(proof.id, reviewNotes, user?.name);
      setProofs(prev => prev.map(p => p.id === proof.id ? updated : p));
      setPreviewProof(null);
      setReviewNotes('');
      showToast(`✗ Rejected ${proof.landlordName}'s document`);
    } catch (e: any) {
      showToast('⚠️ ' + e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = filter === 'all' ? proofs : proofs.filter(p => p.status === filter);
  const counts = {
    pending:  proofs.filter(p => p.status === 'pending').length,
    approved: proofs.filter(p => p.status === 'approved').length,
    rejected: proofs.filter(p => p.status === 'rejected').length,
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-violet-600" /></div>;
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl">{toast}</div>
      )}

      {/* Header & filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-slate-900 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-violet-600" />
            Landlord Proof Verification Queue
          </h2>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">{filtered.length} of {proofs.length}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { v: 'pending',  label: '⏳ Pending Review', count: counts.pending,  color: 'bg-amber-100 text-amber-800 border-amber-200' },
            { v: 'approved', label: '✓ Approved',         count: counts.approved, color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
            { v: 'rejected', label: '✗ Rejected',         count: counts.rejected, color: 'bg-rose-100 text-rose-800 border-rose-200' },
            { v: 'all',      label: '◯ All',               count: proofs.length,   color: 'bg-slate-100 text-slate-700 border-slate-200' },
          ].map(t => (
            <button
              key={t.v}
              onClick={() => setFilter(t.v as any)}
              className={`px-3 py-1.5 rounded-xl border-2 text-xs font-bold transition ${
                filter === t.v ? t.color : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>
      </div>

      {/* Proofs grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <FileCheck className="w-16 h-16 text-slate-200 mx-auto mb-3" />
          <div className="font-bold text-slate-700">No {filter !== 'all' ? filter : ''} proofs</div>
          <p className="text-sm text-slate-400 mt-1">Landlord submissions will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(proof => (
            <div key={proof.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition">
              {/* Image preview */}
              {proof.documentData?.startsWith('data:image') && (
                <div className="relative h-32 bg-slate-100 cursor-pointer" onClick={() => setPreviewProof(proof)}>
                  <img src={proof.documentData} alt="" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      proof.status === 'approved' ? 'bg-emerald-500 text-white' :
                      proof.status === 'rejected' ? 'bg-rose-500 text-white' :
                      'bg-amber-400 text-slate-900'
                    }`}>
                      {proof.status === 'approved' ? '✓ APPROVED' :
                       proof.status === 'rejected' ? '✗ REJECTED' : '⏳ PENDING'}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 shrink-0">
                    {PROOF_ICONS[proof.proofType]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 text-sm">{PROOF_LABELS[proof.proofType]}</div>
                    <div className="text-xs text-slate-500 truncate">From {proof.landlordName}</div>
                  </div>
                </div>

                {proof.propertyTitle && (
                  <div className="text-xs text-slate-600 mb-2 truncate">📍 {proof.propertyTitle}</div>
                )}

                {proof.documentNumber && (
                  <div className="text-xs font-mono text-slate-500 mb-2">#{proof.documentNumber}</div>
                )}

                {proof.status !== 'pending' && proof.reviewNotes && (
                  <div className={`text-[11px] p-2 rounded-lg mb-2 ${
                    proof.status === 'approved' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                  }`}>
                    <strong>Note:</strong> {proof.reviewNotes}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400">
                    {proof.uploadedAt ? new Date(proof.uploadedAt).toLocaleDateString() : ''}
                  </span>
                  <button
                    onClick={() => { setPreviewProof(proof); setReviewNotes(''); }}
                    className="text-xs bg-violet-100 hover:bg-violet-200 text-violet-700 font-bold px-3 py-1 rounded-lg transition flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" /> Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {previewProof && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setPreviewProof(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-200 shrink-0">
              <h3 className="font-black text-slate-900 flex items-center gap-2">
                {PROOF_ICONS[previewProof.proofType]}
                Verifying: {PROOF_LABELS[previewProof.proofType]} from {previewProof.landlordName}
              </h3>
              <button onClick={() => setPreviewProof(null)}><X className="w-5 h-5 text-slate-500" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Image */}
              {previewProof.documentData?.startsWith('data:image') ? (
                <img src={previewProof.documentData} alt="" className="w-full max-h-96 object-contain rounded-xl border-2 border-slate-200 bg-slate-50" />
              ) : (
                <div className="p-8 bg-slate-50 rounded-xl text-center text-slate-500 text-sm">PDF document</div>
              )}

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 text-sm bg-slate-50 p-4 rounded-xl">
                <div><span className="text-slate-500 text-xs">Landlord:</span><br /><strong>{previewProof.landlordName}</strong></div>
                <div><span className="text-slate-500 text-xs">Property:</span><br /><strong>{previewProof.propertyTitle || '—'}</strong></div>
                <div><span className="text-slate-500 text-xs">Doc Number:</span><br /><strong className="font-mono">{previewProof.documentNumber || '—'}</strong></div>
                <div><span className="text-slate-500 text-xs">Issue Date:</span><br /><strong>{previewProof.issueDate || '—'}</strong></div>
                <div className="col-span-2"><span className="text-slate-500 text-xs">Issuing Authority:</span><br /><strong>{previewProof.issuingAuthority || '—'}</strong></div>
                {previewProof.notes && (
                  <div className="col-span-2"><span className="text-slate-500 text-xs">Landlord Notes:</span><br />{previewProof.notes}</div>
                )}
              </div>

              {previewProof.status === 'pending' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Review Notes</label>
                  <textarea
                    rows={3} value={reviewNotes} onChange={e => setReviewNotes(e.target.value)}
                    placeholder="Required for rejection — explain why. Optional for approval."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                  />
                </div>
              ) : (
                <div className={`p-3 rounded-xl ${previewProof.status === 'approved' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                  <div className={`text-sm font-bold ${previewProof.status === 'approved' ? 'text-emerald-900' : 'text-rose-900'}`}>
                    {previewProof.status === 'approved' ? '✓ APPROVED' : '✗ REJECTED'}
                  </div>
                  {previewProof.reviewNotes && <p className={`text-xs mt-1 ${previewProof.status === 'approved' ? 'text-emerald-700' : 'text-rose-700'}`}>{previewProof.reviewNotes}</p>}
                  {previewProof.reviewedBy && <p className="text-[10px] text-slate-500 mt-1">By {previewProof.reviewedBy}</p>}
                </div>
              )}
            </div>

            {/* Actions */}
            {previewProof.status === 'pending' && (
              <div className="p-4 border-t border-slate-200 flex gap-2 shrink-0">
                <button
                  onClick={() => handleReject(previewProof)}
                  disabled={actionLoading}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(previewProof)}
                  disabled={actionLoading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Approve
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
