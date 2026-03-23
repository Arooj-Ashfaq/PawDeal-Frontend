import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { pets } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';

const PetCreate: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    breed: '',
    age_years: 0,
    age_months: 0,
    gender: '',
    price: '',
    description: '',
    health_status: '',
    vaccinated: false,
    dewormed: false,
    neutered: false,
    microchipped: false,
    registration_papers: false,
    color: '',
    weight_kg: '',
    city: '',
    state: '',
    country: 'Pakistan',
  });

  if (!authLoading && !user) {
    navigate('/login?redirect=/pets/create');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
    });

    setImages([...images, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreview(imagePreview.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.name || !formData.category || !formData.gender || !formData.price) {
      toast.error('Please fill all required fields');
      return;
    }

    if (images.length === 0) {
      toast.error('Please upload at least one photo');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('pawdeal_token');
      if (!token) throw new Error('No token found');

      // First create the pet
      const petData = {
        ...formData,
        price: parseFloat(formData.price),
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        age_years: parseInt(formData.age_years.toString()),
        age_months: parseInt(formData.age_months.toString()),
      };

      const response: any = await pets.create(petData, token);

// Then upload images (you'll need an image upload endpoint)
// For now, we'll just show success

toast.success('Pet listed successfully!');
navigate(`/pet/${response.id || response.petId || response.data?.id}`);
    } catch (error: any) {
      console.error('Create pet error:', error);
      toast.error(error.message || 'Failed to create pet listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-foam min-h-screen py-12">
      <div className="container max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-ocean hover:text-reef"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <Card className="border-none shadow-xl rounded-3xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold text-ocean">Add a New Pet</CardTitle>
            <CardDescription>List your pet for adoption or sale</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-ocean">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Pet Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter pet name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(v) => handleSelectChange('category', v)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dog">Dog</SelectItem>
                        <SelectItem value="cat">Cat</SelectItem>
                        <SelectItem value="fish">Fish</SelectItem>
                        <SelectItem value="bird">Bird</SelectItem>
                        <SelectItem value="small_animal">Small Animal</SelectItem>
                        <SelectItem value="reptile">Reptile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="breed">Breed</Label>
                    <Input
                      id="breed"
                      name="breed"
                      placeholder="e.g., Golden Retriever"
                      value={formData.breed}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <Select value={formData.gender} onValueChange={(v) => handleSelectChange('gender', v)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Age</Label>
                    <div className="flex gap-4 mt-1">
                      <Input
                        type="number"
                        name="age_years"
                        placeholder="Years"
                        value={formData.age_years}
                        onChange={handleChange}
                        className="w-1/2"
                      />
                      <Input
                        type="number"
                        name="age_months"
                        placeholder="Months"
                        value={formData.age_months}
                        onChange={handleChange}
                        className="w-1/2"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      name="color"
                      placeholder="e.g., Brown, White"
                      value={formData.color}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight_kg">Weight (kg)</Label>
                    <Input
                      id="weight_kg"
                      name="weight_kg"
                      type="number"
                      step="0.1"
                      placeholder="Weight in kg"
                      value={formData.weight_kg}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      placeholder="Enter price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Health Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-ocean">Health Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="vaccinated"
                      checked={formData.vaccinated}
                      onCheckedChange={(c) => handleCheckboxChange('vaccinated', c as boolean)}
                    />
                    <Label htmlFor="vaccinated">Vaccinated</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dewormed"
                      checked={formData.dewormed}
                      onCheckedChange={(c) => handleCheckboxChange('dewormed', c as boolean)}
                    />
                    <Label htmlFor="dewormed">Dewormed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="neutered"
                      checked={formData.neutered}
                      onCheckedChange={(c) => handleCheckboxChange('neutered', c as boolean)}
                    />
                    <Label htmlFor="neutered">Neutered/Spayed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="microchipped"
                      checked={formData.microchipped}
                      onCheckedChange={(c) => handleCheckboxChange('microchipped', c as boolean)}
                    />
                    <Label htmlFor="microchipped">Microchipped</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="registration_papers"
                      checked={formData.registration_papers}
                      onCheckedChange={(c) => handleCheckboxChange('registration_papers', c as boolean)}
                    />
                    <Label htmlFor="registration_papers">Registration Papers</Label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="health_status">Health Status</Label>
                  <Input
                    id="health_status"
                    name="health_status"
                    placeholder="e.g., Healthy, Needs medical attention"
                    value={formData.health_status}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-ocean">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      placeholder="Country"
                      value={formData.country}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-ocean">Description</h3>
                <Textarea
                  name="description"
                  placeholder="Describe your pet - personality, habits, reason for listing, etc."
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              {/* Photos */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-ocean">Photos *</h3>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex flex-col items-center gap-2 text-muted-foreground hover:text-reef transition-colors"
                  >
                    <Upload className="w-12 h-12" />
                    <span>Click to upload photos (max 5)</span>
                    <span className="text-xs">JPEG, PNG, WebP up to 5MB</span>
                  </Label>
                </div>

                {imagePreview.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                    {imagePreview.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="flex-1 h-12"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-reef hover:bg-reef/90 text-white h-12"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'List Pet'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PetCreate;