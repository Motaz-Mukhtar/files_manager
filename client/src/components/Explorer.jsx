import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';
import Cookies from 'js-cookie';
import FileAction from './FileBrowser/FileAction';
import NewButton from './UI/NewButton';
import { useBrowser } from '..//context/BrowserContext';
import { useNotification } from '../context/NotificationContext';
import FileBrowser from './FileBrowser/FileBrowser';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';


const Explorer = () => {
    // Hook
    const { path, setPath, setLoading } = useBrowser();
    const { notify } = useNotification();

    // React hooks
    const [ files, setFiles ] = useState([]);
    const [ isPopUpVisible, setPopUpVisible ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ mode, setMode ] = useState('upload');
    const [ currentView, setCurrentView ] = useState('file'); // 'file' or 'folder'

    // React Router hooks
    const params = useParams();
    const navigate = useNavigate();

    // Retrieve user token
    const userToken = Cookies.get('token_id');

    // url paramters
    const { folderId } = params;

    const handlePopUp = () => {
        setPopUpVisible((prevVisibility) => !prevVisibility);
    }


 
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
            navigate('/login');
        })
        .catch(error => {
            event.target.disabled = false;
            console.log(error.message);
        });
    }

    const handleRetryButton = () => {
        setRefreshFileList(true);
        setError(null);
        setLoading(true);
    }


    const goBack = () => {
        path.pop();
        path.pop();

        setPath(path);
        navigate(-1);
    }

    return (
        <div className='max-w-5xl mx-auto my-10'>
        <button onClick={handleLogout} className="float-right py-2 px-3
            m-5 text-white bg-red-700 border-2 border-red-700
            cursor-pointer transition
        ">Logout</button>

        {
            folderId &&
            <div className='w-fit cursor-pointer' onClick={ () => navigate(-1)  }>
                <ArrowBackIosIcon color='primary' fontSize='large'/>
            </div>
        }

        <div className="max-w-6xl my-[50px] mx-auto bg-white rounded-xl">
            <div className="bg-white text-[#1dbba5] p-5 rounded-tl-lg rounded-tr-lg border-b-2 border-b-[#1dbba5]">
            <h2 className='font-bold text-2xl'>{path.join('')}</h2>
            </div>

            {error && <p className="font-bold text-red-800 text-lg">Error: {error} <button onClick={handleRetryButton}>Retry</button></p>}


            {currentView === 'file' ? <FileBrowser files={files}/> : <FolderBrowser files={files} />}

            <div className='float-right my-10 mx-5'>
                <NewButton handlePopUp={handlePopUp} setMode={setMode}/>
            </div>
            {/* <button className="float-right m-6 bg-[#3498db] text-white py-2
                            border-none rounded-full cursor-pointer px-4
                            font-bold text-xl hover:bg-[#287fb9]
                            transition" onClick={() => handlePopUp()}>
                                <AddIcon fontSize='large'/> <span>New</span>
                            </button> */}
        </div>

        {
            isPopUpVisible &&
            <FileAction
                mode={mode}
                setLoading={setLoading}
                handlePopUp={handlePopUp}
                setPopUpVisible={setPopUpVisible}
                folderId={folderId}
            />
        }
        </div>
    );
};

export default Explorer;