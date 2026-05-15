

import { IconClock } from "@tabler/icons-react";

export default function FxStrip() {
  return (
    <div className="px-5 py-2 border-b border-[#00c896]/20 bg-[#00c896]/5 flex gap-5 text-xs">
      <div>AUD/NPR <span className="text-[#00c896]">90.42</span></div>
      <div>AUD/USD <span className="text-[#00c896]">0.6315</span></div>
      <div>USD/NPR <span className="text-[#00c896]">143.21</span></div>

      <div className="ml-auto flex items-center gap-1 text-[#5d7a9a]">
        <IconClock size={12} />
        FX cached 48 min ago
      </div>
    </div>
  );
}