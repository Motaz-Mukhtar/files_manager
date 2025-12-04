import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router';

const API_URL = 'http://127.0.0.1:5000';

function FileContent() {
  const navigate = useNavigate();
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

  const handleArrowClick = () => navigate('/files');

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
      <div className="flex justify-between text-start m-10">
        {userToken &&
          <button className="px-15 text-xl font-bold text-white
                              cursor-pointer bg-[#1dbba5]
                              border-none rounded-sm
          " onClick={() => handleArrowClick()}>
            {'<-'}
          </button>
        }
        { responseMessage &&
          <div className='self-center py-5 px-10
                          border-2 border-[#1dbba5]
                          rounded-sm'>
            <p>{responseMessage}</p>
          </div>
        }
        { userToken &&
          <div className="p-5 cursor-pointer">
            <div onClick={handleMenuVisible} className='flex'>
              <div className="p-3 rounded-xl bg-[#1dbba5] mx-2 transition"></div>
              <div className="p-3 rounded-xl bg-[#1dbba5] mx-2 transition"></div>
              <div className="p-3 rounded-xl bg-[#1dbba5] mx-2 transition"></div>
            </div>
            { isMenuVisible &&
              <ul className="list-none fixed right-10 bg-white
                             border-2 border-white shadow-xl
                             z-[2] rounded-sm">
                <li
                  className='my-5 p-5 transition'
                  onClick={() => handleDropdownOptions('publish')}>Public</li>
                <li
                  className='my-5 p-5 transition'
                  onClick={() => handleDropdownOptions('unpublish')}>Private</li>
              </ul>
            }
          </div>
        }
      </div>

      {error && <p className="mt-10 text-red-700">Error: {error}</p>}
      {!isDataFetched && !error && <p className="text-[#3498db] mt-10">Loading...</p>}
      {isDataFetched && (
        <textarea value={fileData} readOnly className='
          fixed left-5 min-w-full max-w-full min-h-[70%]
          min-h-[70%] outline-none border-none cursor-unset
          font-bold border-2 border-black
        '>

        </textarea>
      )}
    </>
  );
}

export default FileContent;
