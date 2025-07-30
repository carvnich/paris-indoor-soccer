import React from "react";
import Link from "next/link";
import NavItems from "@/components/NavItems";
import {SoccerBallIcon} from "@phosphor-icons/react/dist/ssr";

const Navbar = () => {
    return (
        <nav className="navbar bg-gray-300">
            <Link href="/">
                <div className="flex items-center gap-1 cursor-pointer">
                    <SoccerBallIcon size={32} weight="fill"/>
                    <h1 className="text-lg hidden md:block">Paris Indoor Soccer</h1>
                </div>
            </Link>
            <div className="flex items-center gap-8">
                <NavItems/>
            </div>
            {/*<Link href="/sign-in">*/}
            {/*    <div className="flex items-center cursor-pointer">*/}
            {/*        Sign In*/}
            {/*    </div>*/}
            {/*</Link>*/}
        </nav>
    );
};

export default Navbar;
