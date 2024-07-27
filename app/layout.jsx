import ClientLayout from "./ClientLayout";
export const metadata = {
  title: "Orange Cart",
  description: "One side stop of all your needs.",
  icons: {
    icon: "favicon.ico",
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
