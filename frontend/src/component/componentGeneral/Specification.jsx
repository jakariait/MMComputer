import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Specification = ({ product, comparePage }) => {
  const { specifications } = product ?? {};
  const [collapsed, setCollapsed] = useState({});

  if (!Array.isArray(specifications) || specifications.length === 0) {
    return null;
  }

  const toggleGroup = (index) => {
    setCollapsed((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className={`rounded-lg ${comparePage ? '' : 'bg-gray-50 mt-5 p-3'}`}>
      <h2 className="text-2xl mb-4 font-semibold primaryTextColor">
        Specifications
      </h2>

      <div className="border border-gray-100 rounded-lg overflow-hidden divide-y divide-gray-200">
        {specifications.map((specGroup, index) => {
          const isCollapsed = !!collapsed[index];
          return (
            <div key={index}>
              <button
                type="button"
                onClick={() => toggleGroup(index)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
              >
                <span className="text-[13px] font-semibold uppercase tracking-wide secondaryTextColor">
                  {specGroup.title}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    isCollapsed ? '-rotate-90' : ''
                  }`}
                />
              </button>

              {!isCollapsed && (
                <table className="w-full text-sm">
                  <tbody>
                    {specGroup.labels?.map((spec, specIndex) => {
                      const isEven = specIndex % 2 === 0;
                      return (
                        <tr
                          key={specIndex}
                          className={isEven ? 'bg-white' : 'bg-gray-50/60'}
                        >
                          <td
                            className={`align-top py-3 pl-4 pr-3 text-gray-500 font-medium whitespace-nowrap ${
                              comparePage ? 'w-auto' : 'w-2/5 md:w-1/3'
                            }`}
                          >
                            {spec?.label}
                          </td>
                          <td className="align-top py-3 pr-4 text-gray-900 font-medium">
                            {spec?.value}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Specification;
