import Link from "next/link";

import { CategoryNavigationMenu } from "./CategoryMenu";
import { LogoSquare } from "./Logo";



export function Navbar() {
  return(
    <header className="fixed w-full top-0 bg-white text-gray-600 body-font shadow-sm border-b border-gray-200 z-50">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link href="/" className="text-black no-underline flex font-medium items-center mb-4 md:mb-0">
          <LogoSquare/>
        </Link>
        <CategoryNavigationMenu />

        <nav className="md:ml-auto flex-wrap items-center text-base justify-center">
          <Link href={"/"} className="mr-5 hover:text-gray-900 hover:cursor-pointer">Home</Link>
          <a href={"https://www.cdc.gov/dhdsp/maps/atlas/index.htm"} target="_blank" className="mr-5 hover:text-gray-900 hover:cursor-pointer">Data</a>
        </nav>

      </div>
    </header>
  );
}
