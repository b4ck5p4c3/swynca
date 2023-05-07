"use client";

import Image from "next/image";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { use, useEffect, useState } from "react";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";

const links: Record<string, string> = {
  "": "Dashboard",
  members: "Members",
  memberships: "Memberships",
  finance: "Finance",
};

export default function GlobalHeader() {
  const [session, setSession] = useState<Session | null>(null);
  const [userMenuVisible, setUserMenuVisibility] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const path = usePathname();

  const linkClass = (p: string) =>
    "block py-2 pl-3 pr-4 rounded md:bg-transparent md:p-0".concat(
      path?.split("/")[1] === p
        ? "bg-blue-700 text-violet-600 md:text-violet-600"
        : "bg-gray-50 text-black"
    );

  useEffect(() => {
    // @todo replace with use() when it'll become stable
    (async () => {
      const s = await getSession();
      setSession(s);
    })();
  }, []);

  return (
    <nav className="bg-white border-gray-200 rounded mb-8">
      <div className="container flex flex-wrap items-center justify-between mx-auto max-w-none relative">
        <Link href="/" className="flex items-center">
          <h1 className="text-3xl font-bold self-center whitespace-nowrap">
            Swynca
            <sup> β</sup>
          </h1>
        </Link>
        <div className="flex items-center md:order-2 relative">
          <button
            type="button"
            className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
            id="user-menu-button"
            aria-expanded={userMenuVisible ? "true" : "false"}
            onClick={() => setUserMenuVisibility(!userMenuVisible)}
            data-dropdown-toggle="user-dropdown"
            data-dropdown-placement="bottom"
          >
            <span className="sr-only">Open user menu</span>
            <Image
              className="w-8 h-8 rounded-full"
              src={session?.user?.image as string}
              width={32}
              height={32}
              alt="user photo"
            />
          </button>
          <div
            className="z-50 my-4 absolute top-8 right-0 text-base list-none bg-white divide-y divide-gray-100 rounded shadow"
            hidden={!userMenuVisible}
            id="user-dropdown"
          >
            <div className="px-4 py-3">
              <span className="block text-sm text-gray-900">
                {session?.user?.name}
              </span>
              <span className="block text-sm font-medium text-gray-500 truncate">
                {session?.user?.email}
              </span>
            </div>
            <ul className="py-1" aria-labelledby="user-menu-button">
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700"
                >
                  Profile
                </a>
              </li>
              <li>
                <Link
                  href="/api/auth/signout"
                  className="block px-4 py-2 text-sm text-red-700"
                >
                  Sign out
                </Link>
              </li>
            </ul>
          </div>
          <button
            data-collapse-toggle="mobile-menu-2"
            type="button"
            className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="mobile-menu-2"
            aria-expanded={dropdownVisible}
            onClick={() => setDropdownVisible(!dropdownVisible)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <div
          className="items-center justify-between w-full md:flex md:w-auto md:order-1 md:static absolute top-full left-0 z-50"
          hidden={!dropdownVisible}
          id="mobile-menu-2"
        >
          <ul className="flex flex-col p-4 mt-4 border font-mono border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white">
            {Object.entries(links).map(([path, label]) => (
              <li key={path}>
                <Link href={`/${path}`} className={linkClass(path)}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
