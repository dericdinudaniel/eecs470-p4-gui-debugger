"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md m-10">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Verilog Debugger
        </h1>
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors mb-4"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the file here ...</p>
          ) : (
            <p>Drag and drop a .vcd file here, or click to select a file</p>
          )}
        </div>
        <div className="mt-4">
          <label
            htmlFor="pasteInput"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Or paste file contents:
          </label>
          <textarea
            id="pasteInput"
            value={fileContent}
            onChange={(e) => setFileContent(e.target.value)}
            className="w-full h-32 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Paste .vcd file contents here"
          />
          <button
            onClick={handleParseContent}
            className="mt-2 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Parse VCD Content
          </button>

          {/* local file */}
          <input
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
            className="w-full mt-10 h-12 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Or upload a .vcd to /uploads, and put filename here"
          />
          <button
            onClick={handleParseLocalFile}
            className="mt-2 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Parse Local File
          </button>
        </div>
      </div>
    </div>
  );
}
