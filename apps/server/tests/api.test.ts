import getDatabase from "@databases/pg-test";

async function setup() {
  const { databaseURL, kill } = await getDatabase();
}

test("does something", async () => {
  // Arrange
  await setup();

  // Act
  const response = await fetch("localhost:3000/my-endpoint");

  // Assert
  expect(response).toMatchObject({});
});
