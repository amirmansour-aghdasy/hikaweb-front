import OffCanvas from "./OffCanvas";
import Navbar from "./Navbar";

/**
 * Header Component - Optimized for SEO and Accessibility
 * 
 * SEO Improvements:
 * - Semantic HTML5 header element
 * - Proper ARIA labels and roles
 * - Skip to main content link for accessibility
 * - Structured navigation
 * 
 * UI/UX Improvements:
 * - Better keyboard navigation
 * - Focus management
 * - Responsive design
 */
const Header = () => {
    return ( 
        <header 
            id="header" 
            className="w-full flex flex-col"
            role="banner"
            aria-label="هدر اصلی سایت"
        >
            {/* Skip to main content link for accessibility */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none"
                aria-label="پرش به محتوای اصلی"
            >
                پرش به محتوای اصلی
            </a>
            
            <Navbar />
            <OffCanvas />
        </header>
     );
}
 
export default Header;