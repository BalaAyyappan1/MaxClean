import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { OrderProvider } from "@/contexts/orderContext";

 
export const metadata: Metadata = {
  title: "MaxClean - Premium Doorstep Carwash Services",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={``}
      >
    
        <OrderProvider>
        {children}
        </OrderProvider>
      </body>
      
    </html>
  );
}
