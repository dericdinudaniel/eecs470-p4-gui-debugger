import React, { useState, useEffect } from "react";
import { useConstantsStore } from "@/lib/constants-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { constantsStore } from "@/lib/constants-store";

const ConstantsEditor: React.FC<{
  signalData: any;
}> = ({ signalData }) => {
  const { constants, setConstant, resetConstants, autoDetectConstants } =
    useConstantsStore();
  const [pendingValues, setPendingValues] = useState<Record<string, string>>(
    {}
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      const initialPending = Object.entries(constants).reduce(
        (acc, [key, value]) => {
          acc[key] = value.toString();
          return acc;
        },
        {} as Record<string, string>
      );
      setPendingValues(initialPending);
    }
  }, [constants, open]);

  const handleKeyDown =
    (key: string) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const newValue =
          pendingValues[key] === "" ? 0 : Number(pendingValues[key]);
        if (!isNaN(newValue)) {
          const oldValue = constants[key];
          setConstant(key, newValue);
          toast.success("Constant updated", {
            description: `${key}: ${oldValue} → ${newValue}`,
          });
        }
      }
    };

  const handleChange =
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setPendingValues((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));
    };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Constants</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1025px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center">
            Constants Editor
            <Button
              size={"sm"}
              className="ml-3 text-sm"
              onClick={() => {
                autoDetectConstants(signalData);
              }}
            >
              Auto Detect Constants
            </Button>
            <Button
              variant={"destructive"}
              size={"sm"}
              className="ml-3 text-sm"
              onClick={() => {
                resetConstants();
              }}
            >
              Reset Constants
            </Button>
            <Button
              size={"sm"}
              className="ml-3 text-sm"
              onClick={() => {
                console.log("Constants: ", constantsStore.getAll());
                toast.success("Constants logged", {
                  description: "All constants have been logged to the console",
                });
              }}
            >
              Log Constants
            </Button>
          </DialogTitle>
          <DialogDescription>
            Edit constants here. Press Enter to apply changes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-6 gap-x-6 gap-y-7 py-4">
          {Object.entries(constants)
            .sort()
            .map(([key, value]) => (
              <div key={key} className="flex flex-col space-y-2">
                <Label htmlFor={key} className="text-sm font-medium">
                  {key}
                </Label>
                <Input
                  id={key}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={pendingValues[key] ?? value.toString()}
                  onChange={handleChange(key)}
                  onKeyDown={handleKeyDown(key)}
                  className="w-full"
                />
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConstantsEditor;
