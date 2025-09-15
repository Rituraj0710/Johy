// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Bars3Icon as MenuIcon, XMarkIcon as XIcon } from "@heroicons/react/24/outline";
// import Image from "next/image";
// import logo from "../../public/logo.jpg";
// import LanguageSelector from "./LanguageSelector";
// import { useLanguage } from "@/context/LanguageContext";
// import { getDictionary } from "../../getDictionaries";

// const NavbarPage: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [lang, setLang] = useState<any>(null); // Dictionary
//   const { currentLang } = useLanguage();

//   useEffect(() => {
//     async function fetchDictionary() {
//       const dictionary = await getDictionary(currentLang);
//       setLang(dictionary);
//     }
//     fetchDictionary();
//   }, [currentLang]);

//   if (!lang) {
//     return null; // Loading spinner or placeholder
//   }

//   const getLocalizedPath = (path: string) => `/${currentLang}${path}`;

//   return (
//     <nav className="bg-white shadow-md border-b border-gray-200">
//       {/* Similar content */}
//       <div className="container mx-auto flex justify-between items-center py-4 px-6">
//         {/* Left Section: Logo */}
//         <div className="flex items-center space-x-4">
//           <Link href={getLocalizedPath("/")} className="flex items-center">
//             <Image src={logo} alt="MyLogo" className="w-12 md:w-20 lg:w-25 object-contain" priority />
//           </Link>
//         </div>

//         {/* Center Section: Links */}
//         <div className="hidden md:flex space-x-8 relative">
//           <Link href={getLocalizedPath("/")} className="text-gray-700 hover:text-gray-900 font-medium">
//             {lang.navTitle.home}
//           </Link>
//           <Link href={getLocalizedPath("/about")} className="text-gray-700 hover:text-gray-900 font-medium">
//             {lang.navTitle.about}
//           </Link>

//           {/* Services with Dropdown */}
//           <div
//             className="relative"
//             onMouseEnter={() => setIsDropdownOpen(true)}
//             onMouseLeave={() => setIsDropdownOpen(false)}
//           >
//             <button className="text-gray-700 hover:text-gray-900 font-medium flex items-center">
//               {lang.navTitle.services}
//             </button>
//             {isDropdownOpen && (
//               <div className="absolute top-full left-0 bg-white shadow-md border mt-2 z-10 w-48">
//                 <Link
//                   href={getLocalizedPath("/services/web-design")}
//                   className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//                 >
//                   {lang.navTitle.terms}
//                 </Link>
//                 <Link
//                   href={getLocalizedPath("/services/seo")}
//                   className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//                 >
//                   {lang.navTitle.privacy}
//                 </Link>
//                 <Link
//                   href={getLocalizedPath("/services/digital-marketing")}
//                   className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//                 >
//                   {lang.navTitle.terms}
//                 </Link>
//               </div>
//             )}
//           </div>

//           <Link href={getLocalizedPath("/contact")} className="text-gray-700 hover:text-gray-900 font-medium">
//             {lang.navTitle.contact}
//           </Link>
//         </div>

//         {/* Right Section */}
//         <div className="hidden md:flex items-center space-x-4">
//           <Link href={getLocalizedPath("/login")}>
//             <Button variant="outline" className="text-sm">
//               {lang.navTitle.login}
//             </Button>
//           </Link>
//           <Link href={getLocalizedPath("/signup")}>
//             <Button className="text-sm">{lang.navTitle.signup}</Button>
//           </Link>
//         </div>
//         <LanguageSelector />

//         {/* Mobile Menu */}
//         <div className="md:hidden">
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="text-gray-700 focus:outline-none"
//           >
//             {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
//           </button>
//         </div>
//       </div>

//       {isOpen && (
//         <div className="md:hidden bg-white shadow-lg">
//           <div className="flex flex-col space-y-4 px-6 py-4">
//             <Link href={getLocalizedPath("/")} className="text-gray-700 hover:text-gray-900 font-medium">
//               {lang.navTitle.home}
//             </Link>
//             <Link href={getLocalizedPath("/about")} className="text-gray-700 hover:text-gray-900 font-medium">
//               {lang.navTitle.about}
//             </Link>
//             <div>
//               <button
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 className="text-gray-700 hover:text-gray-900 font-medium w-full text-left"
//               >
//                 {lang.navTitle.services}
//               </button>
//               {isDropdownOpen && (
//                 <div className="bg-white shadow-md border mt-2 w-full">
//                   <Link
//                     href={getLocalizedPath("/services/web-design")}
//                     className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//                   >
//                     {lang.services.webDesign}
//                   </Link>
//                   <Link
//                     href={getLocalizedPath("/services/seo")}
//                     className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//                   >
//                     {lang.services.seo}
//                   </Link>
//                   <Link
//                     href={getLocalizedPath("/services/digital-marketing")}
//                     className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
//                   >
//                     {lang.services.digitalMarketing}
//                   </Link>
//                 </div>
//               )}
//             </div>
//             <Link href={getLocalizedPath("/contact")} className="text-gray-700 hover:text-gray-900 font-medium">
//               {lang.navTitle.contact}
//             </Link>
//             <Link href={getLocalizedPath("/login")}>
//               <Button variant="outline" className="text-sm w-full">
//                 {lang.navTitle.login}
//               </Button>
//             </Link>
//             <Link href={getLocalizedPath("/signup")}>
//               <Button className="text-sm w-full">{lang.navTitle.signup}</Button>
//             </Link>
//           </div>
//         </div>
//       )}
//       {/* <LanguageSelector /> */}
//     </nav>
//   );
// };

