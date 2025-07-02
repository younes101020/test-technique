import type { ReactNode } from "react";

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import { createEquipment, editEquipment, equipmentKeys, removeEquipment } from "@/features/equipments/lib/queries";

import { queryClient } from "../lib/http/react-query-client";

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

export function ReactQueryWithPersisterProvider({
  children,
}: {
  children: ReactNode;
}) {
  queryClient.setMutationDefaults(equipmentKeys.edit, {
    mutationFn: editEquipment,
  });
  queryClient.setMutationDefaults(equipmentKeys.delete, {
    mutationFn: removeEquipment,
  });
  queryClient.setMutationDefaults(equipmentKeys.add, {
    mutationFn: createEquipment,
  });
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
      onSuccess={() => {
        // resume mutations after initial restore from localStorage was successful
        queryClient.resumePausedMutations().then(() => {
          queryClient.invalidateQueries();
        });
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
