"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { User, Mail, Phone, GraduationCap, MapPin, Calendar, Edit3, Camera, Loader2, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    college: user?.college || "",
    department: user?.department || "",
    year: user?.year || "",
    bio: user?.bio || "",
  });

  // Sync form data when user profile loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        college: user.college || "",
        department: user.department || "",
        year: user.year || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        dataToSend.append(key, value);
      });

      if (selectedFile) {
        dataToSend.append("avatar", selectedFile);
      }

      const { data } = await api.put("/auth/update-profile", dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAuth(data.data.user, localStorage.getItem('token') || "");
      toast.success("Profile updated successfully!");
      setSelectedFile(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar / Avatar */}
        <aside className="w-full md:w-80 space-y-6">
          <div className="glass-morphism p-8 rounded-[32px] text-center relative overflow-hidden">
            <input
              type="file"
              id="avatarInput"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div
              className="relative w-32 h-32 mx-auto mb-6 group cursor-pointer"
              onClick={() => document.getElementById('avatarInput')?.click()}
            >
              {(previewUrl || user?.avatar) ? (
                <img
                  src={previewUrl || user?.avatar}
                  alt={user?.name}
                  className="w-full h-full object-cover rounded-full border-4 border-primary/20"
                />
              ) : (
                <div className="w-full h-full bg-secondary rounded-full flex items-center justify-center text-primary text-4xl font-bold border-4 border-primary/20">
                  {user?.name?.charAt(0) || "U"}
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-1">{user?.name}</h2>
            {(user?.role === "admin" || user?.email === "bytebazzar.org@gmail.com") && (
              <div className="flex items-center justify-center gap-1.5 text-red-500 text-[10px] font-black uppercase tracking-widest mb-3">
                <ShieldCheck size={12} /> Verified Admin
              </div>
            )}
            <p className="text-gray-500 text-sm mb-4">{user?.email}</p>
            <div className="inline-flex px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
              {user?.college}
            </div>
          </div>
        </aside>

        {/* Main Form */}
        <main className="flex-grow">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-morphism p-10 rounded-[40px]"
          >
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <Edit3 size={20} className="text-primary" /> Edit Profile
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">Full Name</label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">Phone Number</label>
                  <input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">College</label>
                  <input
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">Department</label>
                  <input
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Computer Science"
                    className="input-field"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted">Year</label>
                  <input
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="e.g. 3rd Year"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted">Bio</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="input-field resize-none h-auto"
                  placeholder="Tell students more about yourself..."
                />
              </div>

              <button
                disabled={loading}
                className="bg-primary hover:bg-primary-hover px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Save Changes"}
              </button>
            </form>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
