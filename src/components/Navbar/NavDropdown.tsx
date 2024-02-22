import { Calendar, HomeIcon, Menu, MessageSquare, PartyPopper } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";



export function NavDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="bg-white text-black rounded-full border-neutral-400"><Menu/></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>
          <HomeIcon className="mr-2 h-4 w-4" />
          <Link href={"https://www.facebook.com"} target="_blank" rel="noopener noreferrer">Home</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <PartyPopper className="mr-2 h-4 w-4" />
          <Link href={"https://www.instagram.com"} target="_blank" rel="noopener noreferrer">Events</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MessageSquare className="mr-2 h-4 w-4" />
          <Link href={"https://www.linkedin.com"} target="_blank" rel="noopener noreferrer">Chat</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Calendar className="mr-2 h-4 w-4" />
          <Link href={"https://www.twitter.com"} target="_blank" rel="noopener noreferrer">Schedule</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
