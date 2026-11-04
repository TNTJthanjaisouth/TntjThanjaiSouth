import { ref, update, get, db } from "../../../Firebase/firebase.config";

export const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const saveImage = async (
  type: "header" | "footer",
  base64: string
): Promise<void> => {
  const imageRef = ref(db, `IMAGES/${type}`);
  await update(ref(db, "IMAGES"), { [type]: base64 });
};

export const deleteImage = async (type: "header" | "footer"): Promise<void> => {
  const imageRef = ref(db, `IMAGES/${type}`);
  await update(ref(db, "IMAGES"), { [type]: "" });
};

export const getImages = async (): Promise<{
  header: string;
  footer: string;
}> => {
  const imageRef = ref(db, "IMAGES");
  const snapshot = await get(imageRef);

  if (!snapshot.exists()) {
    return { header: "", footer: "" };
  }

  const imgData = snapshot.val();
  return {
    header: imgData.header || "",
    footer: imgData.footer || "",
  };
};
