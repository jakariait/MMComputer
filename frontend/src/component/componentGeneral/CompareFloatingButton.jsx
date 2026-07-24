import { Link } from 'react-router-dom';
import { Scale } from 'lucide-react';
import useCompareStore from '../../store/useCompareStore.js';

const CompareFloatingButton = () => {
  const { compareList } = useCompareStore();

  // if (compareList.length === 0) return null;

  return (
    <Link
      to="/product-compare"
      className="fixed bottom-10 right-17 secondaryBgColor text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg z-100 "
    >
      <Scale size={18} />
      <span className={'hidden md:block'}>Compare</span> ({compareList.length})
    </Link>
  );
};

export default CompareFloatingButton;
