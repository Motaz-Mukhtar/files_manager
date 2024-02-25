import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:5000';

function FileContent() {
  const history = useHistory();
  const userToken = Cookies.get('token_id');
  const [fileData, setFileData] = useState('');
  const [isDataFetched, setDataFetched] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [error, setError] = useState('');
  const [responseMessage, setResponseMessage] = useState(null);
  const { fileId } = useParams();

  useEffect(() => {
    const headers = {
      'X-Token': userToken,
    };

    axios.get(`${API_URL}/api/files/${fileId}/data`, { headers })
      .then(response => {
        setFileData(response.data);
        setDataFetched(true);
      })
      .catch(error => {
        console.log(error);
        if (error.response.status === 404) 
          setError(`${error.message} (file not found)`);
      });
  }, [fileId]);

  const handleArrowClick = () => history.push('/files');

  const handleMenuVisible = () => {
    setMenuVisible((isMenuVisible) => !isMenuVisible)
  }

  const handleDropdownOptions = (option) => {
    const headers = {
      'X-Token': userToken,
    };

    if (option === 'publish') {
      axios.put(`${API_URL}/api/files/${fileId}/${option}`, null, { headers })
        .then(response => setResponseMessage('File now is Public') )
        .catch(error => {
          console.log(error);
          setResponseMessage(error.message)
        });

    } else if (option === 'unpublish') {
      axios.put(`${API_URL}/api/files/${fileId}/${option}`, null, { headers })
      .then(response => setResponseMessage('File now is Private') )
      .catch(error => {
        console.log(error);
        setResponseMessage(error.message)
      })
    }

    setMenuVisible(false);

    setTimeout(() => {
      setResponseMessage(null);
    }, 2500);
  }

  return (
    <>
      <div className="options-container">
        {userToken &&
          <button className="arrow-button" onClick={() => handleArrowClick()}>{'<-'}</button>
        }
        { responseMessage &&
          <div className='responseMessage'>
            <p>{responseMessage}</p>
          </div>
        }
        { userToken &&
          <div className="menu-container">
            <div onClick={handleMenuVisible}>
              <div className="circles"></div>
              <div className="circles"></div>
              <div className="circles"></div>
            </div>
            { isMenuVisible &&
              <ul className="options">
                <li onClick={() => handleDropdownOptions('publish')}>Public</li>
                <li onClick={() => handleDropdownOptions('unpublish')}>Private</li>
              </ul>
            }
          </div>
        }
      </div>

      {error && <p className="error-message">Error: {error}</p>}
      {!isDataFetched && !error && <p className="loading-message">Loading...</p>}
      {isDataFetched && (
        <textarea value={fileData} readOnly></textarea>
      )}
    </>
  );
}

export default FileContent;
