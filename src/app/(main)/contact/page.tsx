"use client";

import MainLayout from "@/components/layout/MainLayout";
import { useState } from "react";
import { toast } from "sonner";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { Loader2 } from "lucide-react";

const contactInfo = [
  { icon: FaMapMarkerAlt, label: "Address", value: "Dhaka, Bangladesh" },
  { icon: FaPhoneAlt, label: "Phone", value: "+880 1XXXXXXXXX" },
  { icon: FaEnvelope, label: "Email", value: "info@bytenest.com" },
  { icon: FaClock, label: "Working Hours", value: "Sat - Thu: 9:00 AM - 8:00 PM" },
];

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
        <div className="text-sm text-gray-400 mb-8">
          <span className="hover:text-brand cursor-pointer transition-colors">Home</span> / <span className="text-gray-800">Contact</span>
        </div>

        <h1 className="text-3xl font-bold mb-8">Get In Touch</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Contact Information</h2>
              <p className="text-gray-500 text-sm">
                Have questions about an order or product? We&apos;re here to help.
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((info) => {
                const Icon = info.icon;
                return (
                  <div key={info.label} className="flex items-start gap-4 p-4 card-modern group">
                    <div className="w-10 h-10 bg-brand/5 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-brand/10 transition-colors">
                      <Icon className="text-brand text-sm" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{info.label}</p>
                      <p className="text-gray-500 text-sm">{info.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card-modern p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Your Name *</label>
                    <input
                      type="text"
                      className="input-modern"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Your Email *</label>
                    <input
                      type="email"
                      className="input-modern"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Subject *</label>
                  <input
                    type="text"
                    className="input-modern"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Message *</label>
                  <textarea
                    className="input-modern min-h-[150px] resize-y"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
