"use client";

import NavButton from "./NavButton";

export default function NavigationBar() {
  return (
    <div className="col-span-full grid grid-cols-2 items-center h-[14vh] px-[3vw]">
      <div />
      <div className="flex flex-row justify-self-end gap-4">
        <NavButton href="/projects">Projects</NavButton>
        <NavButton href="/contact">Contact</NavButton>
      </div>
    </div>
  );
}
