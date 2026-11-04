import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

export const metadata = {
  title: 'Omegally — Shop Smart, Pay Your Way',
  description: 'Premium products with flexible installment payments.',
  verification: {
    google: "<meta name="google-site-verification" content="7Mg9Oq20_ww7brtSCkybn9yoK3ozr4MT0gafHS36RS0" />",
  },
};

export default function RootLayout({ children }) {
  return (
    <html   lang="en" data-scroll-behavior="smooth" >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider>
            <CartProvider>{children}</CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}