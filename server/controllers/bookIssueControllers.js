import { createClient } from "@supabase/supabase-js";

const supabase = createClient('https://bpzcafaystrwmukblixj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwemNhZmF5c3Ryd211a2JsaXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NTExNDcsImV4cCI6MjA0NjEyNzE0N30.EBiBYZA9EM_5HZQsvLwH0X46HBCBgTsGo0iW57Sb_o8')


export const addNewBookIssue = async (req, res) => {
    try {
        const { member_id, isbn, issue_date, due_date } = req.body;

        // Generate a unique issue_id using the current year and a random 4-digit number
        const issue_id = `ISS-${new Date().getFullYear().toString().slice(2)}${(Math.random() * 9999).toFixed(0).padStart(4, '0')}`;

        const { data, error } = await supabase
            .from('book_issues')
            .insert([
                {
                    issue_id: `ISS-${new Date().getFullYear().toString().slice(2)}${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
                    member_id,
                    isbn,
                    issue_date,
                    due_date,
                    status: 'ISSUED'
                }
            ])
            .select();

        if (error) {
            throw error;
        }

        res.status(201).json(data[0]);
    } catch (err) {
        console.error('Error adding new book issue:', err);
        res.status(400).json({ error: err.message });
    }
};

export const editBookIssue = async (req, res) => {
    try {
        const { issue_id } = req.params;
        const { member_id, isbn, issue_date, due_date, status } = req.body;
        const return_date=due_date;

        const { data, error } = await supabase
            .from('book_issues')
            .update({
                member_id,
                isbn,
                issue_date,
                due_date,
                return_date,
                status
            })
            .eq('issue_id', issue_id)
            .select();

        if (error) {
            throw error;
        }

        res.status(200).json(data[0]);
    } catch (err) {
        console.error('Error editing book issue:', err);
        res.status(400).json({ error: err.message });
    }
};

export const getBookIssueDetails = async (req, res) => {
    try {
        const { issue_id } = req.params;

        const { data, error } = await supabase
            .from('book_issues')
            .select('*, members:member_id(*), books:isbn(*)')
            .eq('issue_id', issue_id)
            .single();

        if (error) {
            throw error;
        }

        res.status(200).json(data);
    } catch (err) {
        console.error('Error getting book issue details:', err);
        res.status(400).json({ error: err.message });
    }
};

export const getAllIssuedBooks = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('book_issues')
            .select('*, members:member_id(*), books:isbn(*)')
            .eq('status', 'ISSUED');

        if (error) {
            throw error;
        }

        res.status(200).json(data);
    } catch (err) {
        console.error('Error getting all issued books:', err);
        res.status(400).json({ error: err.message });
    }
};

export const getBookIssueStats = async (req, res) => {
    try {
        const totalIssuesResponse = await supabase
            .from('book_issues')
            .select('*', { count: 'exact', head: true });

        const currentMonthIssuesResponse = await supabase
            .from('book_issues')
            .select('*', { count: 'exact', head: true })
            .gte('issue_date', new Date().toISOString().slice(0, 7) + '-01')
            .lt('issue_date', new Date().toISOString().slice(0, 10));

        const overdueIssuesResponse = await supabase
            .from('book_issues')
            .select('*', { count: 'exact', head: true })
            .gte('due_date', new Date().toISOString().slice(0, 10))
            .is('return_date', null);

        const dueTodayResponse = await supabase
            .from('book_issues')
            .select('*', { count: 'exact', head: true })
            .eq('due_date', new Date().toISOString().slice(0, 10));

        const totalIssues = totalIssuesResponse.count || 0;
        const currentMonthIssues = currentMonthIssuesResponse.count || 0;
        const overdueIssues = overdueIssuesResponse.count || 0;
        const dueToday = dueTodayResponse.count || 0;

        res.status(200).json({
            totalIssues,
            currentMonthIssues,
            overdueIssues,
            dueToday,
        });
    } catch (err) {
        console.error('Error getting book issue statistics:', err);
        res.status(400).json({ error: err.message });
    }
};


