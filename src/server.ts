import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles, empty, isImageURL } from './util/util';
import { authenticated } from './services/auth';
require('dotenv').config();

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  //Filter image from the passed URL, if URL is a valid publicly accessible image URL
  app.get("/filteredimage", authenticated, async (req: Request, res: Response) => {
    const { image_url } = req.query;
    if (empty(image_url)) {
      return res.status(400).send({ 'message': 'image_url is required in the URL query'})
    }
   
    const image = await isImageURL(image_url);
    if (!image) {
      return res.status(422).send({ 'message': 'image_url is not a valid image url'})
    }

    filterImageFromURL(image).then((path: string) => {
      res.status(200).sendFile(path);
      res.addListener('finish', () => {
        deleteLocalFiles([path]);
      })
    }).catch((error) => {
      res.status(500).send('A server error occurred')
    }).finally(() => {
      res.removeAllListeners('finish')
    })
  })

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: Request, res: Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();