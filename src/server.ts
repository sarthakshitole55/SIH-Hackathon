import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { patientsRouter } from './routes/patients';
import { practitionersRouter } from './routes/practitioners';
import { therapiesRouter } from './routes/therapies';
import { sessionsRouter } from './routes/sessions';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
	res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/patients', patientsRouter);
app.use('/api/practitioners', practitionersRouter);
app.use('/api/therapies', therapiesRouter);
app.use('/api/sessions', sessionsRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
	console.log(`API listening on http://localhost:${port}`);
});


