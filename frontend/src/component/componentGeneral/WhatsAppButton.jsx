import { FaWhatsapp } from 'react-icons/fa';
import useGeneralInfoStore from '@/store/GeneralInfoStore';

const getWhatsAppLink = (number) => {
  const digits = String(number).replace(/[^\d]/g, '');
  return `https://wa.me/${digits}`;
};

const WhatsAppButton = () => {
  const { GeneralInfoList } = useGeneralInfoStore();
  const isActive = GeneralInfoList?.WhatsAppNumberActive;
  const hasNumber = GeneralInfoList?.WhatsAppNumber?.trim();

  if (!isActive || !hasNumber) return null;

  const handleClick = () => {
    const link = getWhatsAppLink(hasNumber);
    window.open(link, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-20 right-2 text-[#28D366] p-3 z-50 cursor-pointer"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="w-12 h-12" />
    </button>
  );
};

export default WhatsAppButton;
