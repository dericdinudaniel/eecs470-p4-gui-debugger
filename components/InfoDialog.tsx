import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Info</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            System on Chimp Debugger
          </DialogTitle>
          <DialogDescription>
            Built by{" "}
            <a
              href="https://deric.dev/"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-fade"
            >
              Deric Dinu Daniel
            </a>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>
            <span className="p-1 rounded-lg bg-good">Green</span> is valid,
            <span className="p-1 rounded-lg bg-bad">red</span> is invalid.
            Except for free list, green means free.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
