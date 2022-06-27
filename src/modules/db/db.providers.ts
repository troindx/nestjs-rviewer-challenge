import * as mongoDB from 'mongodb';
import 'dotenv/config';

export const DbProviders = [
    {
      provide: 'ASYNC_CONNECTION',
      useFactory: async () => {
        try {
          let mongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);
          return await mongoClient.connect();
        } catch (error) {
          console.error("Problem when connecting to database. Make sure you are running a mongodb instance."+
          "Make sure your .env file is set properly. Check your docker services. "+
          "The current connection string is: "+ process.env.DB_CONN_STRING);
          console.error(error);
        }
  
      },
    },
  ];