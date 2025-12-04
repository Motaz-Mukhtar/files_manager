import FolderIcon from '@mui/icons-material/Folder';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FolderMenu from '../UI/FolderMenu';
import { useNotification } from '../../context/NotificationContext';
import api from '../../api';
import { formatTimeAgo } from '../../utils/dateFormat';


function FolderItem({
    folderId,
    folderName,
    parentId=0,
    isPublic,
    owner,
    createdAt,
    setLoading,
    setFiles,
    setError,
    fetchFiles
}) {
    const [visibleOptionsId, setVisibleOptionsId] = useState(null);
    const navigate = useNavigate();


    const handleEdit = (fileId) => {
        // Toggle dropdown visiblity for the selected file.
        setVisibleOptionsId((prevId) => (prevId === fileId ? null : fileId));
    };

    const handleDropdownOption = (option, fileId=null, fileName=null) => {
        // Implement actions for "Delete", "Show" and "Download" options
        // Perform actions based on the selected option

        setVisibleOptionsId(null);

        // Delete file
        if (option === 'Delete') {
        loadingMessage = 'Deleteing';
        setLoading(true);
        const headers = {
            'X-Token': userToken,
        };

        axios.delete(`${API_URL}/api/files/${fileId}`, { headers })
        .then(response => {
            if (response.status === 200 || response.status === 204) {
                const newList = files.filter(ele => ele.id !== fileId);
                setFiles(newList);
                setLoading(false);
                notify("File Deleted Successfully", "success");
                navigate('/files');
            }
        }).catch(error => {
            setError(error.message);
            console.log(`File Unable to deleted: ${error.message}`);
            setLoading(false);
        });

        // Fetch the updated files list
        fetchFiles();
        }

        // Show file content
        else if (option === 'Show') {
        navigate(`/file/${fileId}/data`);
        }

        // Download file
        else if (option === 'Download') {
        axios.get(`${API_URL}/download/${fileId}`)
        .then(response => {
            notify("File are downloading....", "info");
            const blob = new Blob([response.data], {
            type: response.headers['content-type']
            });

            const link = document.createElement('a');

            link.href = window.URL.createObjectURL(blob);

            link.download = fileName;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);
        }).catch(error => {
            setError(error.message);
            console.log(error, error.message)
        })
        }
    };

    const handleFolderDeletion = async () => {
        // Implement folder deletion logic here

        const response = await api(`/folders/${folderId}`, {}, 'DELETE');

        if (response.statusCode === 204)
            notify("Folder Deleted Successfully", "success");

        else if (response.statusCode === 404)
            notify("Folder Not Found", "error");
        else
            notify("Failed to delete folder", "error");

        // Fetch the updated files list
        // fetchFiles();
    }
    return (
        <>
            <td>
                <FolderIcon className='text-blue-500'/>
                {folderName}
            </td>
            <td>
                {isPublic ? 'public' : 'private'}
            </td>
            <td>
                {owner}
            </td>
            <td>
                {formatTimeAgo(new Date(createdAt))}
            </td>
            <td className=''>
                <FolderMenu
                    handleFolderDeletion={handleFolderDeletion}
                />
            </td>
{/* 
          <div className="flex justify-between items-center
                          border-b-2 border-gray-200
                          m-4 p-4 relative
                          hover:bg-gray-200 cursor-pointer">
            <div className='flex'>
                <FolderIcon className='text-blue-500'/>
                <p className='mx-5 font-bold'>{folderName}</p>
            </div>
            <td className="rotate-90">
                <FolderMenu />
            </td>
          </div> */}
        </>
    );
}

export default FolderItem;