app.get('/ping', (req, res) => {
  res.json({ pong: true });
});
