import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { ArrowLeft, Loader2 } from 'lucide-react';

const PetEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
    status: 'available',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=/pets/create');
      return;
    }
    if (id) {
      fetchPet();
    }
  }, [id, user, authLoading]);

  const fetchPet = async () => {
    setLoading(true);
    try {
      const response: any = await pets.getById(id!);
      const petData = response.pet || response.data || response;
      
      setFormData({
        name: petData.name || '',
        category: petData.category || '',
        breed: petData.breed || '',
        age_years: petData.age_years || 0,
        age_months: petData.age_months || 0,
        gender: petData.gender || '',
        price: petData.price?.toString() || '',
        description: petData.description || '',
        health_status: petData.health_status || '',
        vaccinated: petData.vaccinated === 1,
        dewormed: petData.dewormed === 1,
        neutered: petData.neutered === 1,
        microchipped: petData.microchipped === 1,
        registration_papers: petData.registration_papers === 1,
        color: petData.color || '',
        weight_kg: petData.weight_kg?.toString() || '',
        city: petData.city || '',
        state: petData.state || '',
        country: petData.country || 'Pakistan',
        status: petData.status || 'available',
      });
    } catch (error: any) {
      console.error('Failed to fetch pet:', error);
      toast.error(error.message || 'Failed to load pet data');
      navigate('/dashboard/listings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;

    if (!formData.name || !formData.category || !formData.gender || !formData.price) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('pawdeal_token');
      if (!token) throw new Error('No token found');

      const petData = {
        name: formData.name,
        category: formData.category,
        breed: formData.breed || null,
        age_years: parseInt(formData.age_years.toString()) || 0,
        age_months: parseInt(formData.age_months.toString()) || 0,
        gender: formData.gender,
        price: parseFloat(formData.price),
        description: formData.description || null,
        health_status: formData.health_status || null,
        vaccinated: formData.vaccinated ? 1 : 0,
        dewormed: formData.dewormed ? 1 : 0,
        neutered: formData.neutered ? 1 : 0,
        microchipped: formData.microchipped ? 1 : 0,
        registration_papers: formData.registration_papers ? 1 : 0,
        color: formData.color || null,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        city: formData.city || null,
        state: formData.state || null,
        country: formData.country || null,
        status: formData.status,
      };

      await pets.update(id, petData, token);
      toast.success('Pet updated successfully!');
      navigate(`/pet/${id}?updated=${Date.now()}`);
    } catch (error: any) {
      console.error('Update pet error:', error);
      toast.error(error.message || 'Failed to update pet');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-reef" />
        <p className="mt-4 text-muted-foreground">Loading pet data...</p>
      </div>
    );
  }

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
            <CardTitle className="text-3xl font-extrabold text-ocean">Edit Pet</CardTitle>
            <CardDescription>Update your pet's information</CardDescription>
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
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(v) => handleSelectChange('category', v)}>
                      <SelectTrigger>
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
                      value={formData.breed}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <Select value={formData.gender} onValueChange={(v) => handleSelectChange('gender', v)}>
                      <SelectTrigger>
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
                    <div className="flex gap-4">
                      <Input
                        type="number"
                        name="age_years"
                        placeholder="Years"
                        value={formData.age_years}
                        onChange={handleChange}
                      />
                      <Input
                        type="number"
                        name="age_months"
                        placeholder="Months"
                        value={formData.age_months}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight_kg">Weight (kg)</Label>
                    <Input
                      id="weight_kg"
                      name="weight_kg"
                      type="number"
                      step="0.1"
                      value={formData.weight_kg}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(v) => handleSelectChange('status', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                      </SelectContent>
                    </Select>
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
                    value={formData.health_status}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-ocean">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-ocean">Description</h3>
                <Textarea
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                />
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
                  disabled={submitting}
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Pet'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PetEdit;