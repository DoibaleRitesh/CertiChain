import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  Calendar, 
  User, 
  BookOpen, 
  Building,
  ExternalLink,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Certificate } from '../types';

export const VerifyPage = () => {
  const [searchId, setSearchId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<Certificate | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setIsSearching(true);
    setError(null);
    setResult(null);

    // Simulated search delay
    setTimeout(() => {
      // Mock result for demonstration
      if (searchId === 'CERT-123') {
        setResult({
          id: 'CERT-123',
          studentName: 'John Doe',
          courseName: 'Bachelor of Computer Science',
          issueDate: '2025-06-15',
          institutionName: 'Global Tech University',
          ipfsHash: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
          tokenId: '4521',
          recipientAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
        });
      } else {
        setError('Certificate not found. Please check the ID and try again.');
      }
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Verify Certificate</h2>
        <p className="text-slate-600">Enter the Certificate ID or Transaction Hash to verify its authenticity on the blockchain.</p>
      </div>

      <form onSubmit={handleSearch} className="mb-12">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Certificate ID (e.g. CERT-123)"
            className="block w-full pl-12 pr-32 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute inset-y-2 right-2 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center"
          >
            {isSearching ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Verifying...
              </>
            ) : 'Verify'}
          </button>
        </div>
      </form>

      <AnimatePresence mode="wait">
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Querying Ethereum Blockchain...</p>
          </motion.div>
        )}

        {error && !isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-start space-x-4"
          >
            <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div>
              <h3 className="text-red-800 font-bold">Verification Failed</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </motion.div>
        )}

        {result && !isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden"
          >
            <div className="bg-green-500 px-8 py-4 flex items-center justify-between">
              <div className="flex items-center text-white">
                <CheckCircle2 className="w-6 h-6 mr-2" />
                <span className="font-bold">Authenticity Verified</span>
              </div>
              <span className="text-green-100 text-sm font-medium">Token ID: #{result.tokenId}</span>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-slate-400 mt-1" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student Name</p>
                      <p className="text-lg font-bold text-slate-900">{result.studentName}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <BookOpen className="w-5 h-5 text-slate-400 mt-1" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Course / Degree</p>
                      <p className="text-lg font-bold text-slate-900">{result.courseName}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Building className="w-5 h-5 text-slate-400 mt-1" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Issuing Institution</p>
                      <p className="text-lg font-bold text-slate-900">{result.institutionName}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-slate-400 mt-1" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Issue Date</p>
                      <p className="text-lg font-bold text-slate-900">{result.issueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <ShieldCheck className="w-5 h-5 text-slate-400 mt-1" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Blockchain Status</p>
                      <div className="flex items-center text-green-600 font-bold">
                        <CheckCircle2 className="w-4 h-4 mr-1.5" />
                        Confirmed on Mainnet
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <ExternalLink className="w-5 h-5 text-slate-400 mt-1" />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verification Links</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <a href={`https://etherscan.io/token/${result.tokenId}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-600 transition-colors">
                          View on Etherscan
                        </a>
                        <a href={`https://ipfs.io/ipfs/${result.ipfsHash}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-600 transition-colors">
                          View on IPFS
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recipient Wallet Address</p>
                  <code className="text-xs text-slate-600 break-all">{result.recipientAddress}</code>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
