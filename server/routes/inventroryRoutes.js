import { Router } from "express";
import { addBook, deleteBook, getAllBooks, getBookByIsbn, getBooksStats, updateBook } from "../controllers/inventroyControllers.js";

const inventoryRoutes = Router();

inventoryRoutes.get('/get-all-books',getAllBooks);
inventoryRoutes.get('/get-book-by-id/:isbn',getBookByIsbn);
inventoryRoutes.get('/get-book-stats',getBooksStats);
inventoryRoutes.post('/add-book',addBook);
inventoryRoutes.put('/edit-book/:isbn',updateBook);
inventoryRoutes.delete('/delete-book/:isbn',deleteBook);

export default inventoryRoutes