import { CircularProgress } from '@mui/material';


function CircularLoading() {
    return (
        <div className='w-fit my-20 mx-auto'>
          <CircularProgress
            color='success'
          />
        </div>
    );
}

export default CircularLoading;