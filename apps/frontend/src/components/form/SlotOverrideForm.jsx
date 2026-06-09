"use client";

import { useForm } from "react-hook-form";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

export default function SlotOverrideForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const isClosed = watch("isClosed");

  const submitHandler = async (data) => {
    await onSubmit?.(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">

      {/* Date */}
      <InputField
        label="Date"
        type="date"
        error={errors.date?.message}
        {...register("date", { required: "Date required" })}
      />

      {/* 🔥 Start Time (24-hour only) */}
      <InputField
        label="Start Time"
        placeholder="HH:mm (e.g. 14:00)"
        error={errors.startTime?.message}
        {...register("startTime", {
          required: "Start time required",
          pattern: {
            value: /^([01]\d|2[0-3]):([0-5]\d)$/,
            message: "Use 24-hour format (HH:mm)",
          },
        })}
      />

      {/* Capacity */}
      {!isClosed && (
        <InputField
          label="Override Capacity"
          type="number"
          error={errors.capacity?.message}
          {...register("capacity", {
            valueAsNumber: true,
          })}
        />
      )}

      {/* Close Toggle */}
      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("isClosed")} />
        <label className="text-sm text-gray-700">
          Mark slot as Closed
        </label>
      </div>

      {/* Button */}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="submit"
          text={isSubmitting ? "Saving..." : "Save Override"}
        />
      </div>

    </form>
  );
}