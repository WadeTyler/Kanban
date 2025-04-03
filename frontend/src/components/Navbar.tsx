'use client';
import React from 'react';
import useAuthStore from "@/stores/auth.store";
import {RiHome3Line, RiKanbanView, RiLoginBoxLine} from "@remixicon/react";
import Link from "next/link";
import {LOGIN_URL} from "@/environment";
import ThemeButton from "@/components/ThemeButton";

const Navbar = () => {

  const {user} = useAuthStore();

  return (
    <div className="w-full h-12 px-4 flex items-center justify-between border-b border-b-secondary fixed z-50 top-0 left-0">
      {/* Left Side */}
      <div className="flex items-center gap-4 text-foreground">
        <Link href="/">
          <header className="text-lg font-semibold inline-flex items-center gap-2 cursor-pointer hover-btn">
            <RiHome3Line />
            <span className="">Kanban</span>
          </header>
        </Link>

        <Link href="/boards">
          <section className="text-lg font-semibold inline-flex items-center gap-2 cursor-pointer hover-btn">
            <RiKanbanView />
            <span>Boards</span>
          </section>
        </Link>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-8">

        <ThemeButton />

        {!user && (
          <Link href={LOGIN_URL}>
            <button className="submit-btn">
              <RiLoginBoxLine />
              <span>Login</span>
            </button>
          </Link>
        )}

        {user && (
          <div>
            {/* Profile Pic */}
            <Link href="/profile" className="flex items-center gap-4 hover-btn">
              <img src={user.profilePicture} alt="User Profile Picture" className="w-8 h-8 rounded-full"/>
            </Link>
          </div>
        )}

      </div>

    </div>
  );
};

export default Navbar;