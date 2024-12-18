"use client"

import * as React from "react"
import { Upload } from 'lucide-react'
import { useDropzone } from 'react-dropzone';

export function FileDropZone() {

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  return (
        <div 
            className={`h-1/4 rounded-xl bg-gradient-to-br from-blue-500/30 via-cyan-500/30 to-teal-500/30 dark:from-blue-500/20 dark:via-cyan-500/20 dark:to-teal-500/20 transition-all duration-300 ease-in-out cursor-pointer overflow-hidden shadow-lg hover:shadow-xl `}
            >
            <div {...getRootProps()} className="h-full flex items-center justify-center p-4">
                <input {...getInputProps()} />
                <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-white/70" />
                <p className="mt-2 text-sm text-white/70">
                    {acceptedFiles.length > 0 ? `Selected ${acceptedFiles.length} files` : "Drag 'n' drop some files here, or click to select files"}
                </p>
                </div>
            </div>
        </div>
  )
}