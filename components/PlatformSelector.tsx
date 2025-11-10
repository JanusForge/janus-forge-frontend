'use client';

import { AIPlatform } from '@/types';

interface PlatformSelectorProps {
  platforms: AIPlatform[];
  selectedPlatforms: AIPlatform[];
  onPlatformsChange: (platforms: AIPlatform[]) => void;
}

export default function PlatformSelector({ 
  platforms, 
  selectedPlatforms, 
  onPlatformsChange 
}: PlatformSelectorProps) {
  const togglePlatform = (platform: AIPlatform) => {
    const isSelected = selectedPlatforms.some(p => p.id === platform.id);
    
    if (isSelected) {
      if (selectedPlatforms.length > 1) {
        onPlatformsChange(selectedPlatforms.filter(p => p.id !== platform.id));
      }
    } else {
      onPlatformsChange([...selectedPlatforms, platform]);
    }
  };

  const selectAll = () => {
    onPlatformsChange([...platforms]);
  };

  const clearAll = () => {
    if (selectedPlatforms.length > 1) {
      onPlatformsChange([selectedPlatforms[0]]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Select AI Platforms for Debate
        </h3>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md transition-colors"
          >
            Select All
          </button>
          <button
            onClick={clearAll}
            className="text-sm bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {platforms.map((platform) => {
          const isSelected = selectedPlatforms.some(p => p.id === platform.id);
          const isDisabled = isSelected && selectedPlatforms.length === 1;

          return (
            <button
              key={platform.id}
              onClick={() => togglePlatform(platform)}
              disabled={isDisabled}
              className={`
                p-3 rounded-lg border-2 transition-all text-left
                ${isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center gap-2">
                <div className={`
                  w-3 h-3 rounded-full border-2
                  ${isSelected ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-400'}
                `} />
                <span className="text-sm font-medium">{platform.name}</span>
              </div>
            </button>
          );
        })}
      </div>
      
      <p className="text-sm text-gray-500 text-center">
        {selectedPlatforms.length} platform(s) selected
      </p>
    </div>
  );
}
