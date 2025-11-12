import React, { Component, useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';

const API_URL = 'http://localhost:5000';

function FilesList({ props }) {
  const history = useHistory();
  const userToken = Cookies.get('token_id');
  const [files, setFiles] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isPopUpVisible, setPopUpVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [refreshFileList, setRefreshFileList] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);

  const [visibleOptionsId, setVisibleOptionsId] = useState(null);

  let loadingMessage = 'Loading';

  useEffect( () => {
    const headers = {
      'X-Token': userToken,
    }

    // Fetch user files from the server based on user token
    // axios.get(`${API_URL}/api/files`, { headers })
    axios.get(`http://localhost:5000/api/files`, { headers })
    .then(response => {
      console.log("Files")
      console.log(response);
      setFiles(response.data.files);
      setLoading(false);
      setError(null);
    })
    .catch(error => {
      console.log(error);
      console.log(error.message);

      // if the user not authorized, redirect to the login page.
      if (error.response)
        if (error.response.status === 401) history.push('/login');
      setError(error.message);
      setLoading(false);
      setRefreshFileList(false);
    })
  }, [refreshFileList])

  const handleLogout = (event) => {
    // Disable Logout button
    event.target.disabled = true;
    const headers = {
      'X-Token': userToken,
    }

    axios.get(`${API_URL}/api/disconnect`, { headers })
    .then(response => {
      // Remove the token from the cookie.
      Cookies.remove('token_id');
      // Redirect the user to the login page.
      history.push('/login');
    })
    .catch(error => {
      event.target.disabled = false;
      console.log(error.message);
    });
  }

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
        if (response.status === 200) {
          const newList = files.filter(ele => ele.id !== fileId);
          setFiles(newList);
          setLoading(false);
          handleResponseMessage('File Deleted Successfully');
          history.push('/files');
        }
      }).catch(error => {
        setError(error.message);
        console.log(`File Unable to deleted: ${error.message}`)
      })
    }

    // Show file content
    else if (option === 'Show') {
      history.push(`/file/${fileId}/data`);
    }

    // Download file
    else if (option === 'Download') {
      axios.get(`${API_URL}/download/${fileId}`)
      .then(response => {
        handleResponseMessage('File are downloading....');
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

  const handlePopUp = () => {
    setPopUpVisible((prevVisibility) => !prevVisibility);
  }

  const handleUploadFile = (event) => {
    event.preventDefault();

    loadingMessage = 'Uploading';

    setLoading(true);
    setPopUpVisible(false);

    const formData = new FormData();
    formData.append('file', selectedFile);

    // Set the request header
    // Insert the token, and the content type
    const headers = {
      'X-Token': userToken,
      "Content-Type": "multipart/form-data"
    };

    // Uploading file.
    axios.post(`${API_URL}/api/files`, formData, { headers })
    .then(response => {
      // Show success message to the user.
      setLoading(false);

      handleResponseMessage('File Uploaded Successfully.');

      setIsUploaded(true)
    }).catch(error => {
      // Show error Message to the user
      handleResponseMessage('Error during file uploading');
    })
    setTimeout(() => {
      setRefreshFileList(true);
      setRefreshFileList(false);
    }, 2000)
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleRetryButton = () => {
    setRefreshFileList(true);
    setError(null);
    setLoading(true);
  }

  const handleResponseMessage = (message) => {
    setResponseMessage(message);

    setTimeout(() => {
      setResponseMessage(null);
    }, 2500)
  }

  return (
    <>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
      <div className="file-list">
        <div className="file-list-header">
          <h2>Files List</h2>
        </div>
        {loading && <p className="loading-message">{loadingMessage}...</p>}
        {error && <p className="error-message">Error: {error} <button onClick={handleRetryButton}>Retry</button></p>}
        {!loading && (
          <ul>
            {files.length === 0 && !error ? <span className="not-found">No Files Uploaded.</span> :
              files.map(file => ( 
              <li key={file.id} className="file-item">
                {file.name}
                <div className="edit-dropdown">
                  {visibleOptionsId === file.id && (
                    <div className="dropdown-options">
                      <div onClick={() => handleDropdownOption('Show', file.id)}>Show</div>
                      <div onClick={() => handleDropdownOption('Download', file.id, file.name)}>Download</div>
                      <div onClick={() => handleDropdownOption('Delete', file.id)}>Delete</div>
                    </div>
                  )}
                </div>
                <button
                    className="edit-btn"
                    onClick={() => handleEdit(file.id)}
                  >
                    Options
                </button>
              </li>

            ))}
          </ul>
        )}
        <button className="upload-btn" onClick={() => handlePopUp()}>Upload File</button>
      </div>
      {isPopUpVisible &&

      <>
        <div className="dark-background" onClick={() => handlePopUp()}></div>
        <div className="upload-popup">
          <form>
            <label htmlFor="file">Select File:</label><br />
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              accept=".doc,.docx,.txt,.html,.js,.css,.py" // Define accepted file types
            /><br />
            <input type="checkbox" name="checkbox" className="checkbox" id="checkbox" />
            <label id="checkbox" htmlFor="checkbox">Check if you want it to be in public.</label>
            <input type="submit" value="upload" className="upload-btn" onClick={handleUploadFile} />
          </form>
        </div>
      </>

      }

      { responseMessage &&
        <div className="response-message">
          <p>{responseMessage}</p>
        </div>
      }

    </>
  )
}

export default FilesList;
