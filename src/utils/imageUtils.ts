export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';
  
  // List all possible image URLs to try
  const filename = imagePath.split('/').pop();
  
  // Try multiple possible URLs
  const urls = [
    `http://localhost:5000/uploads/pets/${filename}`,
    `http://localhost:5000${imagePath}`,
    `http://127.0.0.1:5000/uploads/pets/${filename}`,
    `http://127.0.0.1:5000${imagePath}`,
  ];
  
  // Return the first one (we'll try all in the component)
  return urls[0];
};