import { createClient } from "@supabase/supabase-js";

const supabase = createClient('https://bpzcafaystrwmukblixj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwemNhZmF5c3Ryd211a2JsaXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NTExNDcsImV4cCI6MjA0NjEyNzE0N30.EBiBYZA9EM_5HZQsvLwH0X46HBCBgTsGo0iW57Sb_o8')

// 1. View all payments
export const getAllPayments = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return res.status(200).json(data);
    } catch (error) {
        console.log('Error fetching all payments:', error);
        return res.status(400).json(error);
    }
};

// 2. View payment by ID
export const getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.log('Error fetching payment by ID:', error);
        return res.status(400).json(error);
    }
};

// 3. Add new payment
export const addPayment = async (req, res) => {
    try {
        const {
            student_name,
            amount,
            due_date,
            payment_method
        } = req.body;

        // Validate required fields
        if (!student_name || !amount || !due_date) {
            return res.status(400).json({ 
                message: 'Missing required fields: student_name, amount, and due_date are required' 
            });
        }

        const { data, error } = await supabase
            .from('payments')
            .insert({
                student_name,
                amount,
                due_date,
                status: 'Unpaid',  // Default status
                payment_method: payment_method || 'Pending'
            })
            .select();

        if (error) throw error;

        return res.status(201).json(data[0]);
    } catch (error) {
        console.log('Error adding new payment:', error);
        return res.status(400).json({
            message: 'Error adding new payment',
            error: error.message
        });
    }
};


// 4. Update payment status to Paid
export const markAsPaid = async (req, res) => {
    try {
        const { id } = req.params;
        const { payment_method } = req.body;

        const { data, error } = await supabase
            .from('payments')
            .update({
                status: 'Paid',
                payment_date: new Date().toISOString(),
                payment_method,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select();

        if (error) throw error;

        if (data.length === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        return res.status(200).json(data[0]);
    } catch (error) {
        console.log('Error updating payment status:', error);
        return res.status(400).json(error);
    }
};

// 5. Get payment statistics
export const getPaymentStats = async (req, res) => {
    try {
        // Get total count
        const { count: totalCount, error: countError } = await supabase
            .from('payments')
            .select('*', { count: 'exact', head: true });

        if (countError) throw countError;

        // Get paid count
        const { count: paidCount, error: paidError } = await supabase
            .from('payments')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'Paid');

        if (paidError) throw paidError;

        // Get unpaid count
        const { count: unpaidCount, error: unpaidError } = await supabase
            .from('payments')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'Unpaid');

        if (unpaidError) throw unpaidError;

        return res.status(200).json({
            total_entries: totalCount,
            paid_entries: paidCount,
            unpaid_entries: unpaidCount
        });
    } catch (error) {
        console.log('Error fetching payment statistics:', error);
        return res.status(400).json(error);
    }
};