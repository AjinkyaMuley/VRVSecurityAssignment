import { createClient } from "@supabase/supabase-js";

const supabase = createClient('https://bpzcafaystrwmukblixj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwemNhZmF5c3Ryd211a2JsaXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NTExNDcsImV4cCI6MjA0NjEyNzE0N30.EBiBYZA9EM_5HZQsvLwH0X46HBCBgTsGo0iW57Sb_o8')

// 1. Get all news
export const getAllNews = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.log('Error getting all news:', error);
        res.status(400).json(error);
    }
}

// 2. Add new news
export const addNews = async (req, res) => {
    try {
        const { 
            title, 
            category, 
            department, 
            priority, 
            content 
        } = req.body;

        const { data, error } = await supabase
            .from('news')
            .insert([{
                title,
                category,
                department,
                priority,
                content,
                publish_date: new Date(),
            }])
            .select();

        if (error) throw error;

        res.status(201).json(data);
    } catch (error) {
        console.log('Error adding news:', error);
        res.status(400).json(error);
    }
}

// 3. Edit news by ID
export const editNews = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            title, 
            category, 
            department, 
            priority, 
            content 
        } = req.body;

        const { data, error } = await supabase
            .from('news')
            .update({
                title,
                category,
                department,
                priority,
                content,
                updated_at: new Date()
            })
            .eq('id', id)
            .select();

        if (error) throw error;

        if (data.length === 0) {
            return res.status(404).json({ message: 'News not found' });
        }

        res.status(200).json(data[0]);
    } catch (error) {
        console.log('Error updating news:', error);
        res.status(400).json(error);
    }
}

// 4. Delete news by ID
export const deleteNews = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('news')
            .delete()
            .eq('id', id)
            .select();

        if (error) throw error;

        if (data.length === 0) {
            return res.status(404).json({ message: 'News not found' });
        }

        res.status(200).json({ message: 'News deleted successfully' });
    } catch (error) {
        console.log('Error deleting news:', error);
        res.status(400).json(error);
    }
}

// 5. Get news details by ID
export const getNewsById = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({ message: 'News not found' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.log('Error getting news details:', error);
        res.status(400).json(error);
    }
}

// 6. Approve news by ID
export const approveNews = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('news')
            .update({
                status: 'Published',
                updated_at: new Date()
            })
            .eq('id', id)
            .select();

        if (error) throw error;

        if (data.length === 0) {
            return res.status(404).json({ message: 'News not found' });
        }

        res.status(200).json(data[0]);
    } catch (error) {
        console.log('Error approving news:', error);
        res.status(400).json(error);
    }
}

// 7. Get news statistics by category
// Get news statistics by category
// Get news statistics by category using a single query
export const getNewsStats = async (req, res) => {
    try {
        // Fetch all distinct news categories to inspect the enum values
        const { data: categoriesData, error: categoriesError } = await supabase
            .from('news')
            .select('category', { distinct: true });

        if (categoriesError) {
            console.error('Error fetching news categories:', categoriesError);
            res.status(500).json({
                error: 'Failed to fetch news statistics',
                details: categoriesError.message
            });
            return;
        }

        // Log the distinct categories to inspect the enum values
        console.log('Distinct news categories:', categoriesData.map(item => item.category));

        // Update the Supabase query to use the correct enum values
        const { data, error } = await supabase
            .from('news')
            .select('category')
            .or('category.eq.' + categoriesData.map(item => item.category).join(',category.eq.'));

        if (error) {
            console.error('Error fetching news counts:', error);
            res.status(500).json({
                error: 'Failed to fetch news statistics',
                details: error.message
            });
            return;
        }

        // Count categories using reduce
        const stats = data.reduce((acc, item) => {
            const category = item.category;
            const key = `total_${category}s`;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {
            // Initialize the stats object with the distinct categories
            ...categoriesData.reduce((acc, item) => {
                acc[`total_${item.category}s`] = 0;
                return acc;
            }, {})
        });

        res.status(200).json(stats);
    } catch (error) {
        console.error('Error getting news statistics:', error);
        res.status(500).json({
            error: 'Failed to fetch news statistics',
            details: error.message
        });
    }
}