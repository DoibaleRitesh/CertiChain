import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  GraduationCap, 
  LayoutDashboard, 
  Search, 
  Wallet, 
  Menu, 
  X,
  Award,
  CheckCircle2,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { BrowserProvider } from 'ethers';

// Import components
import { VerifyPage } from './components/VerifyPage';
import { AdminPortal } from './components/AdminPortal';
import { StudentPortal } from './components/StudentPortal';

// Wallet Context
interface WalletContextType {
  account: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnecting: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within a WalletProvider');
  return context;
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { account, connectWallet, disconnectWallet, isConnecting } = useWallet();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Verify', path: '/verify', icon: Search },
    { name: 'Student Portal', path: '/student', icon: GraduationCap },
    { name: 'Admin Portal', path: '/admin', icon: LayoutDashboard },
  ];

  const formatAddress = (addr: string) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-4",
      scrolled ? "bg-white/80 backdrop-blur-md border-b border-slate-200 py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Award className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">CertiChain</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-blue-600 flex items-center",
                location.pathname === link.path ? "text-blue-600" : "text-slate-600"
              )}
            >
              <link.icon className="w-4 h-4 mr-1.5" />
              {link.name}
            </Link>
          ))}
          
          {account ? (
            <div className="flex items-center space-x-3">
              <div className="px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                <span className="text-sm font-mono font-bold text-slate-700">{formatAddress(account)}</span>
              </div>
              <button 
                onClick={disconnectWallet}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                title="Disconnect Wallet"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={connectWallet}
              disabled={isConnecting}
              className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all flex items-center shadow-sm disabled:opacity-70"
            >
              {isConnecting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              ) : (
                <Wallet className="w-4 h-4 mr-2" />
              )}
              Connect Wallet
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-slate-600" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-lg font-medium p-2 rounded-lg",
                    location.pathname === link.path ? "bg-blue-50 text-blue-600" : "text-slate-600"
                  )}
                >
                  <div className="flex items-center">
                    <link.icon className="w-5 h-5 mr-3" />
                    {link.name}
                  </div>
                </Link>
              ))}
              
              {account ? (
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    <span className="text-sm font-mono font-bold text-slate-700">{formatAddress(account)}</span>
                  </div>
                  <button onClick={disconnectWallet} className="text-red-500 text-sm font-bold">Disconnect</button>
                </div>
              ) : (
                <button 
                  onClick={() => { connectWallet(); setIsOpen(false); }}
                  className="w-full px-5 py-3 bg-slate-900 text-white rounded-xl font-semibold flex items-center justify-center"
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  Connect Wallet
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl"
    >
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6 border border-blue-100">
        <ShieldCheck className="w-4 h-4 mr-2" />
        Blockchain Secured Verification
      </div>
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-6">
        The Future of <span className="text-blue-600">Academic Integrity</span>
      </h1>
      <p className="text-xl text-slate-600 mb-10 leading-relaxed">
        Issue, manage, and verify academic certificates as tamper-proof NFTs. 
        Built on Ethereum for permanent, decentralized trust.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/verify" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center">
          <Search className="w-5 h-5 mr-2" />
          Verify a Certificate
        </Link>
        <Link to="/admin" className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-all flex items-center justify-center">
          <LayoutDashboard className="w-5 h-5 mr-2" />
          Institution Portal
        </Link>
      </div>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full">
      {[
        { title: "Tamper Proof", desc: "Certificates are minted as NFTs on Ethereum, making them impossible to forge.", icon: ShieldCheck },
        { title: "Instant Verification", desc: "Employers can verify credentials in seconds without contacting the university.", icon: CheckCircle2 },
        { title: "Student Ownership", desc: "Students own their credentials in their personal digital wallets forever.", icon: GraduationCap }
      ].map((feature, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * (i + 1) }}
          className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-left"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
            <feature.icon className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
          <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

export default function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    const ethereum = (window as any).ethereum;
    if (typeof ethereum !== 'undefined') {
      try {
        setIsConnecting(true);
        const provider = new BrowserProvider(ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("User denied account access or error occurred:", error);
      } finally {
        setIsConnecting(false);
      }
    } else {
      alert("Please install MetaMask to use this feature!");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
  };

  // Listen for account changes
  useEffect(() => {
    const ethereum = (window as any).ethereum;
    if (typeof ethereum !== 'undefined') {
      ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
    }
  }, []);

  return (
    <WalletContext.Provider value={{ account, connectWallet, disconnectWallet, isConnecting }}>
      <Router>
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
          <Navbar />
          <main className="pt-24 pb-12 max-w-7xl mx-auto px-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/verify" element={<VerifyPage />} />
              <Route path="/student" element={<StudentPortal />} />
              <Route path="/admin" element={<AdminPortal />} />
            </Routes>
          </main>
          
          <footer className="border-t border-slate-200 py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <Award className="text-blue-600 w-6 h-6" />
                <span className="text-lg font-bold">CertiChain</span>
              </div>
              <p className="text-slate-500 text-sm">
                &copy; 2026 CertiChain. Secured by Ethereum Blockchain.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors text-xs font-medium">Documentation</a>
                <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors text-xs font-medium">Privacy Policy</a>
                <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors text-xs font-medium">Terms of Service</a>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </WalletContext.Provider>
  );
}
