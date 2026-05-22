'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function PreferenceEditor({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [settings, setSettings] = useState(initialSettings || {});

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">User Preferences</h3>
      <div className="space-y-2">
        <label className="text-sm block">Remote Preference</label>
        <select
           className="w-full p-2 border rounded"
           value={settings.remote}
           onChange={(e) => setSettings({...settings, remote: e.target.value})}
        >
          <option value="remote">Fully Remote</option>
          <option value="hybrid">Hybrid</option>
          <option value="onsite">On-site</option>
        </select>
      </div>
      <Button variant="outline" className="w-full">Save Preferences</Button>
    </div>
  );
}
