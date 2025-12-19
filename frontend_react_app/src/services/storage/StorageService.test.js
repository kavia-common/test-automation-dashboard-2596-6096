import { upload, list } from "./StorageService";

test("Mock storage upload/list works", async () => {
  const file = new File([new Blob(["hello"])], "hello.txt", { type: "text/plain" });
  const res = await upload(file, "unit-tests");
  expect(res.path).toContain("unit-tests/hello.txt");
  const items = await list("unit-tests");
  expect(items.some(i => i.name === "hello.txt")).toBe(true);
});
