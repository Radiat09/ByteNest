import Link from "next/link";
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPhoneAlt,
  FaTwitter,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
          {/* Subscribe */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-4 tracking-tight">ByteNest</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Subscribe to get updates on new arrivals and exclusive offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-sm flex-1 outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/30 transition-all placeholder:text-gray-500"
              />
              <button
                type="submit"
                className="bg-brand text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-brand/90 transition-all whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-5 text-sm tracking-wider uppercase text-gray-300">
              Support
            </h4>
            <p className="text-gray-400 text-sm mb-3">Dhaka, Bangladesh</p>
            <div className="flex items-center gap-2.5 text-gray-400 text-sm mb-3">
              <FaEnvelope className="text-xs text-brand/80" />
              <span>info@bytenest.com</span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-400 text-sm">
              <FaPhoneAlt className="text-xs text-brand/80" />
              <span>+880 1XXXXXXXXX</span>
            </div>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold mb-5 text-sm tracking-wider uppercase text-gray-300">
              Account
            </h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link
                  href="/dashboard/myaccount"
                  className="hover:text-white transition-colors"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-white transition-colors"
                >
                  Login / Register
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="hover:text-white transition-colors"
                >
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="hover:text-white transition-colors"
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors"
                >
                  Shop
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Link */}
          <div>
            <h4 className="font-semibold mb-5 text-sm tracking-wider uppercase text-gray-300">
              Quick Link
            </h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-5 text-sm tracking-wider uppercase text-gray-300">
              Follow Us
            </h4>
            <div className="flex gap-3">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand/20 hover:border-brand/30 transition-all duration-200"
                  >
                    <Icon className="text-sm" />
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-screen-2xl mx-auto lg:px-10 py-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} ByteNest. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <img
              src="https://res.cloudinary.com/dcpjqjkht/image/upload/v1720583027/furniro/payment/cod.png"
              alt="COD"
              className="h-6 opacity-50"
            />
            <img
              src="https://res.cloudinary.com/dcpjqjkht/image/upload/v1720583027/furniro/payment/stripe.png"
              alt="Stripe"
              className="h-6 opacity-50"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
