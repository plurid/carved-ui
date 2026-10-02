import { useState } from 'react';
import { DropZone, ProgressBar } from '@plurid/carved-ui-react';

export default function Example() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div className="stack">
      <DropZone
        label="Drop images here"
        description="PNG, JPEG or WebP, up to 10 MB each."
        acceptedFileTypes={['image/png', 'image/jpeg', 'image/webp']}
        allowsMultiple
        onSelect={(chosen) => setFiles((current) => [...current, ...chosen])}
      />
      {files.map((file, index) => (
        <ProgressBar
          key={`${file.name}-${index}`}
          label={file.name}
          value={100}
          valueLabel={`${Math.round(file.size / 1024)} KB`}
        />
      ))}
    </div>
  );
}
