"use client";

import { useForm } from "react-hook-form";
import {
  MapPin,
  FileText,
  Upload,
  X,
  ImageIcon,
  Globe,
  Plus,
} from "lucide-react";
import Button from "../ui/Button";
import InputField from "../ui/InputField";
import { useEffect, useState } from "react";
import TextareaField from "../ui/TextareaField";
import dynamic from "next/dynamic";

const MapPicker = dynamic(
  () => import("@/components/common/MapPicker"),
  {
    ssr: false,
  }
);
export default function AddPlaceForm({
  submitText = "Save Place",
  defaultValues = {},
  onSubmit,
  onCancel,
}) {
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      location: "",
      shortDescription: "",
      description: "",
      latitude: "",
      longitude: "",
      ...defaultValues,
    },
  });

  const selectedImage = watch("image");

  useEffect(() => {
    if (selectedImage && selectedImage instanceof File) {
      const url = URL.createObjectURL(selectedImage);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof selectedImage === "string") {
      setPreview(selectedImage);
    } else {
      setPreview(null);
    }
  }, [selectedImage]);

  const handleFormSubmit = async (data) => {
    await onSubmit?.(data);
    reset();
    setPreview(null);
  };

  useEffect(() => {
  if (defaultValues) {
    reset({
      name: defaultValues.name || "",
      location: defaultValues.location || "",
      latitude: defaultValues.latitude || "",
      longitude: defaultValues.longitude || "",
      shortDescription: defaultValues.shortDescription || "",
      description: defaultValues.description || "",
    });
  }
}, [defaultValues, reset]);

  return (
    <div className="w-full bg-white p-6">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">

        {/* Name + Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Place Name"
            icon={MapPin}
            error={errors.name?.message}
            {...register("name", { required: "Place name is required" })}
          />

          <InputField
            label="Location"
            icon={Globe}
            error={errors.location?.message}
            {...register("location", { required: "Location is required" })}
          />
        </div>

        {/* Latitude + Longitude */}
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Latitude"
            placeholder="e.g. 27.1751"
            error={errors.latitude?.message}
            {...register("latitude", {
              required: "Latitude required",
              valueAsNumber: true,
            })}
          />

          <InputField
            label="Longitude"
            placeholder="e.g. 78.0421"
            error={errors.longitude?.message}
            {...register("longitude", {
              required: "Longitude required",
              valueAsNumber: true,
            })}
          />
        </div>
        <div className="space-y-2">
  <label className="text-sm font-semibold text-slate-700">
    Select Location on Map
  </label>

  <MapPicker
    setLatitude={(lat) => setValue("latitude", lat)}
    setLongitude={(lng) => setValue("longitude", lng)}
  />
</div>

        {/* Short Description */}
        <TextareaField
          label="Short Description"
          placeholder="Min 150 characters..."
          error={errors.shortDescription?.message}
          {...register("shortDescription", {
            minLength: {
              value: 150,
              message: "Minimum 150 characters",
            },
          })}
        />

        {/* Full Description */}
        <TextareaField
          label="Full Description"
          placeholder="Min 250 characters..."
          error={errors.description?.message}
          {...register("description", {
            minLength: {
              value: 250,
              message: "Minimum 250 characters",
            },
          })}
        />

     

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            text="Cancel"
            onClick={onCancel || (() => reset())}
          />
          <Button
          icon={Plus}
            iconPosition="left"
            type="submit"
            text={isSubmitting ? "Saving..." : submitText}
          />
        </div>

      </form>
    </div>
  );
}