"use client";

import MainLayout from "@/components/layout/MainLayout";

export default function PrivacyPage() {
  return (
    <MainLayout>
      <div className="max-w-screen-2xl mx-auto lg:px-10 px-4 py-8">
        <div className="text-sm text-gray-500 mb-6">
          <span>Home</span> / <span className="text-gray-800">Privacy Policy</span>
        </div>

        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

          <div className="space-y-6 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">1. Information We Collect</h2>
              <p>We collect personal information you provide directly, such as your name, email address, phone number, and shipping address when you create an account or place an order.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">2. How We Use Your Information</h2>
              <p>We use your information to process orders, deliver products, send order updates, improve our services, and communicate with you about promotions or support inquiries.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">3. Information Sharing</h2>
              <p>We do not sell your personal information. We may share your data with trusted third parties only for order fulfillment (e.g., courier services) and payment processing.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">4. Data Security</h2>
              <p>We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">5. Cookies</h2>
              <p>We use cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can control cookie settings through your browser.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">6. Your Rights</h2>
              <p>You have the right to access, update, or delete your personal information. To exercise these rights, please contact us at <span className="text-[rgb(219,68,68)]">info@bytenest.com</span>.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">7. Data Retention</h2>
              <p>We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy or as required by law.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">8. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">9. Contact Us</h2>
              <p>For questions about this Privacy Policy, contact us at <span className="text-[rgb(219,68,68)]">info@bytenest.com</span>.</p>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
