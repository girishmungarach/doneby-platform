'use client';

import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileIcon, ImageIcon, FileTextIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  initialFiles?: File[];
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedFileTypes?: string[]; // e.g., ['image/*', '.pdf', '.doc']
}

const defaultAcceptedFileTypes = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export default function FileUpload({
  onFilesChange,
  initialFiles = [],
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedFileTypes = defaultAcceptedFileTypes,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>(initialFiles);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      const newFiles = [...files];
      let filesAdded = 0;

      acceptedFiles.forEach((file) => {
        if (newFiles.length < maxFiles) {
          if (file.size <= maxSize) {
            newFiles.push(file);
            filesAdded++;
          } else {
            toast.error('File too large', {
              description: `File \'${file.name}\' exceeds the maximum size of ${maxSize / (1024 * 1024)}MB.`, 
            });
          }
        } else {
          toast.warning('File limit reached', {
            description: `Cannot upload more than ${maxFiles} files.`, 
          });
        }
      });

      fileRejections.forEach(({ file, errors }) => {
        errors.forEach((err: any) => {
          if (err.code === 'file-too-large') {
            toast.error('File too large', {
              description: `File \'${file.name}\' exceeds the maximum size of ${maxSize / (1024 * 1024)}MB.`, 
            });
          } else if (err.code === 'file-invalid-type') {
            toast.error('Invalid file type', {
              description: `File \'${file.name}\' has an unsupported type.`, 
            });
          } else {
            toast.error('Upload error', {
              description: `Failed to upload \'${file.name}': ${err.message}`, 
            });
          }
        });
      });

      setFiles(newFiles);
      onFilesChange(newFiles);

      if (filesAdded > 0) {
        toast.success(`${filesAdded} file(s) added successfully.`);
      }
    },
    [files, onFilesChange, maxFiles, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: maxSize,
    maxFiles: maxFiles,
    multiple: true,
  });

  const removeFile = (fileToRemove: File) => {
    const updatedFiles = files.filter((file) => file !== fileToRemove);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
    toast.info(`File \'${fileToRemove.name}\' removed.`);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-10 h-10 text-muted-foreground" />;
    } else if (file.type === 'application/pdf') {
      return <FileTextIcon className="w-10 h-10 text-muted-foreground" />;
    } else if (file.type.includes('word')) {
      return <FileTextIcon className="w-10 h-10 text-muted-foreground" />;
    } else {
      return <FileIcon className="w-10 h-10 text-muted-foreground" />;
    }
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="h-full w-full object-cover rounded-md"
          onLoad={() => { URL.revokeObjectURL(URL.createObjectURL(file)) }}
        />
      );
    } else {
      return getFileIcon(file);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md cursor-pointer transition-colors",
          "hover:border-primary-foreground",
          isDragActive ? "border-primary-foreground bg-primary-foreground/10" : "border-border"
        )}
      >
        <input {...getInputProps()} />
        <UploadCloudIcon className="w-12 h-12 text-muted-foreground mb-3" />
        {isDragActive ? (
          <p className="text-muted-foreground">Drop the files here ...</p>
        ) : (
          <p className="text-muted-foreground">Drag 'n' drop some files here, or click to select files</p>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          Max {maxFiles} files, up to {maxSize / (1024 * 1024)}MB each.
          Accepted: {acceptedFileTypes.map(type => type.split('/').pop()).join(', ').replace(/jpeg/g, 'jpg').replace(/msword|opendocument.wordprocessingml.document/g, 'doc')}
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          <h3 className="text-lg font-medium">Uploaded Files ({files.length}/{maxFiles})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file, index) => (
              <div
                key={file.name + file.lastModified + file.size}
                className="relative flex items-center space-x-3 rounded-md border p-3 shadow-sm"
              >
                <div className="flex-shrink-0 h-16 w-16 flex items-center justify-center bg-muted rounded-md">
                  {getFilePreview(file)}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                  {uploadProgress[file.name] !== undefined && ( // Show progress only if exists
                    <Progress value={uploadProgress[file.name]} className="w-full h-2 mt-1" />
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeFile(file)}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 