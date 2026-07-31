import Headers from './Headers.jsx';
import Footer from './Footer.jsx';
import { Toaster } from '@/components/ui/sonner';
import CompareFloatingButton from '@/component/componentGeneral/CompareFloatingButton.jsx';
import MobileStickyBottom from '@/component/componentGeneral/MobileStickyBottom.jsx';

const Layout = ({ children }) => {
  return (
    <>
      <CompareFloatingButton />
      <Headers />
      <div className="flex flex-col min-h-screen overflow-hidden">
        <Toaster position="top-right" />
        <main className="flex-grow">{children}</main>
        <Footer />
        <MobileStickyBottom />
      </div>
    </>
  );
};

export default Layout;
