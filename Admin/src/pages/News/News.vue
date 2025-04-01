import jwt_decode from 'jwt-decode';

const saveItem = async () => {
  try {
    if (!formData.value.name_en || !formData.value.name_lo) {
      showSnackbar('Title is required in both languages', 'error');
      return;
    }

    const formDataObj = new FormData();
    
    // Get user ID from token
    const token = localStorage.getItem('token');
    const decodedToken = jwt_decode(token); // Add jwt-decode package
    const userId = decodedToken.id;
    
    // Append all text fields
    Object.keys(formData.value).forEach(key => {
      if (key !== 'image' && key !== 'images') {
        formDataObj.append(key, formData.value[key]);
      }
    });

    // Append userId
    formDataObj.append('userId', userId);

    // Append main image if exists
    if (formData.value.image instanceof File) {
      formDataObj.append('image', formData.value.image);
    }

    // Append additional images if they exist
    if (formData.value.images?.length) {
      formData.value.images.forEach(image => {
        formDataObj.append('images', image);
      });
    }

    const method = isEditing.value ? 'PUT' : 'POST';
    const url = isEditing.value 
      ? `${apiUrl}/api/news/${formData.value.news_id}`
      : `${apiUrl}/api/news`;

    const response = await axios({
      method,
      url,
      data: formDataObj,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    await fetchNews();
    showSnackbar(`News ${isEditing.value ? 'updated' : 'created'} successfully`);
    closeDialog();
  } catch (error) {
    console.error('Error saving news:', error);
    showSnackbar(error.response?.data?.error || 'Error saving news', 'error');
  }
}; 
