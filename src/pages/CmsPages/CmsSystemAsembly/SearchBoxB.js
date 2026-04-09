import React, { useContext, useEffect, useState } from 'react';
import { CmsSistemAssembly } from '../../../context/CmsContext';
import './CmsSystemAsembly.css'
export default function SearchBoxB({ array, placeholder, id, onPriceChange }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTermPrice, setSearchTermPrice] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    let { resetSearchbox } = useContext(CmsSistemAssembly);
console.log(searchTermPrice)
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setShowOptions(true);
        setActiveIndex(-1); // Reset active index when search term changes
    };

    const handleOptionClick = (item) => {
        setShowOptions(false);
        setActiveIndex(-1);
        if (id === 'manufacturerNameForAdd') {
            console.log(Number(item.price))
            setSearchTerm(item.name);
            setSearchTermPrice(item.price);
            onPriceChange((Number((item.price).replace(/,/g, '')))*1000 || 0); // گزارش مقدار به والد
        }
    };

    const handleManualPriceChange = (e) => {
        const manualPrice = e.target.value.replace(/[^0-9]/g, ''); // فقط اعداد مجاز
        setSearchTermPrice(manualPrice);
        onPriceChange(Number(manualPrice) || 0); // گزارش مقدار به والد
    };

    const filteredCategoryItems = array?.filter((item) =>
        id === 'manufacturerNameForAdd' ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) : ''
    );

    useEffect(() => {
      
            setSearchTerm('');
            setSearchTermPrice('');
    }, [resetSearchbox]);
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
          // Move down in the list
          if(showOptions)
          setActiveIndex(prevIndex => (prevIndex < filteredCategoryItems.length - 1 ? prevIndex + 1 : prevIndex));
        } else if (e.key === 'ArrowUp') {
          // Move up in the list
          setActiveIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
        } else if (e.key === 'Enter' && activeIndex >= 0) {
          // Select the active item
          handleOptionClick(filteredCategoryItems[activeIndex]);
          e.preventDefault();
        }
      };
      useEffect(() => {
        if (showOptions) {
          document.addEventListener('keydown', handleKeyDown);
        } else {
          document.removeEventListener('keydown', handleKeyDown);
        }
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
        };
      }, [showOptions, activeIndex, filteredCategoryItems]);
    return (
        <div className="dropdown-containerB">
            <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowOptions(true)}
                onBlur={() => setTimeout(() => setShowOptions(false), 100)}
            />
            <input
            className='sistemAssembly-input2'
                type="text"
                placeholder={searchTermPrice}
                value={searchTermPrice}
                onChange={handleManualPriceChange} // مدیریت تغییر دستی قیمت
            />
            {showOptions && (
                <div className="dropdown-options">
                    {filteredCategoryItems?.length > 0 ? (
                        filteredCategoryItems?.map((item, index) => (
                            <div
                                key={item.id}
                                className={`dropdown-optionB ${index === activeIndex ? 'active' : ''}`}
                                onMouseDown={() => {
                                    handleOptionClick(item);
                                }}
                            >
                                {id === 'manufacturerNameForAdd' ? `${item.name}**${item.price}`    : ''}
                            </div>
                        ))
                    ) : (
                        <div className="dropdown-optionB">موردی پیدا نشد...</div>
                    )}
                </div>
            )}
        </div>
    );
}
