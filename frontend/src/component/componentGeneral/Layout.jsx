import Headers from './Headers.jsx';
import Footer from './Footer.jsx';
import { Toaster } from '@/components/ui/sonner';

const Layout = ({ children }) => {
  return (
    <>
      <Headers />
      <div className="flex flex-col min-h-screen overflow-hidden">
        <Toaster position="top-right" />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
