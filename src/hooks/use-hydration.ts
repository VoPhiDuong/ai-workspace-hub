import { useEffect, useState } from 'react';

/**
 * Hook để đảm bảo component chỉ render sau khi hydration hoàn tất
 */
export function useHydration() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
} 