import express from 'express';
import cors from 'cors';
import router from './routes/index';
import AppRouter from './routes/AppRoutes';
import UsersRouter from './routes/UsersRoutes';
import AuthRouter from './routes/AuthRoutes';
import FilesRouter from './routes/FilesRoutes';
import FoldersRouter from './routes/FolderRoutes';


const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());
app.use(router);
app.use('/api/v1', AppRouter);
app.use('/api/v1', UsersRouter);
app.use('/api/v1', AuthRouter);
app.use('/api/v1', FilesRouter);
app.use('/api/v1', FoldersRouter);

app.use((error, req, res, next) => {
  // Default to 500 internal server error.
  error.statusCode = error.statusCode || 500;

  console.log(error.message);

  // Handle body too large error.
  if (error.type === 'entity.too.large') {
    return res.status(400).json({
      message: "Payload Too Large, max allowed size is 1MB",
      statusCode: 400
    });
  }

  // Check if it' operational (one of ours)
  if (error.isOperational) {
    console.log(error);
    return res.status(error.statusCode).json({
      message: error.message,
      statusCode: error.statusCode,
      ...error.customMessages
    });
  } else {
    return res.status(500).json({
      message: "Internal Server Error",
      statusCode: 500,
      error: error.message
    });
  }

})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
