db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
);