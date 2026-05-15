import React, { createContext, useContext, useState } from 'react';
import { HealthSnapshot } from './scoring';
import { DEFAULT_SNAPSHOT, PRESETS } from './simulator';

type Preset = 'peak' | 'normal' | 'rest';

interface DemoContextType {
  data:        HealthSnapshot;
  activePreset: Preset | null;
  setData:     React.Dispatch<React.SetStateAction<HealthSnapshot>>;
  applyPreset: (p: Preset) => void;
  patchField:  (key: keyof HealthSnapshot, value: number) => void;
}

const DemoContext = createContext<DemoContextType>({
  data:        DEFAULT_SNAPSHOT,
  activePreset: 'normal',
  setData:     () => {},
  applyPreset: () => {},
  patchField:  () => {},
});

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [data, setData]           = useState<HealthSnapshot>(DEFAULT_SNAPSHOT);
  const [activePreset, setPreset] = useState<Preset | null>('normal');

  const applyPreset = (p: Preset) => {
    setData({ ...PRESETS[p] });
    setPreset(p);
  };

  const patchField = (key: keyof HealthSnapshot, value: number) => {
    setData(prev => ({ ...prev, [key]: value }));
    setPreset(null);
  };

  return (
    <DemoContext.Provider value={{ data, activePreset, setData, applyPreset, patchField }}>
      {children}
    </DemoContext.Provider>
  );
}

export const useDemo = () => useContext(DemoContext);
