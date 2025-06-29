import React from "react";
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
import { MdArrowForward } from "react-icons/md";

interface QuotationFormProps {
  dialogTriggerContent?: string;
  dialogTitle?: string;
  dialogDescription?: string;
}

const QuotationForm: React.FC<QuotationFormProps> = ({
  dialogTriggerContent,
  dialogTitle,
  dialogDescription,
}) => {
  return (
    <Dialog>
      <form
        action="/api/quotation"
        method="POST"
        onSubmit={(e) => {
          e.preventDefault();
          // Later you’ll integrate react-hook-form & Sanity submission logic here
        }}
      >
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

          <div className="grid gap-4 py-4">
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
                required
                id="name"
                name="name"
                placeholder="John Doe"
                className="border p-2 rounded w-full"
              />
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <label htmlFor="email">Email</label>
              <input
                required
                type="email"
                id="email"
                name="email"
                placeholder="john@example.com"
                className="border p-2 rounded w-full"
              />
            </div>

            {/* Phone */}
            <div className="grid gap-2">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+966 5X XXX XXXX"
                className="border p-2 rounded w-full"
              />
            </div>

            {/* Address */}
            <fieldset className="grid gap-2">
              <legend className="font-semibold mb-1">Address</legend>

              <input
                required
                name="address.line1"
                placeholder="Address Line 1"
                className="border p-2 rounded w-full"
              />
              <input
                name="address.line2"
                placeholder="Address Line 2 (optional)"
                className="border p-2 rounded w-full"
              />
              <input
                required
                name="address.city"
                placeholder="City"
                className="border p-2 rounded w-full"
              />
              <input
                required
                name="address.postalCode"
                placeholder="Postal Code"
                className="border p-2 rounded w-full"
              />
              <input
                name="address.country"
                placeholder="Country (optional)"
                className="border p-2 rounded w-full"
              />
            </fieldset>

            {/* Notes */}
            <div className="grid gap-2">
              <label htmlFor="notes">Additional Notes</label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Tell us if you have special requirements..."
                className="border p-2 rounded w-full"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default QuotationForm;
