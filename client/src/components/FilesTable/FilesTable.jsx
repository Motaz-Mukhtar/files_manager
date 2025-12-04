import FileItem from "./FileItem";
import FolderItem from "./FolderItem";
import { useBrowser } from "../../context/BrowserContext";



function FilesTable({ files, fetchFiles }) {
    const { folderRedirects } = useBrowser();


    const redirect = (file) => {
        folderRedirects(file.name, file._id);
        fetchFiles(file._id);
    }
    console.log(files);
    return (
        <table className="table-auto w-full border-collapse
                          md:table-fixed">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Owner</th>
                    <th>Created At</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                { files.map((file) => (
                    <tr key={file._id} className="
                        text-center border-b-1
                        p-20 border-b-gray-300
                        hover:bg-gray-300
                        cursor-pointer"
                        onClick={ file.type === 'folder' ? () => redirect(file) : console.log("hello worlddd")}
                        >
                        {
                            file.type === 'file'
                            ?
                                <FileItem
                                    fileId={file._id}
                                    originalName={file.originalName}
                                    isPublic={file.isPublic}
                                    owner={file.owner}
                                    parentId={file.parentId}
                                    createdAt={file.createdAt}
                                    />
                            :
                                <FolderItem
                                    folderId={file._id}
                                    folderName={file.name}
                                    isPublic={file.isPublic}
                                    owner={file.owner}
                                    parentId={file.parentId}
                                    createdAt={file.createdAt}
                                />

                        }
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default FilesTable;