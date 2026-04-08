import React, { useState } from 'react';
import { 
  Plus, 
  FileText, 
  User, 
  BookOpen, 
  Wallet, 
  Send,
  History,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useWallet } from '../App';

export const AdminPortal = () => {
  const { account, connectWallet, isConnecting } = useWallet();
  const [isMinting, setIsMinting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    courseName: '',
    studentAddress: '',
    issueDate: new Date().toISOString().split('T')[0]
  });

  if (!account) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Authentication Required</h2>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          Please connect your institutional wallet to access the certificate issuance dashboard.
        </p>
        <button 
          onClick={connectWallet}
          disabled={isConnecting}
          className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center mx-auto shadow-lg"
        >
          {isConnecting ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Wallet className="w-5 h-5 mr-2" />
          )}
          Connect Admin Wallet
        </button>
      </div>
    );
  }

  const formatAddress = (addr: string) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMinting(true);
    
    // Simulated blockchain minting process
    setTimeout(() => {
      setIsMinting(false);
      setShowSuccess(true);
      setFormData({
        studentName: '',
        courseName: '',
        studentAddress: '',
        issueDate: new Date().toISOString().split('T')[0]
      });
      setTimeout(() => setShowSuccess(false), 5000);
    }, 3000);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Institution Dashboard</h2>
          <p className="text-slate-500">Global Tech University • Authorized Issuer</p>
        </div>
        <div className="flex items-center space-x-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Wallet className="w-5 h-5 text-blue-600" />
          </div>
          <div className="pr-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Connected Wallet</p>
            <p className="text-sm font-mono font-bold text-slate-700">{formatAddress(account)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Minting Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-blue-100">
                  <Plus className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Issue New Certificate</h3>
              </div>
            </div>

            <form onSubmit={handleMint} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center">
                    <User className="w-4 h-4 mr-2 text-slate-400" />
                    Student Full Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-slate-400" />
                    Course / Degree
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.courseName}
                    onChange={(e) => setFormData({...formData, courseName: e.target.value})}
                    placeholder="e.g. B.Sc Computer Science"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center">
                  <Wallet className="w-4 h-4 mr-2 text-slate-400" />
                  Student Wallet Address (Ethereum)
                </label>
                <input
                  required
                  type="text"
                  value={formData.studentAddress}
                  onChange={(e) => setFormData({...formData, studentAddress: e.target.value})}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-bold text-slate-700">Issue Date</label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                </div>
                <div className="flex-1 flex items-end">
                  <button
                    type="submit"
                    disabled={isMinting}
                    className="w-full h-[52px] bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center disabled:opacity-70"
                  >
                    {isMinting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Minting NFT Certificate...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Mint & Issue Certificate
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {showSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-8 mb-8 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center text-green-700"
              >
                <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="font-medium">Certificate successfully minted and issued to student wallet!</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Stats & Recent */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Network Stats</h4>
            <div className="space-y-6">
              <div>
                <p className="text-3xl font-bold">1,284</p>
                <p className="text-slate-400 text-sm">Total Certificates Issued</p>
              </div>
              <div className="h-px bg-slate-800" />
              <div>
                <p className="text-3xl font-bold">0.042 ETH</p>
                <p className="text-slate-400 text-sm">Total Gas Consumed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-bold text-slate-900 flex items-center">
                <History className="w-4 h-4 mr-2 text-slate-400" />
                Recent Issuance
              </h4>
              <button className="text-blue-600 text-xs font-bold hover:underline">View All</button>
            </div>
            <div className="divide-y divide-slate-50">
              {[
                { name: 'Alice Smith', course: 'B.Sc CS', date: '2 mins ago' },
                { name: 'Bob Johnson', course: 'M.A History', date: '1 hour ago' },
                { name: 'Charlie Brown', course: 'B.Tech IT', date: '3 hours ago' }
              ].map((item, i) => (
                <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.course}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{item.date}</p>
                    <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 transition-colors ml-auto mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
