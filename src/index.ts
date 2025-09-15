import { config } from './config';
import { createHttpServer } from './server/http';


const { server } = createHttpServer();
server.listen(config.port, () => console.log(`[server] on :${config.port}`));