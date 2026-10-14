// cPanel "Setup Node.js App" startup file. Passenger provides PORT.
process.env.NITRO_PORT ||= process.env.PORT || '3000';
await import('./server/index.mjs');
