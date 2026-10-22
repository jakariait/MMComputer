import React, { useEffect, useState } from 'react';
import ImageComponent from '../componentGeneral/ImageComponent.jsx';
import useAuthAdminStore from '../../store/AuthAdminStore.js';
import useGeneralInfoStore from '../../store/GeneralInfoStore.js';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Trash2, ImagePlus } from 'lucide-react';
import { SectionHeader } from '@/component/componentAdmin/SectionHeader.jsx';

const ImageUploadCard = ({ label, name, preview, existing, onChange }) => (
  <div className="space-y-3">
    <div className="aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted/20">
      {preview || existing ? (
        <ImageComponent
          imageName={preview || existing}
          className="w-full h-full object-contain"
          altName={label}
          skeletonHeight={140}
        />
      ) : (
        <div className="flex flex-col items-center gap-1 text-muted-foreground">
          <ImagePlus className="size-8" />
          <span className="text-xs">No image</span>
        </div>
      )}
    </div>
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type="file"
        name={name}
        onChange={onChange}
        accept="image/*"
        className="mt-1"
      />
    </div>
  </div>
);

const ArrayFieldSection = ({
  label,
  fields,
  fieldName,
  onArrayChange,
  onAdd,
  onRemove,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">{label}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {fields.map((value, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            aria-label={`${label} ${index + 1}`}
            value={value}
            onChange={(e) => onArrayChange(index, fieldName, e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
          {index > 0 && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => onRemove(index, fieldName)}
              aria-label={`Remove ${label} entry ${index + 1}`}
            >
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onAdd(fieldName)}>
        <Plus className="size-4 mr-1" />
        Add More
      </Button>
    </CardContent>
  </Card>
);

const TextField = ({ label, name, value, onChange, placeholder }) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    <Input
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder || `Enter ${label.toLowerCase()}`}
    />
  </div>
);

export default function GeneralInfoForm() {
  const { token } = useAuthAdminStore();
  const { GeneralInfoList, GeneralInfoUpdate } = useGeneralInfoStore();

  const [formData, setFormData] = useState({
    CompanyName: '',
    SalesPhone: [''],
    ServicePhone: [''],
    HotlinePhone: [''],
    CompanyEmail: [''],
    CompanyAddress: '',
    GoogleMapLink: '',
    WhatsAppNumber: '',
    WhatsAppNumberActive: false,
    FooterCopyright: '',
  });

  const [files, setFiles] = useState({
    PrimaryLogo: null,
    SecondaryLogo: null,
    Favicon: null,
  });

  const [previews, setPreviews] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (GeneralInfoList) {
      setFormData((prev) => ({
        ...prev,
        ...GeneralInfoList,
        SalesPhone: GeneralInfoList.SalesPhone || [''],
        ServicePhone: GeneralInfoList.ServicePhone || [''],
        HotlinePhone: GeneralInfoList.HotlinePhone || [''],
        CompanyEmail: GeneralInfoList.CompanyEmail || [''],
        WhatsAppNumber: GeneralInfoList.WhatsAppNumber || '',
        WhatsAppNumberActive: GeneralInfoList.WhatsAppNumberActive || false,
      }));

      setFiles({
        PrimaryLogo: GeneralInfoList.PrimaryLogo || null,
        SecondaryLogo: GeneralInfoList.SecondaryLogo || null,
        Favicon: GeneralInfoList.Favicon || null,
      });
    }
  }, [GeneralInfoList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    setFiles((prev) => ({ ...prev, [name]: file }));
    if (file) {
      setPreviews((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
    } else {
      setPreviews((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => {
        if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  const toArray = (value) =>
    Array.isArray(value) ? value : value ? [value] : [''];

  const handleArrayChange = (index, field, value) => {
    setFormData((prev) => {
      const newArray = [...toArray(prev[field])];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...toArray(prev[field]), ''],
    }));
  };

  const removeArrayField = (index, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: toArray(prev[field]).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData();

    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        form.append(key, formData[key].join(','));
      } else if (typeof formData[key] === 'boolean') {
        form.append(key, String(formData[key]));
      } else if (formData[key]) {
        form.append(key, formData[key]);
      }
    });

    Object.keys(files).forEach((key) => {
      if (files[key] && files[key] instanceof File) {
        form.append(key, files[key]);
      }
    });

    const result = await GeneralInfoUpdate(form, token);

    if (result.success) {
      toast.success('General information updated successfully!');
    } else {
      if (result.status === 403) {
        toast.warning(
          'You do not have permission to perform this action. (403 Forbidden)',
        );
      } else {
        toast.error('Failed to update general information.');
      }
    }

    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title={'General Information'}
        description={
          'Manage your company details, logos, and contact information.'
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Brand Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ImageUploadCard
                label="Primary Logo"
                name="PrimaryLogo"
                preview={previews.PrimaryLogo}
                existing={formData.PrimaryLogo}
                onChange={handleFileChange}
              />
              <ImageUploadCard
                label="Secondary Logo"
                name="SecondaryLogo"
                preview={previews.SecondaryLogo}
                existing={formData.SecondaryLogo}
                onChange={handleFileChange}
              />
              <ImageUploadCard
                label="Favicon"
                name="Favicon"
                preview={previews.Favicon}
                existing={formData.Favicon}
                onChange={handleFileChange}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ArrayFieldSection
            label="Sales Phone"
            fields={formData.SalesPhone}
            fieldName="SalesPhone"
            onArrayChange={handleArrayChange}
            onAdd={addArrayField}
            onRemove={removeArrayField}
          />
          <ArrayFieldSection
            label="Service Phone"
            fields={formData.ServicePhone}
            fieldName="ServicePhone"
            onArrayChange={handleArrayChange}
            onAdd={addArrayField}
            onRemove={removeArrayField}
          />
          <ArrayFieldSection
            label="Hotline Phone"
            fields={formData.HotlinePhone}
            fieldName="HotlinePhone"
            onArrayChange={handleArrayChange}
            onAdd={addArrayField}
            onRemove={removeArrayField}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ArrayFieldSection
            label="Company Emails"
            fields={formData.CompanyEmail}
            fieldName="CompanyEmail"
            onArrayChange={handleArrayChange}
            onAdd={addArrayField}
            onRemove={removeArrayField}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Company Name"
                name="CompanyName"
                value={formData.CompanyName}
                onChange={handleChange}
                placeholder="Your company name"
              />
            </div>
            <TextField
              label="Company Address"
              name="CompanyAddress"
              value={formData.CompanyAddress}
              onChange={handleChange}
              placeholder="Full company address"
            />
            <TextField
              label="Google Map Link"
              name="GoogleMapLink"
              value={formData.GoogleMapLink}
              onChange={handleChange}
              placeholder="Google Maps embed URL"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>WhatsApp</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TextField
              label="WhatsApp Number"
              name="WhatsAppNumber"
              value={formData.WhatsAppNumber}
              onChange={handleChange}
              placeholder="e.g. +8801XXXXXXXXX"
            />
            <div className="space-y-2">
              <Label htmlFor="WhatsAppNumberActive">
                WhatsApp Number Active
              </Label>
              <div className="flex items-center gap-2">
                <Switch
                  id="WhatsAppNumberActive"
                  checked={formData.WhatsAppNumberActive}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      WhatsAppNumberActive: checked,
                    }))
                  }
                />
                <span className="text-sm text-muted-foreground">
                  {formData.WhatsAppNumberActive
                    ? 'Displayed to visitors'
                    : 'Hidden from visitors'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update General Info'}
          </Button>
        </div>
      </form>
    </div>
  );
}
