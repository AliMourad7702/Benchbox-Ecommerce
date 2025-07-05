"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useBasket } from "@/hooks/useBasket";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { MdArrowForward } from "react-icons/md";

interface QuotationFormProps {
  dialogTriggerContent?: string;
  dialogTitle?: string;
  dialogDescription?: string;
}

// TODO check the quotation sample pdf and adjust fields accordingly
// TODO after checking fields, enable emailing logic

type QuotationFormData = {
  name: string;
  email: string;
  phone?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    postalCode: string;
    country?: string;
  };
  notes?: string;
};

const QuotationForm: React.FC<QuotationFormProps> = ({
  dialogTriggerContent,
  dialogTitle,
  dialogDescription,
}) => {
  const { register, handleSubmit, reset } = useForm<QuotationFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: {
        line1: "",
        line2: "",
        city: "",
        postalCode: "",
        country: "",
      },
      notes: "",
    },
  });

  const { productsInBasket, basketTotalPrice, handleClearBasket } = useBasket();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      reset((prev) => ({
        ...prev,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: user.primaryEmailAddress?.emailAddress || "",
        // Optionally fill more fields here if stored in user.publicMetadata
      }));
    }
  }, [user, reset]);

  const onSubmit: SubmitHandler<QuotationFormData> = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/quotation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          isGuest: true,
          items: productsInBasket,
          totalPrice: basketTotalPrice,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to submit quote");
        throw new Error("Failed to submit quote");
      }

      setSubmitted(true);
      toast.success("Quote submitted successfully");
      handleClearBasket();
      reset();
    } catch (error) {
      toast.error("An error occured while submitting");
      console.error("Error submitting quote:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full max-w-[200px]">
          {dialogTriggerContent || "Request Quote"}
          <MdArrowForward className="ml-1" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[95vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>{dialogTitle || "Quotation Request"}</DialogTitle>
          <DialogDescription>
            {dialogDescription ||
              "Fill in your details and we'll get back to you shortly."}
          </DialogDescription>
        </DialogHeader>

        {!submitted && (
          <form
            className="grid gap-4 py-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Notice */}
            <div className="text-sm text-muted-foreground bg-muted/30 p-2 rounded">
              <strong>Note:</strong> Additional fees may apply for delivery and
              installation services. Exact costs will be confirmed after
              reviewing your quotation request.
            </div>

            {/* Name */}
            <div className="grid gap-2">
              <label htmlFor="name">Name</label>
              <input
                {...register("name", { required: true })}
                id="name"
                placeholder="John Doe"
                className="border p-2 rounded w-full"
              />
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <label htmlFor="email">Email</label>
              <input
                {...register("email", { required: true })}
                type="email"
                id="email"
                placeholder="john@example.com"
                className="border p-2 rounded w-full"
              />
            </div>

            {/* Phone */}
            <div className="grid gap-2">
              <label htmlFor="phone">Phone Number</label>
              <input
                {...register("phone")}
                type="tel"
                id="phone"
                placeholder="+966 5X XXX XXXX"
                className="border p-2 rounded w-full"
              />
            </div>

            {/* Address */}
            <fieldset className="grid gap-2">
              <legend className="font-semibold mb-1">Address</legend>

              <input
                {...register("address.line1", { required: true })}
                placeholder="Address Line 1"
                className="border p-2 rounded w-full"
              />
              <input
                {...register("address.line2")}
                placeholder="Address Line 2 (optional)"
                className="border p-2 rounded w-full"
              />
              <input
                {...register("address.city", { required: true })}
                placeholder="City"
                className="border p-2 rounded w-full"
              />
              <input
                {...register("address.postalCode", { required: true })}
                placeholder="Postal Code"
                className="border p-2 rounded w-full"
              />
              <input
                {...register("address.country")}
                placeholder="Country (optional)"
                className="border p-2 rounded w-full"
              />
            </fieldset>

            {/* Notes */}
            <div className="grid gap-2">
              <label htmlFor="notes">Additional Notes</label>
              <textarea
                {...register("notes")}
                id="notes"
                placeholder="Tell us if you have special requirements or delivery needs..."
                className="border p-2 rounded w-full"
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuotationForm;
