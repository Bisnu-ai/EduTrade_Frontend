"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Package, BarChart3, ShieldAlert, Trash2,
  Ban, ShieldCheck, Search, RefreshCw, ChevronDown,
  Crown, AlertTriangle, X, CheckCircle
} from "lucide-react";
import toast from "react-hot-toast";

type Tab = "stats" | "users" | "products";

function StatCard({ label, value, icon, color }: any) {
  return (
    <div className="glass-morphism p-6 rounded-3xl flex items-center gap-5">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>{icon}</div>
      <div>
        <div className="text-3xl font-black">{value}</div>
        <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">{label}</div>
      </div>
    </div>
  );
}

function ConfirmModal({ msg, onConfirm, onCancel, confirmText = "Confirm", danger = false }: any) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-morphism p-8 rounded-[32px] max-w-md w-full text-center shadow-2xl border border-white/10"
      >
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${danger ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"}`}>
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-xl font-bold mb-2">Are you sure?</h3>
        <p className="text-gray-400 mb-8">{msg}</p>
        <div className="flex gap-4">
          <button onClick={onCancel} className="flex-1 py-3 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all">
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className={`flex-1 py-3 rounded-2xl font-bold text-white transition-all ${danger ? "bg-red-500 hover:bg-red-600 shadow-red-500/20" : "bg-primary hover:bg-primary-hover shadow-primary/20 shadow-lg"}`}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("stats");
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState<{ msg: string; fn: () => void; text?: string; danger?: boolean } | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    // Allow if role is admin OR if it's the specific main admin email
    if ((user as any)?.role !== "admin" && user?.email !== "bytebazzar.org@gmail.com") { 
      router.push("/"); 
      toast.error("Access denied."); 
    }
  }, [isAuthenticated, user, router]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === "stats" || tab === "users") {
        const s = await api.get("/admin/stats");
        setStats(s.data.data);
      }
      if (tab === "users") {
        const u = await api.get(`/admin/users?search=${search}`);
        setUsers(u.data.data.users);
      }
      if (tab === "products") {
        const p = await api.get(`/admin/products?search=${search}`);
        setProducts(p.data.data.products);
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Error loading data");
    } finally {
      setLoading(false);
    }
  }, [tab, search]);

  useEffect(() => { load(); }, [tab]);

  const ask = (msg: string, fn: () => void, text = "Confirm", danger = false) => setConfirm({ msg, fn, text, danger });

  const handleBan = async (id: string, name: string, isActive: boolean) => {
    try {
      await api.put(`/admin/users/${id}/ban`);
      toast.success(isActive ? `${name} banned` : `${name} unbanned`);
      load();
    } catch { toast.error("Failed"); }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User deleted permanently");
      load();
    } catch { toast.error("Failed"); }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success("Product removed");
      load();
    } catch { toast.error("Failed"); }
  };

  const handleMakeAdmin = async (id: string, name: string) => {
    try {
      await api.put(`/admin/users/${id}/admin`);
      toast.success(`${name} is now an admin`);
      load();
    } catch (e: any) { toast.error(e.response?.data?.message || "Failed"); }
  };

  const handleDemote = async (id: string, name: string) => {
    try {
      await api.put(`/admin/users/${id}/demote`);
      toast.success(`${name} has been demoted`);
      load();
    } catch (e: any) { toast.error(e.response?.data?.message || "Failed"); }
  };

  const TABS: { key: Tab; label: string; icon: any }[] = [
    { key: "stats",    label: "Dashboard", icon: <BarChart3 size={18} /> },
    { key: "users",    label: "Users",     icon: <Users size={18} /> },
    { key: "products", label: "Products",  icon: <Package size={18} /> },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      {confirm && (
        <ConfirmModal
          msg={confirm.msg}
          confirmText={confirm.text}
          danger={confirm.danger}
          onConfirm={() => { confirm.fn(); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Page header */}
      <div className="mb-10 flex items-center gap-4">
        <div className="w-14 h-14 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500">
          <ShieldAlert size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-black">Admin Panel</h1>
          <p className="text-gray-500 text-sm">EduTrade control centre</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 glass-morphism p-1.5 rounded-2xl w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === t.key ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:text-white"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
        <button
          onClick={load}
          className="p-2.5 rounded-xl text-gray-500 hover:text-primary hover:bg-primary/10 transition-all ml-1"
          title="Refresh"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* ── Stats Tab ── */}
      {tab === "stats" && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Users"    value={stats.totalUsers}    icon={<Users size={24} />}        color="bg-primary/10 text-primary" />
          <StatCard label="Total Listings" value={stats.totalProducts}  icon={<Package size={24} />}      color="bg-green-500/10 text-green-500" />
          <StatCard label="Active Listings" value={stats.activeProducts} icon={<CheckCircle size={24} />}  color="bg-blue-500/10 text-blue-500" />
          <StatCard label="Banned Users"   value={stats.bannedUsers}   icon={<Ban size={24} />}          color="bg-red-500/10 text-red-500" />
        </div>
      )}

      {/* ── Users Tab ── */}
      {tab === "users" && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 glass-morphism px-4 py-2.5 rounded-xl flex-1 max-w-sm">
              <Search size={16} className="text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && load()}
                placeholder="Search by name or email…"
                className="bg-transparent outline-none text-sm flex-1"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20"><RefreshCw className="animate-spin mx-auto text-primary" size={32} /></div>
          ) : (
            <div className="space-y-3">
              {users.map((u) => (
                <motion.div
                  key={u._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-morphism p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center font-bold text-primary overflow-hidden flex-shrink-0">
                      {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover" /> : u.name?.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm truncate">{u.name}</span>
                        {u.role === "admin" && <Crown size={14} className="text-yellow-500" />}
                        {!u.isActive && <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-bold">BANNED</span>}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{u.email} • {u.college}</p>
                      <p className="text-[10px] text-gray-600 mt-0.5">{u.totalListings} listings · {u.totalSold} sold</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleBan(u._id, u.name, u.isActive)}
                      disabled={u.role === "admin"}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-30 ${
                        u.isActive ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20" : "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                      }`}
                    >
                      {u.isActive ? <><Ban size={13} /> Ban</> : <><ShieldCheck size={13} /> Unban</>}
                    </button>
                    {user?.email === "bytebazzar.org@gmail.com" && u.email !== "bytebazzar.org@gmail.com" && (
                      u.role === "admin" ? (
                        <button
                          onClick={() => ask(`Demote ${u.name} back to a normal user?`, () => handleDemote(u._id, u.name), "Demote", true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 transition-all"
                        >
                          <ChevronDown size={13} /> Demote
                        </button>
                      ) : (
                        <button
                          onClick={() => ask(`Promote ${u.name} to Admin?`, () => handleMakeAdmin(u._id, u.name), "Promote", false)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                        >
                          <Crown size={13} /> Admin
                        </button>
                      )
                    )}
                    <button
                      onClick={() => ask(`Delete ${u.name} permanently? All their data will be erased.`, () => handleDeleteUser(u._id), "Delete", true)}
                      disabled={u.email === "bytebazzar.org@gmail.com"}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all disabled:opacity-30"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Products Tab ── */}
      {tab === "products" && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 glass-morphism px-4 py-2.5 rounded-xl flex-1 max-w-sm">
              <Search size={16} className="text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && load()}
                placeholder="Search listings…"
                className="bg-transparent outline-none text-sm flex-1"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20"><RefreshCw className="animate-spin mx-auto text-primary" size={32} /></div>
          ) : (
            <div className="space-y-3">
              {products.map((p) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-morphism p-4 rounded-2xl flex items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                    {p.images?.[0] && <img src={p.images[0]} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{p.title}</p>
                    <p className="text-xs text-primary font-black">₹{p.price}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      By <span className="text-white font-medium">{p.seller?.name}</span> • {p.category}
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${p.isAvailable ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"}`}>
                        {p.isAvailable ? "Active" : "Sold"}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => ask(`Delete "${p.title}" permanently?`, () => handleDeleteProduct(p._id))}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all flex-shrink-0"
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
