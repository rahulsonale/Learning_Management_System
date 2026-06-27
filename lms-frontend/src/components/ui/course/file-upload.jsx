import { IconUpload, IconTrash } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function FileUpload({
  title,
  description,
  buttonText,
  onFileSelect,
}) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");

  function createPreviewUrl(file) {
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      // Handle the file upload logic here, e.g., send it to the server or update state
      console.log("Selected file:", file);
      onFileSelect(file);
      createPreviewUrl(file);
    }
  }

  return (
    <Empty className="border border-dashed">
      {!previewUrl ? (
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconUpload />
          </EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
      ) : (
        <EmptyHeader>
          <EmptyTitle>Preview</EmptyTitle>
        </EmptyHeader>
      )}
      <EmptyContent>
        <Button variant="outline" size="sm">
          {previewUrl ? inputRef.current.files[0].name : buttonText}
          <input
            ref={inputRef}
            onChange={handleFileChange}
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </Button>
        {previewUrl ? (
          <article className="w-full max-w-[20rem]">
            <AspectRatio ratio={4 / 3} className="rounded-lg bg-muted">
              <img
                src={previewUrl}
                alt="Preview thumbnail"
                fill
                className="rounded-lg object-cover dark:brightness-20"
              />
            </AspectRatio>
            <footer className="py-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPreviewUrl("");
                  inputRef.current.value = "";
                }}
              >
                <IconTrash className="mr-2" />
                Remove
              </Button>
            </footer>
          </article>
        ) : null}
      </EmptyContent>
    </Empty>
  );
}
