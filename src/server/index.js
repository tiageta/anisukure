const PORT = process.env.PORT || 3000;

export default (app) => {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
};
