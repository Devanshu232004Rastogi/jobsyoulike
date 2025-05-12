import { ClerkProvider } from "@clerk/nextjs";
import { Rubik } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/providers/toast-provider";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "700"], // Rubik supports 400 (Regular) and 700 (Bold)
});

export const metadata = {
  title: "JobsYouLike",
  description: "Create your own online job portal application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={rubik.className}>
          {children}
          {/* No need for 'position' or 'toastOptions' here */}
          <ToastProvider />
        </body>
      </html>
    </ClerkProvider>
  );
}