// export default NavbarPage;


"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "../../public/logo.jpg";
import logobg from "../../public/logo_bg.png"
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "@/context/LanguageContext";
import { getDictionary } from "../../getDictionaries";

const NavbarPage: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [lang, setLang] = useState<any>(null);
  const [error, setError] = useState(false);
  const { currentLang } = useLanguage();

  useEffect(() => {
    async function fetchDictionary() {
      try {
        const dictionary = await getDictionary(currentLang);
        setLang(dictionary);
      } catch (err) {
        console.error("Error fetching dictionary:", err);
        setError(true);
      }
    }
    fetchDictionary();
  }, [currentLang]);

  if (error) {
    return <p className="text-red-500 text-center py-4">Error loading language data. Please try again later.</p>;
  }

  if (!lang) {
    return <p className="text-center py-4">Loading...</p>;
  }

  const getLocalizedPath = (path: string) => `/${currentLang}${path}`;

  return (
    <div className="drawer z-50 sticky top-0 ">
      <input id="navbar-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <nav className="bg-slate-400 shadow-md border-b border-gray-200 s">
          <div className="container mx-auto flex justify-between items-center py-4 px-6">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <Link href={getLocalizedPath("/")}>
                <Image src={logobg} alt="MyLogo" className="w-12 md:w-20 object-contain" priority />
              </Link>
            </div>

            {/* Navbar Links for Desktop */}
            <div className="hidden md:flex space-x-8">
              <Link href={getLocalizedPath("/")} className="text-gray-700 hover:text-gray-900 font-medium">
                {lang.navTitle.home}
              </Link>
              <Link href={getLocalizedPath("/about")} className="text-gray-700 hover:text-gray-900 font-medium">
                {lang.navTitle.about}
              </Link>

              {/* Services Dropdown */}
              <div className="dropdown relative ">
                <label tabIndex={0} className="cursor-pointer text-gray-700 hover:text-gray-900 font-medium">
                  {lang.navTitle.services}
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-gray-600 rounded-box w-52 mt-2 absolute z-50 text-white">
                  <li>
                    <Link href={getLocalizedPath("/services/web-design")}>
                      {lang.navTitle.privacy}
                    </Link>
                  </li>
                  <li>
                    <Link href={getLocalizedPath("/services/seo")}>
                      {lang.navTitle.terms}
                    </Link>
                  </li>
                  <li>
                    <Link href={getLocalizedPath("/services/digital-marketing")}>
                      {lang.navTitle.privacy}
                    </Link>
                  </li>
                </ul>
              </div>

              <Link href={getLocalizedPath("/contact")} className="text-gray-700 hover:text-gray-900 font-medium">
                {lang.navTitle.contact}
              </Link>
            </div>

            {/* Language Selector and Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <LanguageSelector />
              <Link href={getLocalizedPath("/auth/login")}>
                <Button variant="outline" className="text-sm">
                  {lang.navTitle.login}
                </Button>
              </Link>
              <Link href={getLocalizedPath("/auth/signup")}>
                <Button className="text-sm">{lang.navTitle.signup}</Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <label htmlFor="navbar-drawer" className="cursor-pointer text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </label>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      <div className="drawer-side">
        <label htmlFor="navbar-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-64 bg-gray-600 rounded w-full items-center">
          <li>
            <Link
              href={getLocalizedPath("/")}
              onClick={() => (document.getElementById("navbar-drawer") as HTMLInputElement).checked = false}
            >
              {lang.navTitle.home}
            </Link>
          </li>
          <li>
            <Link
              href={getLocalizedPath("/about")}
              onClick={() => (document.getElementById("navbar-drawer") as HTMLInputElement).checked = false}
            >
              {lang.navTitle.about}
            </Link>
          </li>
          <li>
            <div className="dropdown relative">
              <label
                tabIndex={0}
                className="cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {lang.navTitle.services}
              </label>
              {isDropdownOpen && (
                <ul tabIndex={0} className="menu p-2 shadow bg-gray-300 rounded-box w-full absolute z-50 top-full left-0">
                  <li>
                    <Link
                      href={getLocalizedPath("/services/web-design")}
                      onClick={() => (document.getElementById("navbar-drawer") as HTMLInputElement).checked = false}
                    >
                      {lang.navTitle.terms}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={getLocalizedPath("/services/seo")}
                      onClick={() => (document.getElementById("navbar-drawer") as HTMLInputElement).checked = false}
                    >
                      {lang.navTitle.privacy}
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </li>
          <li>
            <Link
              href={getLocalizedPath("/contact")}
              onClick={() => (document.getElementById("navbar-drawer") as HTMLInputElement).checked = false}
            >
              {lang.navTitle.contact}
            </Link>
            <Link href={getLocalizedPath("/auth/login")}>
               <Button variant="outline" className="text-sm w-full">
                 {lang.navTitle.login}
               </Button>
             </Link>
             <Link href={getLocalizedPath("/auth/signup")}>
               <Button className="text-sm w-full">{lang.navTitle.signup}</Button>
             </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavbarPage;

