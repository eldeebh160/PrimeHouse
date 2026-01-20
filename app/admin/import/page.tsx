"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { importProductsFromExcel } from "./actions"; // We'll create this server action next
import Link from "next/link";

export default function ImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [extraImages, setExtraImages] = useState<File[]>([]);
    const [preview, setPreview] = useState<any[]>([]);
    const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setStatus("idle");

            // Read and preview
            const data = await selectedFile.arrayBuffer();
            const workbook = XLSX.read(data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet).slice(0, 5); // Preview first 5
            setPreview(jsonData);
        }
    };

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles) {
            setExtraImages(Array.from(selectedFiles));
        }
    };

    const handleUpload = async () => {
        if (!file && extraImages.length === 0) return;

        setStatus("uploading");
        try {
            const formData = new FormData();
            if (file) formData.append("file", file);
            extraImages.forEach(img => {
                formData.append("extraImages", img);
            });

            // Server Action call
            const result = await importProductsFromExcel(formData);

            if (result.success) {
                setStatus("success");
                setMessage(`Successfully processed ${result.count} items.`);
                setExtraImages([]);
                setFile(null);
                setPreview([]);
            } else {
                setStatus("error");
                setMessage(result.error || "Upload failed");
            }
        } catch (e) {
            setStatus("error");
            setMessage("An unexpected error occurred.");
        }
    };

    return (
        <div className="max-w-4xl space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <Link href="/admin" className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 text-muted-foreground hover:text-black transition-colors">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
                <h1 className="font-heading text-3xl font-bold text-black">Product Bulk Porter</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1. Upload Sheet */}
                <div className="space-y-4">
                    <h3 className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Step 1: Spreadsheet (Optional)</h3>
                    <div className="bg-background border-2 border-dashed border-border p-8 rounded-sm flex flex-col items-center justify-center text-center space-y-4 hover:border-black transition-colors relative h-48">
                        <div className="p-3 bg-secondary rounded-full">
                            <FileSpreadsheet className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">{file ? file.name : "Select Excel/CSV"}</h3>
                            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter">Click to browse or drag & drop</p>
                        </div>
                        <input
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                </div>

                {/* 2. Upload Images */}
                <div className="space-y-4">
                    <h3 className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Step 2: Images (Optional)</h3>
                    <div className="bg-background border-2 border-dashed border-border p-8 rounded-sm flex flex-col items-center justify-center text-center space-y-4 hover:border-black transition-colors relative h-48">
                        <div className="p-3 bg-secondary rounded-full">
                            <Upload className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">{extraImages.length > 0 ? `${extraImages.length} images selected` : "Bulk Image Upload"}</h3>
                            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter">Matches product name to filename</p>
                        </div>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImagesChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* Guide */}
            <div className="bg-black text-white p-6 rounded-sm">
                <div className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-[0.2em] mb-4 text-white/60">
                    <CheckCircle className="w-4 h-4" />
                    Matching Logic
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <p className="text-sm leading-relaxed text-white/80">
                        Upload your spreadsheet and/or a batch of images. If an image filename (e.g. <code className="bg-white/10 px-1 rounded">Modern Chair.jpg</code>) matches a product name, it will be automatically linked. You can upload multiple images per product.
                    </p>
                    <div className="text-[10px] space-y-2 uppercase tracking-widest font-bold">
                        <p className="text-white/40">Spreadsheet Columns (Order Matters):</p>
                        <ul className="grid grid-cols-2 gap-2 text-[#9eff00]">
                            <li>1. name</li>
                            <li>2. price</li>
                            <li>3. sale_price</li>
                            <li>4. category</li>
                            <li>5. description</li>
                            <li>6. image_url</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Preview & Action */}
            {(file || extraImages.length > 0) && (
                <div className="space-y-4 fade-in-up border-t pt-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-bold">Ready to Process</h3>
                            <p className="text-xs text-muted-foreground">
                                {file ? `${file.name} • ` : ""}
                                {extraImages.length} images to be matched
                            </p>
                        </div>
                        {status !== "uploading" && (
                            <button onClick={handleUpload} className="bg-black text-white px-10 py-4 uppercase font-bold text-xs tracking-widest hover:bg-neutral-800 transition-all active:scale-95 shadow-xl">
                                Confirm & Process
                            </button>
                        )}
                        {status === "uploading" && (
                            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-r-transparent" />
                                Processing...
                            </div>
                        )}
                    </div>

                    {/* Status Messages */}
                    {status === "success" && (
                        <div className="bg-green-50 text-green-800 p-6 rounded-sm flex items-center gap-4 font-bold border border-green-200">
                            <CheckCircle className="w-6 h-6" />
                            <div>
                                <p className="text-sm">{message}</p>
                                <p className="text-[10px] uppercase mt-1 opacity-70 tracking-widest">Database has been updated.</p>
                            </div>
                        </div>
                    )}
                    {status === "error" && (
                        <div className="bg-red-50 text-red-800 p-6 rounded-sm flex items-center gap-4 font-bold border border-red-200">
                            <AlertCircle className="w-6 h-6" />
                            <div>
                                <p className="text-sm">{message}</p>
                                <p className="text-[10px] uppercase mt-1 opacity-70 tracking-widest">Please check file format.</p>
                            </div>
                        </div>
                    )}

                    {/* Table Preview */}
                    <div className="bg-white border border-border rounded-sm overflow-hidden overflow-x-auto shadow-sm">
                        <table className="w-full text-[10px] text-left">
                            <thead className="bg-secondary font-bold uppercase tracking-widest text-muted-foreground border-b">
                                <tr>
                                    {preview.length > 0 && Object.keys(preview[0]).map((key) => (
                                        <th key={key} className="px-6 py-4">{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {preview.map((row, i) => (
                                    <tr key={i} className="hover:bg-secondary/20 transition-colors">
                                        {Object.values(row).map((val: any, j) => (
                                            <td key={j} className="px-6 py-4 whitespace-nowrap text-muted-foreground">{val}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

