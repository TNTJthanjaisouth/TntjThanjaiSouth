import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";
import {
  convertImageToBase64,
  saveImage,
  deleteImage,
  getImages,
} from "./services/imageservice";

export default function ImageManager() {
  const [headerImage, setHeaderImage] = useState("");
  const [footerImage, setFooterImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingHeader, setUploadingHeader] = useState(false);
  const [uploadingFooter, setUploadingFooter] = useState(false);

  const headerInputRef = useRef<HTMLInputElement>(null);
  const footerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const images = await getImages();
      setHeaderImage(images.header);
      setFooterImage(images.footer);
    } catch (error) {
      console.error("Error loading images:", error);
      toast.error("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, type: "header" | "footer") => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      if (type === "header") {
        setUploadingHeader(true);
      } else {
        setUploadingFooter(true);
      }

      const base64 = await convertImageToBase64(file);
      await saveImage(type, base64);

      if (type === "header") {
        setHeaderImage(base64);
      } else {
        setFooterImage(base64);
      }

      toast.success(
        `${type === "header" ? "Header" : "Footer"} image uploaded successfully`
      );
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error);
      toast.error("Failed to upload image");
    } finally {
      if (type === "header") {
        setUploadingHeader(false);
      } else {
        setUploadingFooter(false);
      }
    }
  };

  const handleDeleteImage = async (type: "header" | "footer") => {
    if (!confirm(`Are you sure you want to delete the ${type} image?`)) {
      return;
    }

    try {
      if (type === "header") {
        setUploadingHeader(true);
      } else {
        setUploadingFooter(true);
      }

      await deleteImage(type);

      if (type === "header") {
        setHeaderImage("");
      } else {
        setFooterImage("");
      }

      toast.success(
        `${type === "header" ? "Header" : "Footer"} image deleted successfully`
      );
    } catch (error) {
      console.error(`Error deleting ${type} image:`, error);
      toast.error("Failed to delete image");
    } finally {
      if (type === "header") {
        setUploadingHeader(false);
      } else {
        setUploadingFooter(false);
      }
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "header" | "footer"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, type);
    }
    e.target.value = "";
  };

  const ImageCard = ({
    title,
    image,
    type,
    uploading,
    inputRef,
  }: {
    title: string;
    image: string;
    type: "header" | "footer";
    uploading: boolean;
    inputRef: React.RefObject<HTMLInputElement>;
  }) => (
    <div className="bg-white rounded-lg  p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>

      <div className="space-y-4">
        {image ? (
          <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-48 object-contain bg-gray-50"
            />
            <div className="absolute top-2 right-2">
              <button
                onClick={() => handleDeleteImage(type)}
                className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition shadow-lg"
                disabled={uploading}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-400">
              <ImageIcon size={48} className="mx-auto mb-2" />
              <p>No image uploaded</p>
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, type)}
          className="hidden"
          disabled={uploading}
        />

        <button
          onClick={() => inputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
          disabled={uploading}
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload size={20} />
              {image ? "Replace Image" : "Upload Image"}
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-28">
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Image Manager</h2>
        <p className="text-gray-600 text-sm">
          Upload and manage header and footer images
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border  rounded-md">
        <ImageCard
          title="Header Image"
          image={headerImage}
          type="header"
          uploading={uploadingHeader}
          inputRef={headerInputRef}
        />
        <ImageCard
          title="Footer Image"
          image={footerImage}
          type="footer"
          uploading={uploadingFooter}
          inputRef={footerInputRef}
        />
      </div>
    </div>
  );
}
