import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Upload,
  Trash2,
  Loader2,
  Link,
  ExternalLink,
  Pencil,
} from 'lucide-react';
import ImageComponent from '../componentGeneral/ImageComponent.jsx';
import useAuthAdminStore from '../../store/AuthAdminStore.js';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const SLOTS = [
  { key: 'left-large', label: 'Left Large', className: 'md:col-span-2' },
  { key: 'right-top', label: 'Right Top', className: '' },
  { key: 'right-bottom', label: 'Right Bottom', className: '' },
];

const CarouselUpload = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [linkInput, setLinkInput] = useState({});
  const [editingLink, setEditingLink] = useState(null);
  const [editLinkValue, setEditLinkValue] = useState('');
  const fileInputRefs = {
    'left-large': useRef(null),
    'right-top': useRef(null),
    'right-bottom': useRef(null),
  };
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuthAdminStore();

  const getImagesForSlot = (slotKey) =>
    (images || []).filter((img) => img.position === slotKey);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${apiUrl}/getallcarousel`);
        setImages(
          Array.isArray(response.data)
            ? response.data
            : response.data?.images || [],
        );
      } catch (error) {
        console.error('Error fetching images', error);
      }
    };
    fetchImages();
  }, [apiUrl]);

  const handleImageUpload = async (e, slotKey) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('imgSrc', file);
    formData.append('position', slotKey);
    if (linkInput[slotKey]) {
      formData.append('link', linkInput[slotKey]);
    }

    setUploadingSlot(slotKey);
    try {
      const response = await axios.post(`${apiUrl}/createcarousel`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.imgSrc) {
        setImages((prev) => [...prev, response.data]);
        setLinkInput((prev) => ({ ...prev, [slotKey]: '' }));
        toast.success(
          `Image added to ${SLOTS.find((s) => s.key === slotKey).label}`,
        );
      }
    } catch (error) {
      console.error('Error uploading image', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingSlot(null);
      if (e.target) e.target.value = '';
    }
  };

  const handleImageDelete = async (imageId) => {
    try {
      await axios.delete(`${apiUrl}/deletebyidcarousel/${imageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setImages((prev) => prev.filter((img) => img._id !== imageId));
      toast.success('Image deleted');
    } catch (error) {
      console.error('Error deleting image', error);
      toast.error('Failed to delete image');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleUpdateLink = async (imageId) => {
    try {
      const response = await axios.put(
        `${apiUrl}/updatecarousel/${imageId}`,
        { link: editLinkValue },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setImages((prev) =>
        prev.map((img) =>
          img._id === imageId ? { ...img, link: editLinkValue } : img,
        ),
      );
      toast.success('Link updated');
      setEditingLink(null);
    } catch (error) {
      console.error('Error updating link', error);
      toast.error('Failed to update link');
    }
  };

  return (
    <div className="p-6 shadow bg-white rounded-lg">
      <h1 className="border-l-4 primaryBorderColor primaryTextColor mb-6 pl-2 text-lg font-semibold">
        Manage Slider Images
      </h1>

      <div className="flex flex-col gap-6">
        {SLOTS.map((slot) => {
          const slotImages = getImagesForSlot(slot.key);
          const isUploading = uploadingSlot === slot.key;

          return (
            <div key={slot.key} className={slot.className}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-700">
                  {slot.label}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Link size={12} className="text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Link URL"
                      value={linkInput[slot.key] || ''}
                      onChange={(e) =>
                        setLinkInput((prev) => ({
                          ...prev,
                          [slot.key]: e.target.value,
                        }))
                      }
                      className="h-7 w-32 text-xs"
                    />
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-md transition">
                    <Upload size={14} />
                    Add
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, slot.key)}
                      className="hidden"
                      ref={fileInputRefs[slot.key]}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              {slotImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {slotImages.map((image) => (
                    <div
                      key={image._id}
                      className="relative group  overflow-hidden "
                    >
                      <ImageComponent
                        imageName={image.imgSrc}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                        {image.link && (
                          <a
                            href={image.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-full shadow transition"
                            aria-label="Open link"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                        <button
                          onClick={() => {
                            setEditingLink(image._id);
                            setEditLinkValue(image.link || '');
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-full shadow transition"
                          aria-label="Edit link"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(image._id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow transition"
                          aria-label={`Delete ${SLOTS.find((s) => s.key === slot.key).label} image`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {isUploading && (
                    <div className="aspect-[4/3] bg-gray-100 rounded-lg border flex items-center justify-center">
                      <Loader2 className="size-6 text-gray-400 animate-spin" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-[4/3] bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                  {isUploading ? (
                    <Loader2 className="size-6 text-gray-400 animate-spin" />
                  ) : (
                    <p className="text-xs text-gray-400">No images</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteTarget && handleImageDelete(deleteTarget)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingLink}
        onOpenChange={(open) => !open && setEditingLink(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Link</DialogTitle>
            <DialogDescription>
              Enter the URL for this carousel image.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="text"
            placeholder="https://example.com"
            value={editLinkValue}
            onChange={(e) => setEditLinkValue(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingLink(null)}>
              Cancel
            </Button>
            <Button onClick={() => handleUpdateLink(editingLink)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CarouselUpload;
