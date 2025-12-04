import FoldersService from '../services/FoldersService';


class FoldersController {

    /**
     * Retrieve files that stroed insdie the folder
     * @param {Request} req 
     * @param {Response} res 
     * @param {import('express').NextFunction} next 
     * @returns 
     */
    static async getFolderFiles(req, res, next) {
        try {
            // Pass the request body, request query parameters
            // and the current user id to the folder service.
            const result = await FoldersService.getFolderFiles(
                req.params,
                req.query,
                req.user._id.toString()
            );

            // Return the response with OK http code (200).
            return res.status(200).json({
                ...result,
                statusCode: 200
            });
        } catch(error) {
            // Pass the error to the global error handler
            next(error);
        }
    }
  /**
   * Handle folder creation
   * @param {Request} req 
   * @param {Response} res 
   * @param {import('express').NextFunction} next 
   */
  static async newFolder(req, res, next) {
    try {
      // Pass the request body and current user data to the file service.
      const result = await FoldersService.newFolder(req.body, req.user);

      // Return the response with CREATED http code.
      res.status(201).json({
        ...result,
        statusCode: 201
      });
    } catch(error) {
      // Pass the error to the global error handler
      next(error);
    }
  }

  static async deleteFolder(req, res, next) {
    try {
        // Pass the request body tot he folder service.
        const result = await FoldersService.deleteFolder(
            req.params,
            req.user._id.toString()
        );

        // Return the response with OK http code (200).
        return res.status(204).json({
            ...result,
            statusCode: 204
        });
    } catch(error) {
        // Pass the error to the global error handler
        next(error);
    }
  }
}

export default FoldersController;