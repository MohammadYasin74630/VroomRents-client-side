import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast';

function FileInput({ files, setFiles, btnLoading }) {

    const error = (msg) => toast.error(msg, { position: "top-right" });

    const rejectIcon = file => {
        
        if (file.type === "image/x-icon") {
            return {
                code: "blacklisted-ico-file-type",
                message: `icon files are not allowed`
            };
        }
        else if (file.type === "image/svg+xml") {
            return {
                code: "blacklisted-svg-file-type",
                message: `svg vector files are not allowed`
            };
        }
    }

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {

        if (acceptedFiles) {

            const removedDuplicateFile = acceptedFiles.filter(f => {

                const isDuplicate = files.some(existingFile => existingFile.name === f.name);
                return !isDuplicate;
            });

            const selectedFiles = removedDuplicateFile.map(
                file => {
                    file.previewUrl = URL.createObjectURL(file)
                    return file
                }
            )
            setFiles(prev => [...prev, ...selectedFiles])
        }

        if (rejectedFiles) {

            rejectedFiles.forEach(

                (f) => error("rejected: " + f.file.name)
            )
        }

    }, [files])

    const { getRootProps, getInputProps, isDragActive } = useDropzone(
        {
            onDrop,
            accept: { "image/*": [] },
            disabled: btnLoading,
            validator: rejectIcon
        }
    )

    return (
        <>
            <div {...getRootProps({
                className: `bg-teal-600 h-20 flex items-center justify-center rounded-lg outline outline-2 outline-dashed outline-gray-300 focus:outline focus:outline-teal-500 m-1 px-4 ${btnLoading ? "cursor-not-allowed" : "cursor-pointer"}`
            })}>
                <input {...getInputProps()} name="files" />
                {
                    isDragActive ?
                        <p>Drop the files here ...</p> :
                        <p><span className='max-sm:hidden'>Drag 'n' drop some files here, or</span> click to select files</p>
                }
            </div>
        </>
    )
}

export default FileInput