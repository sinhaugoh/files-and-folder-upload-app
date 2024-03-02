import { DragEvent } from "react";

const allowedMimeTypes = ["image/gif", "image/jpeg", "image/png", "image/webp"];

export const Dropzone = () => {
  const retrieveFilesFromDataTransfer = async (
    dataTransfer: DataTransfer,
    allowedMimeTypes?: string[],
  ) => {
    const items = dataTransfer.items;
    const files: File[] = [];

    async function retrieveFileFromEntry(entry: FileSystemEntry) {
      if (entry?.isFile) {
        // Filter mime-type
        const file: File = await new Promise((resolve, reject) => {
          // @ts-expect-error type definition not supported
          entry.file(
            // @ts-expect-error type definition not supported
            (file) => {
              resolve(file);
            },
            () => {
              reject();
            },
          );
        });

        if (file) {
          if (!allowedMimeTypes || allowedMimeTypes.includes(file.type)) {
            files.push(file);
          }
        }
      } else {
        // @ts-expect-error type definition not supported
        const reader = entry.createReader();
        const entries: FileSystemEntry[] = await new Promise(
          (resolve, reject) => {
            reader.readEntries(
              (entries: FileSystemEntry[]) => {
                resolve(entries);
              },
              () => reject(),
            );
          },
        );

        await Promise.all(entries.map((entry) => retrieveFileFromEntry(entry)));
      }
    }

    const entries: FileSystemEntry[] = [];
    for (const item of items) {
      const entry = item.webkitGetAsEntry();
      if (!entry) continue;
      entries.push(entry);
    }

    await Promise.all(entries.map((entry) => retrieveFileFromEntry(entry)));

    return files;
  };

  // Enable dropping of both files and folders
  const handleDropFiles = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const files = await retrieveFilesFromDataTransfer(
      e.dataTransfer,
      allowedMimeTypes,
    );
    console.log({ files });

    // TODO: handle file upload and progress
  };

  return (
    <div
      onDragEnter={(e) => e.preventDefault()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDropFiles}
      className=" relative h-full"
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <p className="text-3xl">Drap and drop into the zone</p>
        <p className="my-2">OR</p>
        <p className="text-3xl">Click to upload</p>
        {/* <button */}
        {/*   type="button" */}
        {/*   className="focus: rounded bg-blue-700 px-3 py-2 text-white ring-blue-300 hover:bg-blue-800 focus:ring-4" */}
        {/*   onClick={handleUploadButtonClicked} */}
        {/* > */}
        {/*   Upload */}
        {/* </button> */}
        <p className="mt-4 text-sm text-gray-400">
          Supported file types: .jpg, .jpeg, .png, .gif, .webp
        </p>
      </div>
      {/* <input */}
      {/*   ref={fileInputRef} */}
      {/*   type="file" */}
      {/*   onChange={handleFilesSelectionChange} */}
      {/*   className="absolute inset-0 cursor-pointer opacity-0" */}
      {/*   webkitdirectory="" */}
      {/*   // mozdirectory="" */}
      {/*   // odirectory="" */}
      {/*   directory="" */}
      {/*   multiple */}
      {/* /> */}
    </div>
  );
};
