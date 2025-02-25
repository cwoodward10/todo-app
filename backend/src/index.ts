import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { scheduleJob } from 'node-schedule';

import { todos } from './routes/todos.js';
import { repeatables } from './routes/repeatables.js';
import { CheckTriggeredRepeatables } from './helpers/repeatables.js';
import { AddTodos } from './helpers/todos.js';

const port = process.env.PORT ? Number.parseInt(process.env.PORT) : 3000;
const urlPrefix = process.env.URL_PREFIX ?? 'todo-api';

const app = new Hono().basePath(urlPrefix);

app.use('*', cors({
  origin: 'http://localhost:5173',
  allowHeaders: ['Content-Type'],
  allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
}))
app.options('*', (c) => {
  return c.text('', 203)
})

app.get('/', (c) => {
  return c.text('Hello! This is the backend for our To-dos!')
})

app.route(`/todos`, todos);
app.route(`/repeatables`, repeatables);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    // Get the custom response
    console.error(err);
    return err.getResponse();
  }
  
  return c.text(`Unkown error occurred: ${err.message}`, 500)
})

// check repeatables at 3am everyday
const checkRepeatables = scheduleJob('0 3 * * *', async () => {
  const today = new Date();
  console.log(`Checking for to-dos on ${today.getMonth()}/${today.getDate()}/${today.getFullYear()}`)
  
  try {
    const newTodos = await CheckTriggeredRepeatables(today);
    await AddTodos(newTodos);
    console.log(`Added ${(newTodos).length} new to-dos`);
  } catch (e) {
    console.error("Error checking today's repeatable to-dos");
    console.error(e);
  }
});

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port} with url prefix: ${urlPrefix}`)
})
