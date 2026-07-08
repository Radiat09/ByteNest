"use client";

import MainLayout from "@/components/layout/MainLayout";
import { useState } from "react";
import { toast } from "sonner";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { Loader2 } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  };

  return (
    <MainLayout>
      <div className="max-w-screen-2xl mx-auto lg:px-10 px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <span>Home</span> / <span className="text-gray-800">Contact</span>
        </div>

        <h1 className="text-3xl font-bold mb-8">Get In Touch</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Contact Information</h2>
              <p className="text-gray-500 text-sm mb-6">
                Have questions about an order or product? We&apos;re here to help.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-[rgb(219,68,68)] mt-1" />
                <div>
                  <p className="font-medium text-sm">Address</p>
                  <p className="text-gray-500 text-sm">Dhaka, Bangladesh</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaPhoneAlt className="text-[rgb(219,68,68)] mt-1" />
                <div>
                  <p className="font-medium text-sm">Phone</p>
                  <p className="text-gray-500 text-sm">+880 1XXXXXXXXX</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaEnvelope className="text-[rgb(219,68,68)] mt-1" />
                <div>
                  <p className="font-medium text-sm">Email</p>
                  <p className="text-gray-500 text-sm">info@bytenest.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FaClock className="text-[rgb(219,68,68)] mt-1" />
                <div>
                  <p className="font-medium text-sm">Working Hours</p>
                  <p className="text-gray-500 text-sm">Sat - Thu: 9:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Your Name *</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-4 py-2.5 outline-none focus:border-[rgb(219,68,68)] transition-colors"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Your Email *</label>
                  <input
                    type="email"
                    className="w-full border rounded-lg px-4 py-2.5 outline-none focus:border-[rgb(219,68,68)] transition-colors"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject *</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-2.5 outline-none focus:border-[rgb(219,68,68)] transition-colors"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message *</label>
                <textarea
                  className="w-full border rounded-lg px-4 py-2.5 outline-none focus:border-[rgb(219,68,68)] transition-colors min-h-[150px] resize-y"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-[rgb(219,68,68)] text-white px-8 py-3 rounded-lg font-medium hover:bg-[rgb(200,55,55)] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
