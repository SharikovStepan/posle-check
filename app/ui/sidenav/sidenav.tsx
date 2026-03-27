import NavLinks from "./nav-links";

export default function SideNav({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className={`${hidden ? "hidden md:block" : "block"} bg-bg-secondary rounded-md p-3 border border-border shadow-md transition-all duration-200`}>
      <NavLinks />
    </div>
  );
}
