const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

let books = [
  {
    id: 101,
    title: "Java Programming",
    author: "Herbert Schildt",
    category: "Programming",
    quantity: 5,
    available: 5
  }
];

app.get("/", (req, res) => {
  res.send("Welcome to Library Management System API!");
});

app.get("/api/books", (req, res) => {
  res.status(200).json({
    message: "Books retrieved successfully",
    count: books.length,
    books: books
  });
});

app.get("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);

  const book = books.find(b => b.id === id);

  if (!book) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  res.status(200).json(book);
});

app.post("/api/books", (req, res) => {
  const { title, author, category, quantity } = req.body;

  if (
    typeof title !== "string" || !title.trim() ||
    typeof author !== "string" || !author.trim() ||
    typeof category !== "string" || !category.trim() ||
    !Number.isInteger(quantity) || quantity < 0
  ) {
    return res.status(400).json({
      message: "Please provide valid book details"
    });
  }

  const newId = books.length
    ? Math.max(...books.map(b => b.id)) + 1
    : 101;

  const newBook = {
    id: newId,
    title: title.trim(),
    author: author.trim(),
    category: category.trim(),
    quantity: quantity,
    available: quantity
  };

  books.push(newBook);

  res.status(201).json({
    message: "Book added successfully",
    book: newBook
  });
});

app.put("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);

  const book = books.find(b => b.id === id);

  if (!book) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  if (req.body.id !== undefined) {
    return res.status(400).json({
      message: "Book ID cannot be changed"
    });
  }

  const { title, author, category, quantity } = req.body;

  if (title !== undefined &&
      (typeof title !== "string" || !title.trim())) {
    return res.status(400).json({ message: "Invalid title" });
  }

  if (author !== undefined &&
      (typeof author !== "string" || !author.trim())) {
    return res.status(400).json({ message: "Invalid author" });
  }

  if (category !== undefined &&
      (typeof category !== "string" || !category.trim())) {
    return res.status(400).json({ message: "Invalid category" });
  }

  if (quantity !== undefined) {
    const issuedCopies = book.quantity - book.available;

    if (
      !Number.isInteger(quantity) ||
      quantity < 0 ||
      quantity < issuedCopies
    ) {
      return res.status(400).json({
        message: "Invalid quantity"
      });
    }
  }

  if (title !== undefined) book.title = title.trim();
  if (author !== undefined) book.author = author.trim();
  if (category !== undefined) book.category = category.trim();

  if (quantity !== undefined) {
    const issuedCopies = book.quantity - book.available;
    book.quantity = quantity;
    book.available = quantity - issuedCopies;
  }

  res.status(200).json({
    message: "Book updated successfully",
    book: book
  });
});

app.delete("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = books.findIndex(b => b.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  const deletedBook = books.splice(index, 1);

  res.status(200).json({
    message: "Book deleted successfully",
    book: deletedBook[0]
  });
});

app.listen(PORT, () => {
  console.log(`Library Management System running on port ${PORT}`);
});