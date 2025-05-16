import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image as ImageIcon, X } from 'lucide-react';
import { Button } from './button';
import Image from 'next/image';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  selectedImage?: string;
  className?: string;
}

export function ImageUpload({ onImageSelect, onImageRemove, selectedImage, className }: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageSelect(acceptedFiles[0]);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className={className}>
      {selectedImage ? (
        <div className="relative">
          <Image
            src={selectedImage}
            alt="Selected"
            width={200}
            height={200}
            className="rounded-md object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={onImageRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:border-primary/50 transition-colors ${
            isDragActive ? 'border-primary' : 'border-muted-foreground/25'
          }`}
        >
          <input {...getInputProps()} />
          <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isDragActive ? 'Drop the image here' : 'Drag & drop an image, or click to select'}
          </p>
        </div>
      )}
    </div>
  );
} 