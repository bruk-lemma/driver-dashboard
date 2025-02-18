import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-white h-screen justify-center items-center  text-black">
      {children}
    </div>
  );
}
