import { useEffect } from "react";
import { useParams } from "react-router";
import api from "../../api";
import { useState } from "react";
import FilesTable from "../FilesTable/FilesTable";
import { useNotification } from "../../context/NotificationContext";
import { useBrowser } from "../../context/BrowserContext";
import CircularLoading from '../UI/CircularLoading';

function FolderBrowser() {
    const params = useParams();
    const [files, setFiles] = useState({});

    // Contexts
    const { notify } = useNotification();
    const { path, setLoading, loading } = useBrowser();


    useEffect(() => {
        fetchFolderFiles();
    }, []);

    const fetchFolderFiles = async () => {
        const { folderId } = params;

        const response = await api(`/folders/${folderId}`, {});

        console.log(response);
        if (response.statusCode === 200)
            setFiles(response.data);
        else if (response.statusCode === 404) {
            setFiles([]);
            notify(response.message, 'info');
        }

        setLoading(false);
    }

    return (
        <>
            {
                loading && <CircularLoading />}
            {
                files.length === 0 && 

                <div className="w-fit ">
                    <p>Empty Folder</p>
                </div>
            }
            {
                files.length > 0 &&
                <FilesTable files={files}/>
            }
        </>
    );
}

export default FolderBrowser;