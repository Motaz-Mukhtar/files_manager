import FilesTable from '../FilesTable/FilesTable';
import { useBrowser } from '../../context/BrowserContext';
import CircularLoading from '../UI/CircularLoading';
import { useState, useEffect } from 'react';
import api from '../../api';

function FileBrowser({ folderId }) {
  // Contexts
  const { loading, setLoading } = useBrowser();

  // React hooks
  const [ files, setFiles ] = useState([]);

  useEffect( () => {
    fetchFiles(folderId);
      // if (folderId) {
      //     console.log("Fetch folder files")
      //     fetchFolderFiles(folderId);
      // }
      // else
  }, []);

    const fetchFiles = async (folderId=0) => {
      setLoading(true);
      const response = await api(`/files?parentId=${folderId}`, {}, 'GET');

      // If not found error, return empty array
      // with not 'Empty Folder" message.
      console.log(response)
      if (response.statusCode === 200){
          setFiles(response.data);
      }
      else if (response.statusCode === 404) {
          setFiles([]);
          notify("Empty Folder", 'info');
      }
      else
        notify("Something went wrong", 'error');

      setLoading(false);
      return;
  }

    const fetchFolderFiles = async (folderId) => {
        // setPath(folderId);
        const response = await api(`/folders/${folderId}`, {});

        path.push(response.folderName);
        path.push('/');

        setPath(path);

        if (response.statusCode === 200)
            setFiles(response.data);
        else if (response.statusCode === 404) {
            setFiles([]);
            notify(response.message, 'info');
        }
        else
            notify("     went wrong", 'error');

        setLoading(false);
    }


  return (
    <>

      {
        loading &&
        <CircularLoading />
      }

      {!loading &&
        <FilesTable
          files={files}
          fetchFiles={fetchFiles}
        />
      }
    </>
  )
}

export default FileBrowser;
