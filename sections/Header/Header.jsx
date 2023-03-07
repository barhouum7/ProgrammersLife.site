import React, {useState, useEffect} from 'react'
import Logo from "../../components/Logo";
import {useTheme} from "next-themes";
import { DarkThemeToggle, Navbar, Dropdown } from "flowbite-react";
import { Flowbite } from "flowbite-react";
import{ SunIcon } from "@heroicons/react/20/solid";

import SearchBar from "./SearchBar";

import Link from "next/link";
import { getCategories } from '../../services'



const Header = () => {
  
  const [categories, setCategories] = useState([])
    useEffect(() => {
      getCategories()
        .then((newCategories) => setCategories(newCategories))
        .catch((err) => console.log(err))
  }, [])

  const [isScrolled, setIsScrolled] = useState(false);

  const {systemTheme , theme, setTheme} = useTheme ();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() =>{
    setMounted(true);
  },[])

   const renderThemeChanger= () => {
      if(!mounted) return null;

      const currentTheme = theme === "system" ? systemTheme : theme ;

      if(currentTheme ==="dark"){
        return (
          <SunIcon className="mt-1 mr-1 w-8 h-8 text-yellow-400 " role="button" onClick={() => setTheme('light')} />
        )
      }

      else {
        return (
          <DarkThemeToggle className="w-10 h-10 text-gray-900 " role="button" onClick={() => setTheme('dark')} />
        )
      }
   };

  return (              
    <header className="relative h-32 w-32">
    {/* <Navbar fluid className="w-full backdrop-filter backdrop-blur-lg fixed top-0 h-16 z-30  duration-500"> */}
    <Navbar fluid={true} className={`w-full h-16 z-10 fixed top-0 left-0 w-screen backdrop-filter backdrop-blur-lg dark:bg-gray-800 flex-grow sm:px-6 rounded-b shadow-lg dark:border-gray-700 trasition ease-in-out transition-all duration-500
          ${isScrolled ? "bg-white" : "bg-transparent"}`}>
      <Navbar.Brand href="/">
        <div className="lg:w-0 lg:flex-1 sm:px-6 flex justify-between items-center">
          <Logo />
          <span className="self-center whitespace-nowrap px-3 ml-1 text-md font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg">
            Programmers Life
          </span>
        </div>
        </Navbar.Brand>
        
        <Navbar.Collapse>
          <Navbar.Link className='navbar-item' href="/" active>
            Home
          </Navbar.Link>
          <Navbar.Link className='navbar-item' href="/Error404_pageNF">About</Navbar.Link>
          <Navbar.Link className='navbar-item' href="/Error404_pageNF">Services</Navbar.Link>
          
            <Dropdown label="Categories" inline={true} trigger="hover" className="transition duration-700 ease-in-out transition-all">
                {categories.map((category) => (
              <Dropdown.Item className='navbar-item'>
                  <Link key={category.slug} href={`/categories/${category.slug}`}>
                        {category.name}
                    </Link>
              </Dropdown.Item>
                ))}
            </Dropdown>
          
          <Navbar.Link className='navbar-item' href="/Error404_pageNF">Contact</Navbar.Link>
        </Navbar.Collapse>
        
        <div className="flex md:order-2">
          <Navbar.Toggle />
          {/* {renderThemeChanger()} */}
          <Flowbite>
            <DarkThemeToggle />
          </Flowbite>
          <SearchBar />
        </div>
    </Navbar>
    </header>
  );
};

export default Header;