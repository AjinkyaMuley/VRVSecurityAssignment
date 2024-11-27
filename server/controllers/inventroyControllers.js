import { createClient } from "@supabase/supabase-js";


const supabase = createClient('https://bpzcafaystrwmukblixj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwemNhZmF5c3Ryd211a2JsaXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NTExNDcsImV4cCI6MjA0NjEyNzE0N30.EBiBYZA9EM_5HZQsvLwH0X46HBCBgTsGo0iW57Sb_o8')


// Get all books
export const getAllBooks = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('books')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.log('Error getting all books:', error);
        res.status(400).json(error);
    }
};

// Get book by ISBN
export const getBookByIsbn = async (req, res) => {
    try {
        const { isbn } = req.params;
        
        const { data, error } = await supabase
            .from('books')
            .select('*')
            .eq('isbn', isbn)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({ message: 'Book not found' });
            }
            throw error;
        }

        res.status(200).json(data);
    } catch (error) {
        console.log('Error getting book details:', error);
        res.status(400).json(error);
    }
};

// Add new book
export const addBook = async (req, res) => {
    try {
        const { isbn, title, author, category } = req.body;
        
        const { data, error } = await supabase
            .from('books')
            .insert([{
                isbn,
                title,
                author,
                category,
                status: 'AVAILABLE' // Using default value
            }])
            .select();

        if (error) throw error;

        res.status(201).json(data[0]);
    } catch (error) {
        console.log('Error adding new book:', error);
        res.status(400).json(error);
    }
};

// Update book
export const updateBook = async (req, res) => {
    try {
        const { isbn } = req.params;
        const { title, author, category, status } = req.body;

        const { data, error } = await supabase
            .from('books')
            .update({
                title,
                author,
                category,
                status
            })
            .eq('isbn', isbn)
            .select();

        if (error) throw error;

        if (data.length === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json(data[0]);
    } catch (error) {
        console.log('Error updating book:', error);
        res.status(400).json(error);
    }
};

// Delete book
export const deleteBook = async (req, res) => {
    try {
        const { isbn } = req.params;

        const { error: issuesError } = await supabase
            .from('book_issues')
            .delete()
            .eq('isbn', isbn);

        if (issuesError) throw issuesError;


        const { data, error } = await supabase
            .from('books')
            .delete()
            .eq('isbn', isbn)
            .select();

        if (error) throw error;

        if (data.length === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.log('Error deleting book:', error);
        res.status(400).json(error);
    }
};

// Get books statistics
export const getBooksStats = async (req, res) => {
    try {
        // Get total books count
        const { count: totalBooks } = await supabase
            .from('books')
            .select('*', { count: 'exact', head: true });

        // Get available books count
        const { count: availableBooks } = await supabase
            .from('books')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'AVAILABLE');

        // Get issued books count
        const { count: issuedBooks } = await supabase
            .from('books')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'ISSUED');

        // Get unique categories count
        const { data: categories } = await supabase
            .from('books')
            .select('category')
            .not('category', 'is', null);

        const uniqueCategories = new Set(categories.map(book => book.category)).size;

        res.status(200).json({
            totalBooks,
            availableBooks,
            issuedBooks,
            totalCategories: uniqueCategories
        });
    } catch (error) {
        console.log('Error getting books statistics:', error);
        res.status(400).json(error);
    }
};