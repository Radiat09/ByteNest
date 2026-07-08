"use client";

import MainLayout from "@/components/layout/MainLayout";

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="max-w-screen-2xl mx-auto lg:px-10 px-4 py-8">
        <div className="text-sm text-gray-500 mb-6">
          <span>Home</span> / <span className="text-gray-800">Terms & Conditions</span>
        </div>

        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">Terms & Conditions</h1>

          <div className="space-y-6 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">1. Acceptance of Terms</h2>
              <p>By accessing and using ByteNest, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our website.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">2. Products & Pricing</h2>
              <p>All product descriptions, images, and specifications are as accurate as possible. However, colors may vary slightly due to monitor differences. Prices are subject to change without notice. We reserve the right to cancel orders at our discretion.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">3. Orders & Payment</h2>
              <p>Orders are subject to availability. We accept payments via Cash on Delivery (COD) and Stripe. Payment must be completed before shipping for online payments.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">4. Shipping & Delivery</h2>
              <p>We deliver across Bangladesh. Delivery times are estimated and may vary. Free delivery is available for orders over ৳1000. We are not responsible for delays caused by courier services.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">5. Returns & Refunds</h2>
              <p>Products can be returned within 7 days of delivery if they are defective or damaged. Refunds will be processed within 7-10 business days after inspection of the returned item.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">6. User Accounts</h2>
              <p>You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information during registration. We reserve the right to suspend accounts that violate our terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">7. Limitation of Liability</h2>
              <p>ByteNest shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">8. Changes to Terms</h2>
              <p>We may update these terms at any time. Continued use of the website after changes constitutes acceptance of the new terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-800 mb-3">9. Contact Us</h2>
              <p>If you have any questions about these Terms & Conditions, please contact us at <span className="text-[rgb(219,68,68)]">info@bytenest.com</span>.</p>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
