import { useState, useContext } from "react";
import { createContext } from "react";
import { CircularProgress } from '@mui/material';
import { useNavigate } from "react-router";


const ExplorerContext = createContext();

export function ExplorerProvider({ children }) {
    const [path, setPath] = useState(['/']);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const folderRedirects = (folderName, folderId) => {
        setPath(path);
        navigate(`/folders/${folderId}`);
    }   

    return (
        <ExplorerContext.Provider value={{ path, setPath, loading, setLoading, folderRedirects }}>
            {children}
        </ExplorerContext.Provider>
    )
}


export const useBrowser = () => useContext(ExplorerContext);