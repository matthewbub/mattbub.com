---
title: "Hand rolling drop-zone components in React"
description: "Tired of that old 'Choose file' button? Yeah, me too. Let's build a proper drag-and-drop file uploader in React because it's 2024 and we deserve better UX than clicking tiny buttons like savages."
pubDate: "August 2 2024"
---

Alright so like when's the last time you had to actually select that old HTML "Choose file" button? I usually don't like to pull this card but _it is 2024 after all_, and since most of us are using React anyway, I figure we might as well cover what a file uploader with drag and dropping capabilities might look like.

## Setup

Let's just use Next.js because it's the easiest for me to reach for, plus it will be trivial to implement a backend should you decided to head that route. (You'll need to head that route)

We'll reach for the default settings outline in the [Getting Started section of the Next.js docs](https://nextjs.org/docs/getting-started/installation). Which basically means we should launch the create-next-app setup wizard or whatever its called.

```shell
npx create-next-app@latest
```

After that, we can just dive right into the code. To be honest I was going to jump for react-dropzone like I always have in the past, but it's getting a bit stagnate, 2 years at the time of this writing and it looks like [the bugs are piling up](https://github.com/react-dropzone/react-dropzone/issues?q=is%3Aissue+is%3Aopen+BUG). I figure it's only going to grow more out of style as time goes; so it's probably going to be preferred to just roll our own. However if you want that option it's totally there. The [source code](https://github.com/react-dropzone/react-dropzone) is pretty user friendly too, but I won't necessarily be referencing that code here, as I don't need that many edge cases.

Oh yeah, you can remove the landing page code that was auto generated in the Next.js app. All that stuff in the `src/app/page.tsx` yeah we just want the empty component. Maybe something like this

```tsx
export default function Home() {
  return <div>Hello, World!</div>;
}
```

## Drop Zoning

So I forgot to mention above that we should probably launch the dev server, because well, that's how we're going to see the changes. The command we ran to bootstrap the Next.js app should have already taken care of this for us in the `package.json` file.

To do that, we can execute the "dev" script in the `package.json` file.

```sh
npm run dev
```

And with that we should have a local development server up and running. Okay now we have something to look at while we test our changes. Let's start by creating a new directory within the `src` directory, titled `components` or something like that.

Because we're using browser-side code. We're going to create an isolated module for the component that will be handling the drag and drop behavior.

```tsx
"use client";

import React, { useState, useRef } from "react";

const FileUploader = () => {
  const [files, setFiles] = useState<File[]>([]);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    // Add visual cues (e.g., change background color) to indicate drag-over
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const acceptedFiles = Array.from(event.dataTransfer.files); // Filter file types if needed
    setFiles(acceptedFiles);
    // Handle file upload logic here
    console.log(acceptedFiles);
  };

  return (
    <div
      className="p-4 border border-blue-500 rounded h-[300px] w-[140px]"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      ref={dropRef}
    >
      <p>Drag & drop files here</p>
    </div>
  );
};

export default FileUploader;
```

and then we can just slap that thing up in the `src/app/page.tsx` and then test our changes with the browser dev tools tab open, because at this point in time, we're just logging the files being dropped into the console.

```tsx
import FileUploader from "@/components/FileUploader";
import React from "react";

export default function Home() {
  return (
    <div>
      <FileUploader />
    </div>
  );
}
```

Cool so thats going well now we can focus on the hover state.

```tsx
"use client";

import React, { useState, useRef } from "react";
import { Text } from "@/components/text";

const FileUploader = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const acceptedFiles = Array.from(event.dataTransfer.files);
    setFiles(acceptedFiles);
    // console.log(acceptedFiles)
  };

  return (
    <div>
      <div
        className={`p-4 border border-dashed border-blue-500 rounded h-[100px] w-[300px] max-w-[300px] flex items-center justify-center ${
          isDragging ? "bg-blue-500/20" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        ref={dropRef}
      >
        <p>Drag & drop files here</p>
      </div>
      <ul>
        {files &&
          files.map((file, index) => <Text key={index}>{file.name}</Text>)}
      </ul>
    </div>
  );
};

export default FileUploader;
```

very cool. Now let's work on some additional features.

## File Validation and Error Handling

At this point we've got a basic drop zone working, but we should probably add some validation. Let's say we only want to accept image files and limit the file size.

```tsx
const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
  event.stopPropagation();
  setIsDragging(false);
  
  const droppedFiles = Array.from(event.dataTransfer.files);
  const validFiles: File[] = [];
  const errors: string[] = [];
  
  droppedFiles.forEach(file => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      errors.push(`${file.name} is not an image file`);
      return;
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      errors.push(`${file.name} is too large (max 5MB)`);
      return;
    }
    
    validFiles.push(file);
  });
  
  if (errors.length > 0) {
    console.error('File validation errors:', errors);
    // You'd probably want to show these errors to the user
  }
  
  setFiles(validFiles);
};
```

## Adding a Traditional File Input

Because accessibility matters, we should also provide a traditional file input as a fallback. Users might prefer clicking to select files, or they might be using assistive technology.

```tsx
const fileInputRef = useRef<HTMLInputElement>(null);

const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFiles = Array.from(event.target.files || []);
  setFiles(selectedFiles);
};

const handleClick = () => {
  fileInputRef.current?.click();
};

return (
  <div>
    <div
      className={`p-4 border border-dashed border-blue-500 rounded h-[100px] w-[300px] max-w-[300px] flex items-center justify-center cursor-pointer ${
        isDragging ? "bg-blue-500/20" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      ref={dropRef}
    >
      <p>Drag & drop files here or click to select</p>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        multiple
        accept="image/*"
        style={{ display: 'none' }}
      />
    </div>
    <ul>
      {files &&
        files.map((file, index) => <Text key={index}>{file.name}</Text>)}
    </ul>
  </div>
);
```

## File Upload Implementation

Now for the actual upload part. This is where you'd typically send the files to your backend. Here's a basic example:

```tsx
const uploadFiles = async (filesToUpload: File[]) => {
  const formData = new FormData();
  
  filesToUpload.forEach((file, index) => {
    formData.append(`file-${index}`, file);
  });
  
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      console.log('Files uploaded successfully');
      setFiles([]); // Clear the files after successful upload
    } else {
      console.error('Upload failed');
    }
  } catch (error) {
    console.error('Upload error:', error);
  }
};
```

## Wrapping Up

personally, i find joy in understanding what's happening under the hood. However in many production instances you'd probably just want to reach for an open source alternative :)

