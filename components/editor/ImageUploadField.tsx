'use client';

import { useRef } from 'react';

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export default function ImageUploadField({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (dataUrl: string | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.size > MAX_IMAGE_BYTES) {
      window.alert('That image is too large (max 4MB). Try a smaller file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-1.5">
      <span className="block text-xs text-neutral-400">Image</span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex-1 rounded border border-neutral-700 bg-neutral-800 px-2 py-1.5 text-xs text-neutral-200 hover:bg-neutral-700"
        >
          {value ? 'Replace image' : 'Upload image'}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="rounded border border-neutral-700 bg-neutral-800 px-2 py-1.5 text-xs text-neutral-400 hover:bg-neutral-700"
          >
            Clear
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-16 w-full rounded border border-neutral-700 object-cover" />
      )}
    </div>
  );
}
