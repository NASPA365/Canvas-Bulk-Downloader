import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const token = process.env.CANVAS_TOKEN;
const apiUrl = 'https://haskoliislands.instructure.com/api/v1';



async function getCurrentCourses() {
  try {
    const response = await fetch(
      `${apiUrl}/courses?enrollment_state=active&state[]=published&state[]=available&per_page=100&include=enrollments`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    
    const currentCourses = await response.json();  // Already filtered by params!
    
    console.log(`📚 ${currentCourses.length} CURRENT enrolled courses:`);
    currentCourses.forEach(course => {
      console.log(`  • ${course.course_code} - ${course.name}`);
    });
    
    return currentCourses;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}


getCurrentCourses();
