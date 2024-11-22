import axios from 'axios';
import API from './api';
import * as FileSystem from 'expo-file-system';

export const getJobs = async () => {
    try {
        const response = await API.get('/jobs/get-all-jobs');
        const jobs = response.data.jobs || [];
        return jobs;
    } catch (error) {
        console.error(error);
    }
}

export const getJobSavedjobs = async () => {
    try {
        const response = await API.get('/saved-jobs/get');
        const jobs = response.data.jobs || [];
        return jobs;
    } catch (error) {
        console.error(error);
    }
}

export const saveJob = async (jobId) => {
    try {
        const response = await API.post('/saved-jobs/save', { jobId });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const unsaveJob = async () => {
    try {
        const response = await API.post('/saved-jobs/delete:jobId');
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
}

export const applyJob = async () => {
    
}