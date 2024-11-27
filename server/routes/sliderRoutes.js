import { Router } from "express";
import { addNewSlider, deleteSliderById, getAllSliders, getSliderById, getSliderStats, updateSliderById } from "../controllers/sliderControllers.js";

const sliderRoutes = Router();

sliderRoutes.get('/get-all-sliders',getAllSliders);
sliderRoutes.get('/get-slider-id/:id',getSliderById);
sliderRoutes.post('/add-slider',addNewSlider);
sliderRoutes.put('/update-slider/:id',updateSliderById);
sliderRoutes.delete('/delete-slider/:id',deleteSliderById);
sliderRoutes.get('/sliders-stats',getSliderStats);

export default sliderRoutes