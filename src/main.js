
const { app } = require('./app/main');
const { reader } = require('./core/reader');
require('./core/event');

app.lock(argv => {
    // Open books in current window on second instance
    reader.openAll(argv.slice(2));
});

app.run(() => {
    reader.openAll(process.argv.slice(2));
});
