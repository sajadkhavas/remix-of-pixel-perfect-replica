"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

type SheetOverlayElement = React.ElementRef<typeof SheetPrimitive.Overlay>;
type SheetOverlayProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>;
type SheetContentElement = React.ElementRef<typeof SheetPrimitive.Content>;
type SheetPrimitiveContentProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>;
type SheetTitleElement = React.ElementRef<typeof SheetPrimitive.Title>;
type SheetTitleProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>;
type SheetDescriptionElement = React.ElementRef<typeof SheetPrimitive.Description>;
type SheetDescriptionProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>;

const SheetOverlay = React.forwardRef<SheetOverlayElement, SheetOverlayProps>(
  ({ className, ...props }, ref) => (
    <SheetPrimitive.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-[var(--z-overlay)] bg-background-overlay backdrop-blur-[var(--blur-overlay)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  ),
);
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  "fixed z-[var(--z-overlay)] flex gap-4 bg-background-elevated p-6 text-text-primary shadow-[var(--shadow-elevated)] outline-none",
  {
    variants: {
      side: {
        top:
          "inset-x-0 top-0 flex-col border-b data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:animate-in data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 flex-col border-t pb-[max(1.5rem,env(safe-area-inset-bottom))] data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom",
        start: "ds-sheet-start h-full w-[min(92vw,24rem)] flex-col",
        end: "ds-sheet-end h-full w-[min(92vw,24rem)] flex-col",
        left:
          "inset-y-0 left-0 h-full w-[min(92vw,24rem)] flex-col border-r data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:animate-in data-[state=open]:slide-in-from-left",
        right:
          "inset-y-0 right-0 h-full w-[min(92vw,24rem)] flex-col border-l data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:animate-in data-[state=open]:slide-in-from-right",
      },
    },
    defaultVariants: {
      side: "end",
    },
  },
);

type SheetVariantProps = VariantProps<typeof sheetVariants>;

interface SheetContentProps extends SheetPrimitiveContentProps, SheetVariantProps {}

const SheetContent = React.forwardRef<SheetContentElement, SheetContentProps>(
  ({ side = "end", className, children, ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        <SheetPrimitive.Close asChild>
          <IconButton
            label="بستن"
            variant="ghost"
            size="icon"
            className="absolute end-3 top-3 text-text-secondary hover:text-text-primary"
          >
            <X />
          </IconButton>
        </SheetPrimitive.Close>
        {children}
      </SheetPrimitive.Content>
    </SheetPortal>
  ),
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-2 pe-10 text-start", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<SheetTitleElement, SheetTitleProps>(
  ({ className, ...props }, ref) => (
    <SheetPrimitive.Title
      ref={ref}
      className={cn("text-lg font-semibold leading-snug text-text-primary", className)}
      {...props}
    />
  ),
);
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<SheetDescriptionElement, SheetDescriptionProps>(
  ({ className, ...props }, ref) => (
    <SheetPrimitive.Description
      ref={ref}
      className={cn("text-sm leading-relaxed text-text-secondary", className)}
      {...props}
    />
  ),
);
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
