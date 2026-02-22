import React, { useEffect } from 'react';
import useStore from './store/useStore';
import { useSocket } from './hooks/useSocket';
import UserSelector from './components/UserSelector';
import Header from './components/Header';
import CartDashboard from './components/CartDashboard';
import ProductSearch from './components/ProductSearch';
import SharedCartPanel from './components/SharedCartPanel';
import ActivityFeed from './components/ActivityFeed';
import SuggestionPanel from './components/SuggestionPanel';
import ProductBrowser from './components/ProductBrowser';
import { CreateCartModal, JoinCartModal, InviteModal } from './components/Modals';

export default function App() {
  const currentUser = useStore(s => s.currentUser);
  const currentCart = useStore(s => s.currentCart);
  const fetchProducts = useStore(s => s.fetchProducts);
  const fetchUsers = useStore(s => s.fetchUsers);
  const fetchUserCarts = useStore(s => s.fetchUserCarts);

  // Socket.io connection
  useSocket(currentCart?.id);

  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUserCarts();
    }
  }, [currentUser]);

  // User selection screen
  if (!currentUser) {
    return <UserSelector />;
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Dashboard (no cart selected) */}
      {!currentCart && <CartDashboard />}

      {/* Cart workspace */}
      {currentCart && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Top bar with search */}
          <div className="mb-6">
            <ProductSearch />
          </div>

          {/* Main grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left column - Product Browser */}
            <div className="lg:col-span-3 space-y-4">
              <ProductBrowser />
            </div>

            {/* Center column - Shared Cart */}
            <div className="lg:col-span-5 space-y-4">
              <SharedCartPanel />
              <SuggestionPanel />
            </div>

            {/* Right column - Activity & Members */}
            <div className="lg:col-span-4 space-y-4">
              {/* Members Card */}
              <div className="glass-strong rounded-2xl border border-border/50 p-4">
                <h3 className="font-bold text-text-primary text-sm flex items-center gap-2 mb-3">
                  <span>👥</span>
                  Collaborators
                  <span className="ml-auto text-xs text-text-muted">{currentCart.memberDetails?.length || 0}</span>
                </h3>
                <div className="space-y-2">
                  {currentCart.memberDetails?.map(member => (
                    <div key={member.id} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-surface-hover transition-colors">
                      <div className="relative">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm"
                          style={{ backgroundColor: member.color }}
                        >
                          {member.avatar}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{member.name}</p>
                        <p className="text-[10px] text-text-muted flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 live-pulse" />
                          Online
                        </p>
                      </div>
                      {member.id === currentCart.ownerId && (
                        <span className="ml-auto text-[9px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">OWNER</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Smart Optimization Badge */}
              <div className="glass-strong rounded-2xl border border-border/50 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-md">
                    <span className="text-lg">🧠</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary text-sm">Smart Optimization</h3>
                    <p className="text-[10px] text-text-muted">AI-powered cart health</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gradient-to-br from-primary-50 to-green-50 rounded-xl p-3 text-center border border-primary-100">
                    <div className="relative w-12 h-12 mx-auto mb-1.5">
                      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="2.5" />
                        <path
                          d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.5"
                          strokeDasharray={`${currentCart.optimizationScore || 0}, 100`}
                          className="score-ring"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary-700">
                        {currentCart.optimizationScore || 0}%
                      </span>
                    </div>
                    <p className="text-[10px] font-semibold text-primary-700">Health Score</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 text-center border border-amber-100">
                    <p className="text-2xl font-extrabold text-amber-600 mb-1">{currentCart.suggestions?.length || 0}</p>
                    <p className="text-[10px] font-semibold text-amber-700">AI Tips</p>
                    <p className="text-[9px] text-amber-500">Available</p>
                  </div>
                </div>
              </div>

              <ActivityFeed />
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateCartModal />
      <JoinCartModal />
      <InviteModal />
    </div>
  );
}
