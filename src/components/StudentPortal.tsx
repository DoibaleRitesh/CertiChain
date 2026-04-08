import { useState, useEffect } from 'react';
import { 
  Award, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Share2, 
  Copy,
  CheckCircle2,
  Wallet,
  Loader2,
  ShieldAlert
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useWallet } from '../App';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export const StudentPortal = () => {
  const { account, connectWallet, isConnecting } = useWallet();
  const [copied, setCopied] = useState<string | null>(null);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!account) return;

    setIsLoading(true);
    const q = query(
      collection(db, 'certificates'), 
      where('recipientAddress', '==', account.toLowerCase())
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const certs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        image: `https://picsum.photos/seed/${doc.id}/400/300`
      }));
      setCertificates(certs);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching student certificates:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [account]);

  if (!account) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Wallet Not Connected</h2>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          Connect your MetaMask wallet to view and manage your academic certificate NFTs.
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
          Connect Student Wallet
        </button>
      </div>
    );
  }

  const formatAddress = (addr: string) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading your credentials...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">My Credentials</h2>
          <p className="text-slate-500">Manage and share your blockchain-verified certificates.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Connected Wallet</p>
            <p className="text-sm font-mono font-bold text-slate-700">{formatAddress(account)}</p>
          </div>
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Award className="text-white w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {certificates.map((cert, i) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl transition-all group"
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={cert.image} 
                alt={cert.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-blue-600 border border-blue-100 flex items-center">
                <ShieldCheck className="w-3 h-3 mr-1" />
                NFT VERIFIED
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{cert.institutionName}</p>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">{cert.courseName}</h3>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-500 mb-6">
                <span className="flex items-center">
                  Issued: {cert.issueDate}
                </span>
                <span className="font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                  #{cert.tokenId}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all">
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </button>
                <button 
                  onClick={() => handleCopy(cert.id)}
                  className="flex items-center justify-center px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
                >
                  {copied === cert.id ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      ID
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                <a href="#" className="text-xs font-bold text-blue-600 flex items-center hover:underline">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View on Etherscan
                </a>
                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Empty State / Add More */}
        <div className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
            <Award className="text-slate-300 w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-400">Missing a Certificate?</h3>
          <p className="text-slate-400 text-sm mt-2 max-w-[200px]">
            Contact your institution to have your credentials minted as NFTs.
          </p>
        </div>
      </div>
    </div>
  );
};
