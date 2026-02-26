import { Upload } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileDropZoneProps {
    onFileAccepted: (file: File) => void;
    acceptedFormats?: string[];
    maxSize?: number; // in bytes
    className?: string;
}

export default function FileDropZone({
    onFileAccepted,
    acceptedFormats = [".csv", ".xls", ".xlsx"],
    maxSize = 10 * 1024 * 1024, // 10MB
    className = "",
}: FileDropZoneProps) {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                onFileAccepted(acceptedFiles[0]);
            }
        },
        [onFileAccepted]
    );

    const { getRootProps, getInputProps, isDragActive, fileRejections } =
        useDropzone({
            onDrop,
            accept: {
                "text/csv": [".csv"],
                "application/vnd.ms-excel": [".xls"],
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                    [".xlsx"],
            },
            maxSize,
            multiple: false,
        });

    return (
        <div className={className}>
            <div
                {...getRootProps()}
                className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
              isDragActive
                  ? "border-elan-orange bg-orange-50"
                  : "border-gray-300 bg-[#FFF5EB] hover:border-elan-orange"
          }
        `}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center gap-3">
                    <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            isDragActive ? "bg-elan-orange" : "bg-orange-200"
                        }`}
                    >
                        <Upload
                            className={`w-6 h-6 ${
                                isDragActive ? "text-white" : "text-elan-orange"
                            }`}
                        />
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            Glissez votre fichier ici ou{" "}
                            <span className="text-elan-orange underline">
                                cliquez pour parcourir
                            </span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Formats acceptés : {acceptedFormats.join(", ")} (Max{" "}
                            {Math.round(maxSize / 1024 / 1024)}Mo)
                        </p>
                    </div>
                </div>
            </div>

            {fileRejections.length > 0 && (
                <div className="mt-2 text-sm text-red-600">
                    {fileRejections[0].errors[0].message}
                </div>
            )}
        </div>
    );
}
