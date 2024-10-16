import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Typography, TextField, Button } from '@mui/material';
import ProfileSidebar from './ProSidebar';
import { getUserProfile, updateCurrentProfile } from '@/redux/slice/authSlice';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { imageDb } from '@/components/FirebaseImage/Config';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    imageLink: '',
    fullName: '',
    email: '',
    gender: 0,
    address: '',
    dateOfBirth: '',
    phone: '',
  });

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        imageLink: user.imageLink || '',
        fullName: user.fullName || '',
        email: user.email || '',
        gender: user.gender || 0,
        address: user.address || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleImageChange = (image) => {
    setFormData((prev) => ({
      ...prev,
      imageLink: image,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const selectedImage = e.target.files[0];
    if (!selectedImage) return;

    const storageRef = ref(imageDb, `Image/UserProfile/${selectedImage.name}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedImage);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // You can handle progress here if needed
      },
      (error) => {
        console.error('Image upload failed:', error);
      },
      () => {
        // Get the download URL when the upload is complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          handleImageChange(downloadURL); // Pass the image URL to the form data
        });
      },
    );
  };

  const handleSubmit = async () => {
    try {
      const actionResult = await dispatch(updateCurrentProfile(formData));
      if (updateCurrentProfile.fulfilled.match(actionResult)) {
        setFormData((prev) => ({
          ...prev,
          ...actionResult.payload,
        }));
      } else {
        console.error('Update failed:', actionResult.error.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Container maxWidth={false} sx={{ mt: 4, maxWidth: '1400px' }}>
      <Box
        sx={{
          display: 'flex',
          gap: '30px',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <ProfileSidebar user={user} onImageChange={handleImageChange} />

        <Box
          sx={{
            border: '3px solid black',
            borderRadius: 2,
            padding: 3,
            width: { xs: '100%', md: '70%' },
            textAlign: 'left',
          }}
        >
          {/* Account Title */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              color: '#f26e3f',
              fontFamily: 'Monoton, Fantasy',
            }}
          >
            ACCOUNT
          </Typography>
          <Typography variant="body2" mb={2}>
            View and edit your personal info below.
          </Typography>

          {/* Personal Info Section */}
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            PERSONAL INFO
          </Typography>
          <Typography variant="body2" mb={2}>
            Update your personal information.
          </Typography>

          <Box sx={{ display: 'flex', gap: '20px', flexDirection: { xs: 'column', sm: 'row' }, mb: 2 }}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              sx={{ mt: 2 }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: '20px', flexDirection: { xs: 'column', sm: 'row' }, mb: 2 }}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Gender"
              name="gender"
              select
              value={formData.gender}
              onChange={handleChange}
              sx={{ mt: 2 }}
              SelectProps={{
                native: true,
              }}
            >
              <option value={0}>Male</option>
              <option value={1}>Female</option>
              <option value={2}>Other</option>
            </TextField>
          </Box>

          <Box sx={{ display: 'flex', gap: '20px', flexDirection: { xs: 'column', sm: 'row' }, mb: 2 }}>
            <TextField
              fullWidth
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              sx={{ mt: 2 }}
            />
          </Box>

          {/* Image Upload Section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {/* <Button variant="contained" sx={{ backgroundColor: '#000', color: '#fff' }}>
              Upload Image
            </Button> */}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button variant="outlined" sx={{ color: '#f26e3f', borderColor: '#f26e3f' }}>
              Discard
            </Button>
            <Button variant="contained" sx={{ backgroundColor: '#000', color: '#fff' }} onClick={handleSubmit}>
              Update Info
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ProfilePage;
