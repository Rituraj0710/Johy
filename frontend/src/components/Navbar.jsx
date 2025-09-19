"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import Cookies from "js-cookie";
import Avatar from "./ui/Avatar";
import AgentAvatar from "./ui/AgentAvatar";
const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [role, setRole] = useState(null);
  useEffect(() => {
    const authCookie = Cookies.get("is_auth");
    setIsAuth(!!authCookie);
    const userRole = Cookies.get("role");
    setRole(userRole);
  },[]);

  return (
    <>
      {isAuth === null && <Loading />}
      <div className="drawer z-50 sticky top-0 ">
        <input id="navbar-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <nav className="bg-slate-400 shadow-md border-b border-gray-200 s">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
              {/* Logo Section */}
              <div className="flex items-center space-x-4">
                <Link href={"/"}>
                  <img
                    width="50"
                    height="50"
                    className="w-12 md:w-20 object-contain"
                    src="/logo_bg.png"
                    alt="mylogo"
                  />
                </Link>
              </div>

              {/* Navbar Links for Desktop */}
              <div className="hidden md:flex space-x-8">
                <Link
                  href={"/"}
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  {"Home"}
                </Link>
                <Link
                  href={"/about"}
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  {"About"}
                </Link>

                {/* Services Dropdown */}
                <div className="dropdown relative ">
                  <label
                    tabIndex={0}
                    className="cursor-pointer text-gray-700 hover:text-gray-900 font-medium"
                  >
                    {"Services"}
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-gray-600 rounded-box w-52 mt-2 absolute z-50 text-white"
                  >
                    <li>
                      <Link href={"/will-deed"}>{"Will Deed Form"}</Link>
                    </li>
                    <li>
                      <Link href={"/sale-deed"}>{"Sale Deed Form"}</Link>
                    </li>
                    <li>
                      <Link href={"/trust-deed"}>{"Trust Deed Form"}</Link>
                    </li>
                    <li>
                      <Link href={"/property-registration"}>{"Property Registration Form"}</Link>
                    </li>
                    <li>
                      <Link href={"/property-sale-certificate"}>{"Property Sale Certificate Generator"}</Link>
                    </li>
                    <li>
                      <Link href={"/power-of-attorney"}>{"Power of Attorney Form"}</Link>
                    </li>
                    <li>
                      <Link href={"/adoption-deed"}>{"Adoption Deed Form"}</Link>
                    </li>
                  </ul>
                </div>

                <Link
                  href={"/contact"}
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  {"Contact"}
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                {isAuth ? (
                  role === "user" ? (
                  <Link href="/user/profile" className="text-black mr-4">
                    <Avatar />
                  </Link>
                ) : (
                  <Link href="/agent/agent-profile" className="text-black mr-4">
                    <AgentAvatar />
                  </Link>
                )
                ) : (
                  <>
                      {/* <button className="btn btn-outline">Login</button> */}
                      <div className="dropdown dropdown-hover text-white ">
                        <div tabIndex={0} role="button" className="btn btn-outline m-1 md:btn-md btn-sm">
                          User
                        </div>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu bg-base-100 rounded-box z-[1] gap-1 p-2 shadow"
                        >
                          <Link href="/account/user-login" className="text-white ">
                          <li>
                            {/* <a>Item 1</a> */}
                            <button className="btn btn-outline md:btn-md btn-xs">Login</button>
                          </li>
                          </Link>
                          <Link href="/account/user-register" className="text-white ">
                          <li>
                            {/* <a>Item 1</a> */}
                            <button className="btn btn-outline md:btn-md btn-xs">Signup</button>
                          </li>
                          </Link>
                        </ul>
                      </div>
                      <div className="dropdown dropdown-hover text-white ">
                        <div tabIndex={0} role="button" className="btn btn-outline m-1 md:btn-md btn-sm">
                          Agent
                        </div>
                        <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box z-[1] gap-1 p-2 shadow "
                  >
                    <Link href="/account/agent-login" className="text-white ">
                    <li>
                      {/* <a>Item 1</a> */}
                      <button className="btn btn-outline md:btn-md btn-xs">Login</button>
                    </li>
                    </Link>

                    <Link href="/account/agent-register" className="text-white ">
                    <li>
                      {/* <a>Item 1</a> */}
                      <button className="btn btn-outline md:btn-md btn-xs">Signup</button>
                    </li>
                    </Link>
                        </ul>
                      </div>
                  </>
                )}
               </div>

              {/* Mobile Menu Toggle */}
              <div className="md:hidden">
                <label
                  htmlFor="navbar-drawer"
                  className="cursor-pointer text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                </label>
              </div>
            </div>
          </nav>
        </div>

        {/* Mobile Drawer */}
        <div className="drawer-side">
          <label htmlFor="navbar-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 bg-gray-600 rounded w-full items-center">
            <li>
              <Link
                href={"/"}
                onClick={() =>
                  (document.getElementById("navbar-drawer").checked = false)
                }
              >
                {"Home"}
              </Link>
            </li>
            <li>
              <Link
                href={"/about"}
                onClick={() =>
                  (document.getElementById("navbar-drawer").checked = false)
                }
              >
                {"About"}
              </Link>
            </li>
            <li>
              <div className="dropdown relative">
                <label
                  tabIndex={0}
                  className="cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {"Services"}
                </label>
                {isDropdownOpen && (
                  <ul
                    tabIndex={0}
                    className="menu p-2 shadow bg-gray-300 rounded-box w-full absolute z-50 top-full left-0"
                  >
                    <li>
                      <Link
                        href={"/will-deed"}
                        onClick={() =>
                          (document.getElementById(
                            "navbar-drawer"
                          ).checked = false)
                        }
                      >
                        {"Will Deed Form"}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={"/sale-deed"}
                        onClick={() =>
                          (document.getElementById(
                            "navbar-drawer"
                          ).checked = false)
                        }
                      >
                        {"Sale Deed"}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={"/trust-deed"}
                        onClick={() =>
                          (document.getElementById(
                            "navbar-drawer"
                          ).checked = false)
                        }
                      >
                        {"Trust Deed Form"}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={"/property-registration"}
                        onClick={() =>
                          (document.getElementById(
                            "navbar-drawer"
                          ).checked = false)
                        }
                      >
                        {"Property Registration Form"}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={"/property-sale-certificate"}
                        onClick={() =>
                          (document.getElementById(
                            "navbar-drawer"
                          ).checked = false)
                        }
                      >
                        {"Property Sale Certificate Generator"}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={"/power-of-attorney"}
                        onClick={() =>
                          (document.getElementById(
                            "navbar-drawer"
                          ).checked = false)
                        }
                      >
                        {"Power of Attorney Form"}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={"/adoption-deed"}
                        onClick={() =>
                          (document.getElementById(
                            "navbar-drawer"
                          ).checked = false)
                        }
                      >
                        {"Adoption Deed Form"}
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>
            <li>
              <Link
                href={"/contact"}
                onClick={() =>
                  (document.getElementById("navbar-drawer").checked = false)
                }
              >
                {"Contact"}
              </Link>
            </li>
            <li>
              <Link
                href={"/will-deed"}
                onClick={() =>
                  (document.getElementById("navbar-drawer").checked = false)
                }
              >
                {"Will Deed Form"}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
