'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Briefcase,
  User,
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { AnimatePresence, motion } from 'framer-motion';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  // Apply collapsed state to document body for layout sync
  useEffect(() => {
    document.body.dataset.sidebarCollapsed = collapsed.toString();
  }, [collapsed]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Agent Chat', href: '/agent', icon: MessageSquare },
    { label: 'Matches', href: '/matches', icon: Briefcase },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const NavContent = () => (
    <>
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <BrainCircuit className="text-white w-5 h-5" />
        </div>
        <span className={cn("font-bold text-xl tracking-tight transition-opacity duration-300",
          collapsed && "opacity-0 lg:hidden"
        )}>
          Memora
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-all group relative",
                isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5 text-muted-foreground hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className={cn("font-medium transition-opacity duration-300",
                collapsed && "opacity-0 lg:hidden"
              )}>
                {item.label}
              </span>
              {collapsed && (
                <div className="hidden lg:block absolute left-full ml-4 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100] border border-white/10 shadow-xl">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span className={cn("transition-opacity duration-300", collapsed && "opacity-0 lg:hidden")}>
            Logout
          </span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex w-full items-center justify-center mt-2"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button onClick={() => setMobileOpen(true)} className="p-2 glass rounded-lg shadow-lg">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-[#0a0f1e] border-r border-white/10 z-[70] flex flex-col md:hidden shadow-2xl"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-2 glass rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
              <NavContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex fixed left-0 top-0 h-screen glass border-r z-50 transition-all duration-300 flex-col",
        collapsed ? "w-20" : "w-64"
      )}>
        <NavContent />
      </aside>
    </>
  );
}
