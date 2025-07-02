import { onlineManager } from "@tanstack/react-query";

import { Label } from "@/components/ui/label";

import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

export function OnlineStateRadio() {
  const isOnline = onlineManager.isOnline();
  return (
    <RadioGroup defaultValue={isOnline ? "online" : "offline"}>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="online" id="r1" onClick={() => onlineManager.setOnline(true)} />
        <Label htmlFor="r1">Online</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="offline" id="r2" onClick={() => onlineManager.setOnline(false)} />
        <Label htmlFor="r2">Offline</Label>
      </div>
    </RadioGroup>

  );
}
