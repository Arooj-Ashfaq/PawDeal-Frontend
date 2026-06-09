import React, { useState, useEffect } from 'react';
import { Save, Loader2, RefreshCw, Globe, DollarSign, Mail, Shield, Image, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('pawdeal_token');
      const response = await fetch('http://localhost:5000/api/admin/settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setSettings(data.settings);
      } else {
        setSettings({
          site_name: 'PawDeal',
          site_url: 'http://localhost:5173',
          support_email: 'support@pawdeal.com',
          commission_rate: 5,
          min_payout: 50,
          currency: 'USD',
          maintenance_mode: false,
          registration_enabled: true,
          email_verification_required: true,
          seller_verification_required: true,
          max_pet_images: 10,
          max_product_images: 8,
          pet_listing_duration: 30,
          order_expiry: 24,
          refund_period: 14
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setSettings({
        site_name: 'PawDeal',
        site_url: 'http://localhost:5173',
        support_email: 'support@pawdeal.com',
        commission_rate: 5,
        min_payout: 50,
        currency: 'USD',
        maintenance_mode: false,
        registration_enabled: true,
        email_verification_required: true,
        seller_verification_required: true,
        max_pet_images: 10,
        max_product_images: 8,
        pet_listing_duration: 30,
        order_expiry: 24,
        refund_period: 14
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('pawdeal_token');
      const response = await fetch('http://localhost:5000/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Settings saved successfully');
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-reef" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-foam min-h-screen">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-ocean">Platform Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your marketplace settings</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-reef hover:bg-reef/90 rounded-xl">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Settings
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-white p-1 rounded-xl">
          <TabsTrigger value="general" className="rounded-lg">General</TabsTrigger>
          <TabsTrigger value="commerce" className="rounded-lg">Commerce</TabsTrigger>
          <TabsTrigger value="moderation" className="rounded-lg">Moderation</TabsTrigger>
          <TabsTrigger value="system" className="rounded-lg">System</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="border-border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg text-ocean">General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Site Name</Label>
                  <Input 
                    value={settings?.site_name || ''}
                    onChange={(e) => setSettings({...settings, site_name: e.target.value})}
                    className="border-border rounded-xl mt-1"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground">Site URL</Label>
                  <Input 
                    value={settings?.site_url || ''}
                    onChange={(e) => setSettings({...settings, site_url: e.target.value})}
                    className="border-border rounded-xl mt-1"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground">Support Email</Label>
                  <Input 
                    value={settings?.support_email || ''}
                    onChange={(e) => setSettings({...settings, support_email: e.target.value})}
                    className="border-border rounded-xl mt-1"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground">Currency</Label>
                  <Input 
                    value={settings?.currency || 'USD'}
                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                    className="border-border rounded-xl mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commerce">
          <Card className="border-border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg text-ocean">Commerce Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Commission Rate (%)</Label>
                  <Input 
                    type="number"
                    value={settings?.commission_rate || 5}
                    onChange={(e) => setSettings({...settings, commission_rate: parseFloat(e.target.value)})}
                    className="border-border rounded-xl mt-1"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground">Minimum Payout ($)</Label>
                  <Input 
                    type="number"
                    value={settings?.min_payout || 50}
                    onChange={(e) => setSettings({...settings, min_payout: parseFloat(e.target.value)})}
                    className="border-border rounded-xl mt-1"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground">Order Expiry (hours)</Label>
                  <Input 
                    type="number"
                    value={settings?.order_expiry || 24}
                    onChange={(e) => setSettings({...settings, order_expiry: parseInt(e.target.value)})}
                    className="border-border rounded-xl mt-1"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground">Refund Period (days)</Label>
                  <Input 
                    type="number"
                    value={settings?.refund_period || 14}
                    onChange={(e) => setSettings({...settings, refund_period: parseInt(e.target.value)})}
                    className="border-border rounded-xl mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderation">
          <Card className="border-border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg text-ocean">Moderation Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Max Pet Images</Label>
                  <Input 
                    type="number"
                    value={settings?.max_pet_images || 10}
                    onChange={(e) => setSettings({...settings, max_pet_images: parseInt(e.target.value)})}
                    className="border-border rounded-xl mt-1"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground">Max Product Images</Label>
                  <Input 
                    type="number"
                    value={settings?.max_product_images || 8}
                    onChange={(e) => setSettings({...settings, max_product_images: parseInt(e.target.value)})}
                    className="border-border rounded-xl mt-1"
                  />
                </div>
                <div>
                  <Label className="text-muted-foreground">Pet Listing Duration (days)</Label>
                  <Input 
                    type="number"
                    value={settings?.pet_listing_duration || 30}
                    onChange={(e) => setSettings({...settings, pet_listing_duration: parseInt(e.target.value)})}
                    className="border-border rounded-xl mt-1"
                  />
                </div>
              </div>
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-muted-foreground">Registration Enabled</Label>
                  <Switch 
                    checked={settings?.registration_enabled || true}
                    onCheckedChange={(checked) => setSettings({...settings, registration_enabled: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-muted-foreground">Email Verification Required</Label>
                  <Switch 
                    checked={settings?.email_verification_required || true}
                    onCheckedChange={(checked) => setSettings({...settings, email_verification_required: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-muted-foreground">Seller Verification Required</Label>
                  <Switch 
                    checked={settings?.seller_verification_required || true}
                    onCheckedChange={(checked) => setSettings({...settings, seller_verification_required: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card className="border-border rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg text-ocean">System Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-ocean/5 rounded-xl">
                <div>
                  <Label className="font-medium text-ocean">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Put the site into maintenance mode</p>
                </div>
                <Switch 
                  checked={settings?.maintenance_mode || false}
                  onCheckedChange={(checked) => setSettings({...settings, maintenance_mode: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;