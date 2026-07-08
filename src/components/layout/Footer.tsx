import Link from "next/link";
import { FaPhoneAlt, FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-screen-2xl mx-auto lg:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Subscribe */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-4">ByteNest</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get updates on new arrivals and exclusive offers.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent border-b border-gray-600 px-0 py-2 text-sm flex-1 outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                className="border-b border-white px-2 py-2 text-sm hover:text-gray-300 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <p className="text-gray-400 text-sm mb-2">Dhaka, Bangladesh</p>
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <FaEnvelope className="text-sm" />
              <span>info@bytenest.com</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <FaPhoneAlt className="text-sm" />
              <span>+880 1XXXXXXXXX</span>
            </div>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/dashboard/myaccount" className="hover:underline">My Account</Link></li>
              <li><Link href="/login" className="hover:underline">Login / Register</Link></li>
              <li><Link href="/cart" className="hover:underline">Cart</Link></li>
              <li><Link href="/wishlist" className="hover:underline">Wishlist</Link></li>
              <li><Link href="/products" className="hover:underline">Shop</Link></li>
            </ul>
          </div>

          {/* Quick Link */}
          <div>
            <h4 className="font-semibold mb-4">Quick Link</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li><Link href="/products" className="hover:underline">Products</Link></li>
              <li><Link href="/about" className="hover:underline">About Us</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
              <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
              <li><Link href="/terms" className="hover:underline">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin className="text-xl" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-screen-2xl mx-auto lg:px-10 py-4 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} ByteNest. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-2 md:mt-0">
            <img src="https://res.cloudinary.com/dcpjqjkht/image/upload/v1720583027/furniro/payment/cod.png" alt="COD" className="h-6" />
            <img src="https://res.cloudinary.com/dcpjqjkht/image/upload/v1720583027/furniro/payment/stripe.png" alt="Stripe" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
}
