import { useEffect, useState } from "react";
import { IconClock } from "@tabler/icons-react";
import { getFxRates } from "../../api/fx";

export default function FxStrip() {
  const [rates, setRates] = useState(null);
  const [fetchedAt, setFetchedAt] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getFxRates();
        setRates(data);
        setFetchedAt(new Date());
      } catch {
        // fail silently — strip just shows nothing
      }
    };
    fetch();
  }, []);

  const minutesAgo = fetchedAt
    ? Math.floor((Date.now() - fetchedAt.getTime()) / 60000)
    : null;

  return (
    <div className="px-5 py-2 border-b border-[#00c896]/20 bg-[#00c896]/5 flex gap-5 text-xs">
      {rates ? (
        <>
          <div>AUD/NPR <span className="text-[#00c896]">{rates.audNpr}</span></div>
          <div>AUD/USD <span className="text-[#00c896]">{rates.audUsd}</span></div>
          <div>USD/NPR <span className="text-[#00c896]">{rates.usdNpr}</span></div>
        </>
      ) : (
        <div className="text-[#5d7a9a]">Loading rates...</div>
      )}

      <div className="ml-auto flex items-center gap-1 text-[#5d7a9a]">
        <IconClock size={12} />
        {minutesAgo !== null
          ? minutesAgo === 0
            ? "FX just updated"
            : `FX cached ${minutesAgo} min ago`
          : "Fetching FX..."}
      </div>
    </div>
  );
}