'use server';

// import { z } from "zod";

// Define a simple type for the input data
type JobData = {
  title: string;
};

// Server action to handle the submission
export async function JobFormSubmission(data: JobData) {
  try {
    // Validate data on the server side
    if (!data.title || data.title.trim() === '') {
      return { success: false, error: "Job title can't be empty" };
    }
    
    // Make API request or direct database call
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create job');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error creating job:', error);
    return { success: false, error: (error as Error).message };
  }
}