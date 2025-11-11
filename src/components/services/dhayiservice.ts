import {
  ref,
  update,
  get,
  db,
  push,
  remove,
} from "../../../Firebase/firebase.config";
import { DhayiName } from "../../types/index";

export const addDhayiName = async (
  name: string,
  sortOrder: number
): Promise<string> => {
  const dhayiRef = ref(db, "DHAYINAMES");
  const newDhayiRef = push(dhayiRef);

  const newDhayi = {
    dhayiname: name,
    sort_order: sortOrder,
    created_at: new Date().toISOString(),
  };

  await update(newDhayiRef, newDhayi);
  return newDhayiRef.key!;
};

export const updateDhayiName = async (
  id: string,
  name: string,
  sortOrder: number
): Promise<void> => {
  const dhayiRef = ref(db, `DHAYINAMES/${id}`);
  await update(dhayiRef, {
    dhayiname: name,
    sort_order: sortOrder,
  });
};

export const deleteDhayiName = async (id: string): Promise<void> => {
  const dhayiRef = ref(db, `DHAYINAMES/${id}`);
  await remove(dhayiRef);
};

export const getDhayiNames = async (): Promise<DhayiName[]> => {
  const dhayiRef = ref(db, "DHAYINAMES");
  const snapshot = await get(dhayiRef);

  if (!snapshot.exists()) {
    return [];
  }

  const dhayiObj = snapshot.val();
  return Object.entries(dhayiObj).map(([id, val]: [string, any]) => ({
    id,
    name: val.dhayiname,
    sort_order: val.sort_order ?? 0,
    created_at: val.created_at ?? "",
  }));
};
