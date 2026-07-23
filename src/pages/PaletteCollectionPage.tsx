import { useNavigate } from 'react-router-dom';
import PaletteCollection from '@/features/PaletteCollection';
import type { Palette } from '@/features/PaletteCollection';
import { usePaletteStore } from '@/features/PaletteGenerator/stores';

const PaletteCollectionPage = () => {
  const navigate = useNavigate();
  const loadFromCollection = usePaletteStore((s) => s.loadFromCollection);

  const handleSelectPalette = (palette: Palette) => {
    loadFromCollection(palette.colors, palette.name);
    navigate('/palette-generator');
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <PaletteCollection onSelectPalette={handleSelectPalette} />
    </div>
  );
};

export default PaletteCollectionPage;
