import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { products } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';

const ProductCreate: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    pet_type: [] as string[],
    description: '',
    price: '',
    sale_price: '',
    stock_quantity: 1,
    sku: '',
    brand: '',
    weight_kg: '',
    dimensions: '',
    materials: '',
    care_instructions: '',
  });

  if (!authLoading && !user) {
    navigate('/login?redirect=/products/create');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handlePetTypeChange = (value: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, pet_type: [...formData.pet_type, value] });
    } else {
      setFormData({ ...formData, pet_type: formData.pet_type.filter(t => t !== value) });
    }
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

    if (!formData.name || !formData.category || !formData.price) {
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

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
        stock_quantity: parseInt(formData.stock_quantity.toString()),
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
      };

      const response: any = await products.create(productData, token);

      toast.success('Product listed successfully!');
      navigate(`/product/${response.id || response.productId || response.data?.id}`);
    } catch (error: any) {
      console.error('Create product error:', error);
      toast.error(error.message || 'Failed to create product listing');
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
            <CardTitle className="text-3xl font-extrabold text-ocean">Add a New Product</CardTitle>
            <CardDescription>List your pet product for sale</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-ocean">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter product name"
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
                        <SelectItem value="food">Food</SelectItem>
                        <SelectItem value="toys">Toys</SelectItem>
                        <SelectItem value="beds">Beds</SelectItem>
                        <SelectItem value="collars">Collars & Leashes</SelectItem>
                        <SelectItem value="grooming">Grooming</SelectItem>
                        <SelectItem value="health">Health & Wellness</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="apparel">Apparel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Input
                      id="subcategory"
                      name="subcategory"
                      placeholder="e.g., Dry Food, Chew Toys"
                      value={formData.subcategory}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      name="brand"
                      placeholder="Brand name"
                      value={formData.brand}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                    <Input
                      id="sku"
                      name="sku"
                      placeholder="Unique product code"
                      value={formData.sku}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                    <Input
                      id="stock_quantity"
                      name="stock_quantity"
                      type="number"
                      min="0"
                      placeholder="Number in stock"
                      value={formData.stock_quantity}
                      onChange={handleChange}
                      required
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
                      placeholder="Regular price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sale_price">Sale Price ($)</Label>
                    <Input
                      id="sale_price"
                      name="sale_price"
                      type="number"
                      step="0.01"
                      placeholder="Discounted price (optional)"
                      value={formData.sale_price}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Pet Type */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-ocean">Suitable For</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['dog', 'cat', 'bird', 'fish', 'small_animal', 'reptile'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`pet_${type}`}
                        checked={formData.pet_type.includes(type)}
                        onCheckedChange={(c) => handlePetTypeChange(type, c as boolean)}
                      />
                      <Label htmlFor={`pet_${type}`} className="capitalize">
                        {type.replace('_', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-ocean">Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <Label htmlFor="dimensions">Dimensions</Label>
                    <Input
                      id="dimensions"
                      name="dimensions"
                      placeholder="e.g., 10x20x5 cm"
                      value={formData.dimensions}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="materials">Materials</Label>
                    <Input
                      id="materials"
                      name="materials"
                      placeholder="e.g., Cotton, Plastic, Wood"
                      value={formData.materials}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="care_instructions">Care Instructions</Label>
                    <Input
                      id="care_instructions"
                      name="care_instructions"
                      placeholder="e.g., Machine wash, Hand wash"
                      value={formData.care_instructions}
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
                  placeholder="Describe your product - features, benefits, etc."
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
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'List Product'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductCreate;