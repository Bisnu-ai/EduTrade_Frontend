"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid,
} from "recharts";
import {
  Eye, Heart, MessageCircle, Package, TrendingUp,
  ShoppingBag, BarChart2, Loader2, Star
} from "lucide-react";

const COLORS = ["#6366f1", "#22d3ee", "#f59e0b", "#10b981", "#f43f5e", "#a855f7"];

function StatCard({ icon, label, value, color, sub }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism p-6 rounded-[28px] flex items-center gap-4 border border-white/5"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-3xl font-black">{value}</div>
        <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">{label}</div>
        {sub && <div className="text-[10px] text-gray-600 mt-0.5">{sub}</div>}
      </div>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-morphism p-3 rounded-xl border border-primary/20 text-xs">
        <p className="font-bold text-primary mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>{p.name}: <b>{p.value}</b></p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/login"); return; }
    api.get("/products/seller-dashboard")
      .then(res => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  const { overview, productStats, categoryBreakdown, monthlyTrend } = data || {};

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
            <BarChart2 size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black">Seller Dashboard</h1>
            <p className="text-gray-500 text-sm">Your store's performance at a glance</p>
          </div>
        </div>
      </motion.div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        <StatCard icon={<Eye size={22} />} label="Total Views" value={overview?.totalViews ?? 0} color="bg-primary/10 text-primary" />
        <StatCard icon={<Heart size={22} />} label="Wishlists" value={overview?.totalWishlists ?? 0} color="bg-red-500/10 text-red-400" />
        <StatCard icon={<MessageCircle size={22} />} label="Messages" value={overview?.totalMessages ?? 0} color="bg-cyan-500/10 text-cyan-400" />
        <StatCard icon={<Package size={22} />} label="Enquiries" value={overview?.totalEnquiries ?? 0} color="bg-amber-500/10 text-amber-400" />
        <StatCard icon={<TrendingUp size={22} />} label="Active" value={overview?.activeListings ?? 0} color="bg-green-500/10 text-green-400" sub="Live listings" />
        <StatCard icon={<ShoppingBag size={22} />} label="Sold" value={overview?.soldItems ?? 0} color="bg-purple-500/10 text-purple-400" sub="Items sold" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Bar Chart: Views per Product */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass-morphism p-6 rounded-[28px] border border-white/5"
        >
          <h2 className="font-bold text-base mb-6 flex items-center gap-2">
            <Eye size={16} className="text-primary" /> Views per Product
          </h2>
          {productStats?.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={productStats} margin={{ top: 0, right: 0, left: -20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 10 }} angle={-30} textAnchor="end" />
                <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="views" fill="#6366f1" radius={[6, 6, 0, 0]} name="Views" />
                <Bar dataKey="wishlist" fill="#22d3ee" radius={[6, 6, 0, 0]} name="Wishlists" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center text-gray-600 text-sm">No listings yet</div>
          )}
        </motion.div>

        {/* Pie Chart: Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-morphism p-6 rounded-[28px] border border-white/5"
        >
          <h2 className="font-bold text-base mb-6 flex items-center gap-2">
            <Package size={16} className="text-primary" /> By Category
          </h2>
          {categoryBreakdown?.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryBreakdown.map((_: any, index: number) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#9ca3af" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center text-gray-600 text-sm">No data</div>
          )}
        </motion.div>
      </div>

      {/* Line Chart: Monthly Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-morphism p-6 rounded-[28px] border border-white/5 mb-6"
      >
        <h2 className="font-bold text-base mb-6 flex items-center gap-2">
          <TrendingUp size={16} className="text-primary" /> Listing Trend (Last 6 Months)
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthlyTrend} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
            <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="listings"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ fill: "#6366f1", r: 5 }}
              activeDot={{ r: 7 }}
              name="Listings"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Product Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="glass-morphism rounded-[28px] border border-white/5 overflow-hidden"
      >
        <div className="p-6 border-b border-white/5">
          <h2 className="font-bold text-base flex items-center gap-2">
            <Star size={16} className="text-primary" /> Product Performance
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">Product</th>
                <th className="text-center px-4 py-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">Price</th>
                <th className="text-center px-4 py-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">Views</th>
                <th className="text-center px-4 py-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">Wishlist</th>
                <th className="text-center px-4 py-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody>
              {productStats?.length > 0 ? productStats.map((p: any, i: number) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary overflow-hidden flex-shrink-0">
                        {p.image && <img src={p.image} className="w-full h-full object-cover" alt="" />}
                      </div>
                      <span className="font-medium text-sm truncate max-w-[160px]">{p.fullName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center font-black text-primary">₹{p.price}</td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-300">
                      <Eye size={12} /> {p.views}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-red-400">
                      <Heart size={12} /> {p.wishlist}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      p.isAvailable ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"
                    }`}>
                      {p.isAvailable ? "Active" : "Sold"}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-600">
                    No listings yet. <a href="/sell" className="text-primary font-bold">Start selling!</a>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
