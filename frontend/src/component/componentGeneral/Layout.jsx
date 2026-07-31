import Headers from './Headers.jsx';
import Footer from './Footer.jsx';
import { Toaster } from '@/components/ui/sonner';
import CompareFloatingButton from '@/component/componentGeneral/CompareFloatingButton.jsx';
import MobileStickyBottom from '@/component/componentGeneral/MobileStickyBottom.jsx';

const Layout = ({ children }) => {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2"
      >
        Skip to main content
      </a>
      <CompareFloatingButton />
      <Headers />
      <div className="flex flex-col min-h-screen overflow-hidden">
        <Toaster position="top-right" />
        <main id="main-content" className="flex-grow">{children}</main>
        <Footer />
        <MobileStickyBottom />
      </div>
    </>
  );
};

export default Layout;
