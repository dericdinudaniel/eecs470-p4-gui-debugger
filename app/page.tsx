"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const [fileContent, setFileContent] = useState("");
  const [localFilename, setLocalFilename] = useState("");
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
    };
    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/vcd": [".vcd"] },
    multiple: false,
  });

  const handleParseContent = async () => {
    if (!fileContent) {
      alert("Please drop a file or paste content before parsing.");
      return;
    }

    try {
      const response = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileContent }),
      });
      const data = await response.json();
      router.push(
        `/debugger?headerInfo=${encodeURIComponent(JSON.stringify(data))}`
      );
    } catch (error) {
      console.error("Error parsing file:", error);
    }
  };

  const handleParseLocalFile = async () => {
    if (!localFilename) {
      alert("Please enter a filename before parsing.");
      return;
    }

    //  just send the filename as a string to the server
    try {
      const response = await fetch("/api/parse_local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ localFilename }),
      });
      const data = await response.json();
      router.push(
        `/debugger?headerInfo=${encodeURIComponent(JSON.stringify(data))}`
      );
    } catch (error) {
      console.error("Error parsing file:", error);
    }
  };

  return (
    <div className="min-h-screen bg-card/50 flex items-center justify-center">
      <div className="bg-background p-8 rounded-lg shadow-md m-10 w-full max-w-4xl">
        <div className="flex justify-center space-x-2">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Verilog Debugger
          </h1>
          <ThemeToggle />
        </div>
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-border/50 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors mb-4"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the file here ...</p>
          ) : (
            <p>Drag and drop a .vcd file here, or click to select a file</p>
          )}
        </div>
        <div className="mt-4 w-full">
          <label
            htmlFor="pasteInput"
            className="block text-sm font-medium mb-2"
          >
            Or paste file contents:
          </label>
          <Textarea
            id="pasteInput"
            value={fileContent}
            onChange={(e) => setFileContent(e.target.value)}
            className="h-32"
            placeholder="Paste .vcd file contents here"
          />
          <Button onClick={handleParseContent} className="w-full mt-2">
            Parse VCD Content
          </Button>

          {/* local file */}
          <Input
            type="text"
            name="localFilename"
            value={localFilename}
            onChange={(e) => setLocalFilename(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Prevent form submission if wrapped in a form
                handleParseLocalFile();
              }
            }}
            className="mt-8 h-12"
            placeholder="Or upload a .vcd to /uploads, and put filename (no '.vcd') here"
          />
          <Button onClick={handleParseLocalFile} className="w-full mt-2">
            Parse Local File
          </Button>
        </div>
      </div>
    </div>
  );
}
