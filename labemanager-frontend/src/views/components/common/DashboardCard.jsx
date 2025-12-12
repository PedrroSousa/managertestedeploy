import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaPencilAlt, FaChartLine, FaArrowRight } from 'react-icons/fa';

const DashboardCard = ({
  title,
  route,
  iconColor,
  isAdminOnly,
  hasCRUD,
  isReport,
  isFinance,
  circles = [], // Array of content for circles
  variant = 'default' // 'default' | 'small' | 'wide'
}) => {

  const destination = route || '#';

  // Base classes for the card container
  const baseCardClasses = "bg-white border-2 border-black rounded-[30px] overflow-hidden flex flex-col relative transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";

  // Height classes based on content/variant
  // 'default' (tall with circles) -> h-[260px]
  // 'small'  (Logistics, Finance, Calendar) -> h-[80px] or auto
  // 'wide'   (Report) -> w-full

  const heightClass = variant === 'small' ? 'h-[90px]' : 'min-h-[280px]';

  return (
    <Link to={destination} className="block w-full h-full">
      <div className={`${baseCardClasses} ${heightClass} ${isReport ? 'border-2' : ''}`}>

        {/* Header / Title Section */}
        <div className={`p-5 flex items-center justify-between ${variant === 'small' ? 'h-full' : ''}`}>
          <h3 className="text-xl font-bold text-black font-sans">{title}</h3>

          {/* For small cards, we might just show an icon or button on the right */}
          {variant === 'small' && !isFinance && (
            <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
              <FaPlus />
            </div>
          )}

          {/* Financeiro specific edit icon */}
          {isFinance && (
            <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
              <FaPencilAlt />
            </div>
          )}
        </div>

        {/* Content Section (For Tall Cards) */}
        {variant !== 'small' && !isReport && (
          <div className="flex-grow relative mt-auto">
            {/* Colored Background Area (Curve) */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[70%] rounded-t-[40px] border-t-2 border-black z-0"
              style={{ backgroundColor: iconColor || '#95b8bc' }} // default blueish
            ></div>

            {/* Overlapping Circles */}
            <div className="relative z-10 flex items-center justify-center h-full pt-10 px-4">
              {/* Plus Circle (Always first) */}
              <div className="w-24 h-24 bg-white rounded-full border-2 border-black flex items-center justify-center -mr-6 z-30 shadow-sm">
                <FaPlus size={40} className="text-black" />
              </div>

              {/* Dynamic Circles (Placeholders) */}
              {circles.map((item, index) => (
                <div
                  key={index}
                  className="w-24 h-24 rounded-full border-2 border-black flex items-center justify-center -mr-6 last:mr-0 overflow-hidden bg-white z-20 shadow-sm"
                  style={{ zIndex: 20 - index }}
                >
                  {/* Placeholder content for circle */}
                  {item.type === 'icon' ? (
                    <div className="text-3xl text-gray-600">{item.content}</div>
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-center text-gray-500 font-bold p-1">
                      {item.alt || 'Img'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Report Card Specific Layout */}
        {isReport && (
          <div className="flex-grow flex items-center justify-end px-8 pb-4">
            {/* This mimics the layout in the image: Title top left, Big Orange Box bottom right */}
            <div className="bg-[#ff8c69] w-32 h-28 rounded-2xl border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
              <FaChartLine size={40} className="text-white" />
            </div>
            <div className="absolute bottom-6 left-6">
              <button className="bg-[#ff8c69] border-2 border-black text-black font-bold py-2 px-6 rounded-full flex items-center gap-2 hover:brightness-110">
                Visualizar <FaArrowRight />
              </button>
            </div>
          </div>
        )}

      </div>
    </Link>
  );
};

export default DashboardCard;
