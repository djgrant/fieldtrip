test("does something", async () => {
  // pg-test sets DATABASE_URL, which will used by services/db.ts to create a DB connection
  console.log(process.env.DATABASE_URL);

  // Arrange

  // Act
  const response = await fetch("localhost:3000/my-endpoint");

  // Assert
  expect(response).toMatchObject({});
});
