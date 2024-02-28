"use client";

import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";



const components: { title: string; href: string; description: string }[] = [
  {
    title: "D3.js",
    href: "https://d3js.org/",
    description:
        "A JavaScript library for manipulating documents based on data. D3.js helps you bring data to life using HTML, SVG, and CSS.",
  },
  {
    title: "React",
    href: "https://reactjs.org/",
    description:
        "A JavaScript library for building user interfaces. React makes it painless to create interactive UIs.",
  },
  {
    title: "Next.js",
    href: "https://nextjs.org/",
    description:
        "A React framework for building server-side rendered (SSR) web applications. Next.js provides built-in features for fast and efficient development.",
  },
  {
    title: "shadcn/ui",
    href: "https://ui.shadcn.com",
    description:
        "A UI component library designed for modern web applications. Shadow UI provides pre-built components and styles for building beautiful user interfaces.",
  },
  // Add more libraries as needed
];


export function CategoryNavigationMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <div className="ml-6">
            <NavigationMenuTrigger><span className="text-xl">Libraries</span></NavigationMenuTrigger>
          </div>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map(component => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
