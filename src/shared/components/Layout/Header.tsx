// // src/shared/components/Layout/Header.tsx
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Compass } from 'lucide-react';
// import Button from '../Common/Button';
// import { useWalletStore } from '../../../../store/walletStore';

// const Header: React.FC = () => {
//   const { isConnected, balance, connect, disconnect } = useWalletStore();

//   return (
//     <header className="bg-background-card/95 backdrop-blur-md border-b border-primary sticky top-0 z-50">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
//           <Link to="/" className="flex items-center space-x-2 group">
//             <Compass className="w-8 h-8 text-accent group-hover:rotate-12 transition-transform duration-300" />
//             <span className="text-xl font-bold text-gradient">CrowdQuest</span>
//           </Link>
          
//           <div className="flex items-center space-x-3">
//             {isConnected ? (
//               <div className="flex items-center space-x-3">
//                 <div className="text-right">
//                   <p className="text-xs text-text-secondary">Balance</p>
//                   <p className="text-sm font-semibold text-accent">{balance} CQT</p>
//                 </div>
//                 <Button onClick={disconnect} variant="outline" size="sm">
//                   Exit
//                 </Button>
//               </div>
//             ) : (
//               <Button onClick={connect} size="sm">
//                 Connect Wallet
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;