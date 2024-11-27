import { createClient } from "@supabase/supabase-js";

const supabase = createClient('https://bpzcafaystrwmukblixj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwemNhZmF5c3Ryd211a2JsaXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA1NTExNDcsImV4cCI6MjA0NjEyNzE0N30.EBiBYZA9EM_5HZQsvLwH0X46HBCBgTsGo0iW57Sb_o8');

// 1. View all data entries
export const getAllSliders = async (req, res) => {
  try {
    const { data } = await supabase.from('slider').select();
    res.status(200).json(data);
  } catch (error) {
    console.log('Error getting all sliders', error);
    res.status(400).json(error);
  }
};

// 2. View details of a particular data entry based on id
export const getSliderById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await supabase.from('slider').select().eq('id', id).single();
    res.status(200).json(data);
  } catch (error) {
    console.log('Error getting slider by id', error);
    res.status(400).json(error);
  }
};

// 3. Add a new data entry
export const addNewSlider = async (req, res) => {
  try {
    const { title, image, status, order, location, publish_date } = req.body;
    const { data, error } = await supabase.from('slider').insert([
      { title, image, status, order, location, publish_date },
    ]);
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.log('Error adding new slider', error);
    res.status(400).json(error);
  }
};

// 4. Edit a data entry based on id
export const updateSliderById = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image, status, order, location, publish_date } = req.body;
    const { data, error } = await supabase.from('slider').update({
      title, image, status, order, location, publish_date,
    }).eq('id', id);
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.log('Error updating slider', error);
    res.status(400).json(error);
  }
};

// 5. Delete a data entry based on id
export const deleteSliderById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('slider').delete().eq('id', id);
    if (error) throw error;
    res.status(200).json({ message: 'Slider deleted successfully' });
  } catch (error) {
    console.log('Error deleting slider', error);
    res.status(400).json(error);
  }
};

// 6. Display the stats which shows total sliders, published sliders, and unpublished sliders
export const getSliderStats = async (req, res) => {
  try {
    const { data: totalSliders } = await supabase.from('slider').select('id');
    const { data: publishedSliders } = await supabase.from('slider').select('id').eq('status', 'Published');
    const { data: unpublishedSliders } = await supabase.from('slider').select('id').eq('status', 'unpublished');

    const stats = {
      totalSliders: totalSliders.length,
      publishedSliders: publishedSliders.length,
      unpublishedSliders: unpublishedSliders.length,
    };

    res.status(200).json(stats);
  } catch (error) {
    console.log('Error getting slider stats', error);
    res.status(400).json(error);
  }
};