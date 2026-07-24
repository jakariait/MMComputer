import { Plus, X } from 'lucide-react';
import useCompareStore from '../../store/useCompareStore.js';

const CompareButton = ({ product }) => {
  const { compareList, addToCompare, removeFromCompare } = useCompareStore();
  const inCompare = compareList.some((p) => p._id === product._id);

  return (
    <button
      onClick={() =>
        inCompare ? removeFromCompare(product._id) : addToCompare(product)
      }
      className={`flex items-center cursor-pointer w-44 justify-center gap-2 px-3 py-1 rounded-lg border transition-all ${
        inCompare
          ? 'bg-red-100 border-red-300 text-red-600 hover:bg-red-200'
          : 'bg-gray-100 border-gray-300  hover:bg-gray-200'
      }`}
    >
      {inCompare ? <X size={16} /> : <Plus size={16} />}
      {inCompare ? 'Remove' : 'Add To Compare'}
    </button>
  );
};

export default CompareButton;
