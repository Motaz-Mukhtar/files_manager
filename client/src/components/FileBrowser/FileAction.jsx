import { useState } from "react";
import Cookies from "js-cookie";
import api from "../../api";
import axios from 'axios';
import { useNotification } from '../../context/NotificationContext';

const API_URL = 'http://localhost:5000';


function FileAction({
    mode="upload",
    setLoading,
    handlePopUp,
    setPopUpVisible,
    loadingMessage,
    folderId=null}) {

    const userToken = Cookies.get('token_id');
    // To distinguise between file upload and create folder options
    const isUpload = mode === 'upload' ? true : false;
    const [folderForm, setFolderForm] = useState({
        folderName: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const { notify } = useNotification();

    const handleUploadFile = (event) => {
        event.preventDefault();

        loadingMessage = 'Uploading';

        setLoading(true);
        setPopUpVisible(false);

        const formData = new FormData();
        formData.append('file', selectedFile);
        const isPublic = document.getElementById('checkbox').checked;
        formData.append('isPublic', isPublic);

        if (folderId)
            formData.append('parentId', folderId);

        // Set the request header
        // Insert the token, and the content type
        const headers = {
        'X-Token': userToken,
        "Content-Type": "multipart/form-data"
        };

        console.log(`Uplaoding: ${formData}`);

        // Uploading file.
        axios.post(`${API_URL}/api/files`, formData, { headers })
        .then(response => {
        // Show success message to the user.
        setLoading(false);

        notify("File Uploaded Successfully", "success");

        }).catch(error => {
            // Show error Message to the user
            notify("Failed to upload file, try again", "error");
            setLoading(false);
        })
        // Fetch the updated files list
        setTimeout(() => {
            window.location.reload();
        }, 2000)
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleFolderChange = (event) => {
        setFolderForm({
            ...folderForm,
            folderName: event.target.value
        });
        console.log(folderForm);
    }

    const handleFolderCreation = async (event) => {
        event.preventDefault();

        setLoading(true);
        setPopUpVisible(false);



        const response = await api('/folders', folderForm, 'POST');

        if (response.statusCode === 201)
            notify("Folder Created Successfully", "success");


        console.log(response);
        setLoading(false);
        setTimeout(() => {
            window.location.reload();
        }, 2500)
    }

    return (


        <>
            <div className="block bg-[#000000c2] p-20
                            w-full fixed top-0 left-0 h-full
                            z-1  backdrop-blur-[5px]" onClick={() => handlePopUp()}></div>
        
            <div className=" w-fit m-5 bg-[#3498db] text-white p-4
                            border-none rounded-sm left-52 top-54
                            z-1 absolute mx-auto">
                <form className='flex flex-col'>
                { isUpload
                    ? // File upload form
                        <div className="flex flex-col">
                            <label htmlFor="file" className='text-lg font-bold'>
                                Select File
                            </label>
                            <input
                                type="file"
                                name="file"
                                onChange={handleFileChange}
                                accept=".doc,.docx,.txt,.html,.js,.css,.py,.pdf" // Define accepted file types
                                className='my-10 border-2 border-[#1dbba5] p-2 cursor-pointer'
                            />
                            <div>
                                <input type="checkbox" name="checkbox" className="checkbox" id="checkbox" />
                                <label id="checkbox" htmlFor="checkbox" className='
                                ml-2 select-none
                                '>
                                Check if you want it to be in public.
                                </label>
                            </div>
                        </div>
                    : // Folder creation form
                        <div className="flex flex-col">
                            <label htmlFor="folder" className='text-lg font-bold'>
                                New Folder
                            </label>
                            <input
                                type="text"
                                name="folder"
                                onChange={handleFolderChange}
                                className='my-10 border-2 border-[#1dbba5] p-2'
                            />
                        </div>
                }
                { isUpload
                    ?
                        <input type="submit" value="upload" onClick={handleUploadFile}
                            className="bg-[#1dbba5] p-2
                            rounded-sm cursor-pointer
                            w-fit my-5 hover:bg-[#17a295] transition"
                        />

                    :
                        <input type="submit" value="create folder" onClick={handleFolderCreation}
                            className="bg-[#1dbba5] p-2
                            rounded-sm cursor-pointer
                            w-fit my-5 hover:bg-[#17a295] transition"
                        />

                }
                </form>
            </div>
        </>


    );
}

export default FileAction;