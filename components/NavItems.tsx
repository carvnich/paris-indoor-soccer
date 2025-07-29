"use client";

import React from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";

const navItems = [
    {label: "Home", href: "/"},
    {label: "Matches", href: "/matches"},
    {label: "Profile", href: "/profile"},
];

const NavItems = () => {
    const pathname = usePathname();

    return (
        <nav className="flex items-center gap-4">
            {navItems.map(({label, href}) => (
                <Link href={href} key={label} className={cn(pathname === href && "text-primary font-semibold")}>
                    {label}
                </Link>
            ))}
        </nav>
    );
};
export default NavItems;
