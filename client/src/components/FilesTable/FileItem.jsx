import { useState } from 'react';
import { useNavigate } from 'react-router';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ShareIcon from '@mui/icons-material/Share'; // Share icon
import DownloadIcon from '@mui/icons-material/Download'; // Download icon
import FileMenu from '../UI/FileMenu';
import { useNotification } from '../../context/NotificationContext';
import { formatTimeAgo } from '../../utils/dateFormat';

function FileItem({
    fileId,
    fileName,
    originalName,
    parentId=0,
    isPublic,
    owner,
    createdAt,
    setFiles,
    setLoading,
    setError,
    fetchFiles
}) {
    const [visibleOptionsId, setVisibleOptionsId] = useState(null);
    const navigate = useNavigate();
    const { notify } = useNotification();


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

    return (
        <>
            <td className='py-6 px-4'>
                <InsertDriveFileIcon className='text-blue-500'/>
                {originalName}
            </td>
            <td className='py-6 px-4'>
                {isPublic ? "public" : "private"}
            </td>
            <td className='py-6 px-4'>
                {owner}
            </td>
            <td className='py-6 px-4'>
                {formatTimeAgo(new Date(createdAt))}
            </td>
            <td className='py-6 px-4'>
                <FileMenu />
            </td>

          {/* <div className="flex justify-between items-center
                                       border-b-2 border-gray-200
                                       m-4 p-4 relative">
            <div className='flex'>
                <InsertDriveFileIcon className='text-blue-500'/>
                <p className='mx-5 font-bold'>{originalName}</p>
            </div>
            <div className="absolute right-5 rotate-90">
                <FileMenu />
            </div> */}
            {/* <button
                className="bg-transparent p-2 border-none
                           rounded-full cursor-pointer
                           hover:bg-gray-200 transition
                           duration-75 text-gray-600"
                onClick={() => handleEdit(fileId)}
              >
                <MoreHorizIcon />
            </button> */}
          {/* </div> */}
        </>
    );
}

export default FileItem;