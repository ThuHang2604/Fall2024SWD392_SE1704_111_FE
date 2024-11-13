import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Typography, TextField, Button, Backdrop, CircularProgress } from '@mui/material';
import Swal from 'sweetalert2'; // SweetAlert2 for notifications
import ProfileSidebar from './ProSidebar'; // Sidebar component
import { getUserProfileCurrent, updateCurrentProfile, setPreviewImage } from '@/redux/slice/userProfileSlice';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { imageDb } from '@/components/FirebaseImage/Config';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, isLoading, previewImage } = useSelector((state) => state.userProfile);

  const [formData, setFormData] = useState({
    imageLink: '',
    fullName: '',
    email: '',
    gender: 0,
    address: '',
    dateOfBirth: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);

  // Fetch user profile on component mount
  useEffect(() => {
    dispatch(getUserProfileCurrent());
  }, [dispatch]);

  // Update form data when user profile changes
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
      dispatch(setPreviewImage(user.imageLink || '')); // Update preview image
    }
  }, [user, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleImageUpload = (e) => {
    const selectedImage = e.target.files[0];
    if (!selectedImage) return;

    const storageRef = ref(imageDb, `Image/UserProfile/${selectedImage.name}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedImage);

    const imagePreviewUrl = URL.createObjectURL(selectedImage);
    dispatch(setPreviewImage(imagePreviewUrl)); // Immediately set the preview image in Redux

    uploadTask.on(
      'state_changed',
      null,
      (error) => {
        console.error('Image upload failed:', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({ ...prev, imageLink: downloadURL }));
          dispatch(setPreviewImage(downloadURL)); // Update Redux with final image URL
        });
      },
    );
  };

  const handleSubmit = async () => {
    const profileData = {
      userProfileId: user.userProfileId,
      fullName: formData.fullName,
      email: formData.email,
      gender: formData.gender,
      address: formData.address,
      dateOfBirth: formData.dateOfBirth,
      phone: formData.phone,
    };

    // Only include imageLink if there is a valid image URL
    if (formData.imageLink) {
      profileData.imageLink = formData.imageLink;
    }

    try {
      setLoading(true);
      const actionResult = await dispatch(updateCurrentProfile(profileData));

      if (updateCurrentProfile.fulfilled.match(actionResult)) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Profile updated successfully!',
        });
        dispatch(getUserProfileCurrent()); // Refresh user profile
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Update failed: ' + actionResult.error.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred during profile update.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <CircularProgress />;

  return (
    <Container maxWidth={false} sx={{ mt: 4, maxWidth: '1400px' }}>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box sx={{ display: 'flex', gap: '30px', flexDirection: { xs: 'column', md: 'row' } }}>
        <Box
          sx={{
            border: '3px solid black',
            borderRadius: 2,
            padding: 4,
            width: '728px',
            textAlign: 'left',
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontFamily: 'Monoton, Fantasy' }}>
            ACCOUNT
          </Typography>
          <Typography variant="body1" gutterBottom>
            View and edit your personal information below.
          </Typography>

          {/* Form Fields */}
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
              SelectProps={{ native: true }}
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

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button variant="outlined" sx={{ color: '#f26e3f', borderColor: '#f26e3f' }}>
              Discard
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#000', color: '#fff' }}
              onClick={handleSubmit}
              disabled={loading}
            >
              Update Info
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ProfilePage;
