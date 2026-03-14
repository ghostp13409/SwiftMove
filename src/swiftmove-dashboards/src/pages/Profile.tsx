import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/userService";
import { addressService } from "@/services/addressService";
import { driverService } from "@/services/driverService";
import type { UserForm, AddressForm, DriverInfo } from "@/types";
import { Loader2, MapPin, Briefcase, User as UserIcon, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddressAutocomplete, AddressResult } from "@/components/AddressAutocomplete";

const Profile = () => {
  const { userId, role } = useAuth();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailField, setEmailField] = useState("");
  const [userName, setUserName] = useState("");
  const [addressId, setAddressId] = useState<number | null>(null);
  
  // Address State
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateOrProvince, setStateOrProvince] = useState("");
  const [country, setCountry] = useState("");
  const [postalOrZipCode, setPostalOrZipCode] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // Driver Info State
  const [driverInfoId, setDriverInfoId] = useState<number | null>(null);
  const [drivingLicense, setDrivingLicense] = useState("");
  const [drivingExperience, setDrivingExperience] = useState("");
  const [range, setRange] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isSavingDriver, setIsSavingDriver] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      try {
        setIsLoading(true);
        const userData = await userService.getUserById(userId);
        if (userData) {
          setFirstName(userData.firstName || "");
          setLastName(userData.lastName || "");
          setEmailField(userData.email || "");
          setUserName(userData.username || "");
          setAddressId(userData.addressId || null);

          // Fetch Address if exists
          if (userData.addressId) {
            try {
              const address = await addressService.getAddress(userData.addressId);
              setLine1(address.line1 || "");
              setLine2(address.line2 || "");
              setCity(address.city || "");
              setStateOrProvince(address.stateOrProvince || "");
              setCountry(address.country || "");
              setPostalOrZipCode(address.postalOrZipCode || "");
              setLatitude(address.latitude || null);
              setLongitude(address.longitude || null);
            } catch (err) {
              console.error("Failed to fetch address:", err);
            }
          }

          // Fetch Driver Info if role is Driver
          if (role === "DRIVER" || role === "Driver") {
            try {
              const driverInfo = await driverService.getDriverByUserId(userId);
              if (driverInfo) {
                setDriverInfoId(driverInfo.id || null);
                setDrivingLicense(driverInfo.drivingLicense || "");
                setDrivingExperience(driverInfo.drivingExperience?.toString() || "");
                setRange(driverInfo.range?.toString() || "");
              }
            } catch (err) {
              console.error("Failed to fetch driver info:", err);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId, role]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    try {
      setIsSaving(true);
      const data: Partial<UserForm> = {
        firstName,
        lastName,
        email: emailField,
        username: userName,
      };
      await userService.updateUserProfile(userId, data);
      toast({
        title: "Profile Updated",
        description: "Your personal information has been saved.",
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err?.message || "Failed to save profile.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    try {
      setIsSavingAddress(true);
      const addressData: AddressForm = {
        line1,
        line2,
        city,
        stateOrProvince,
        country,
        postalOrZipCode,
        latitude: latitude || 0,
        longitude: longitude || 0
      };

      if (addressId) {
        await addressService.updateAddress(addressId, addressData);
      } else {
        const newAddress = await addressService.createAddress(addressData);
        setAddressId(newAddress.id as number);
        await userService.updateUserProfile(userId, { addressId: newAddress.id as number });
      }

      toast({
        title: "Address Updated",
        description: "Your address information has been saved.",
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err?.message || "Failed to save address.",
        variant: "destructive",
      });
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleSaveDriverInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    try {
      setIsSavingDriver(true);
      const driverData = {
        userId,
        drivingLicense,
        drivingExperience: parseInt(drivingExperience),
        range: parseFloat(range),
        currentLatitude: latitude || 0,
        currentLongitude: longitude || 0
      };

      if (driverInfoId) {
        await driverService.updateDriverInfo(driverInfoId, driverData);
      } else {
        const newDriverInfo = await driverService.createDriverProfile(driverData);
        setDriverInfoId(newDriverInfo.id || null);
      }

      toast({
        title: "Driver Info Updated",
        description: "Your professional information has been saved.",
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err?.message || "Failed to save driver info.",
        variant: "destructive",
      });
    } finally {
      setIsSavingDriver(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    if (!userId) return;

    try {
      setIsUpdatingPassword(true);
      const data: Partial<UserForm> = { password: newPassword };
      await userService.updateUserProfile(userId, data);
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err?.message || "Failed to update password.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const onAddressSelect = (res: AddressResult) => {
    setLine1(res.line1);
    setCity(res.city);
    setStateOrProvince(res.stateOrProvince);
    setCountry(res.country);
    setPostalOrZipCode(res.postalOrZipCode);
    setLatitude(res.latitude);
    setLongitude(res.longitude);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl pb-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and professional details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Personal Info */}
          <Card className="shadow-card border-none bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0">
              <UserIcon className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="bg-background/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userName">Username</Label>
                  <Input
                    id="userName"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Username"
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={emailField}
                    onChange={(e) => setEmailField(e.target.value)}
                    placeholder="Email address"
                    className="bg-background/50"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSaving}
                >
                  {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card className="shadow-card border-none bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0">
              <Lock className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Security</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current password"
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="bg-background/50"
                  />
                </div>

                <Button
                  type="submit"
                  variant="outline"
                  className="w-full"
                  disabled={isUpdatingPassword}
                >
                  {isUpdatingPassword ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</> : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Address Info */}
          <Card className="shadow-card border-none bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0">
              <MapPin className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Address Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div className="space-y-2">
                  <Label>Search Address</Label>
                  <AddressAutocomplete 
                    onAddressSelect={onAddressSelect} 
                    defaultValue={line1 ? `${line1}, ${city}` : ""}
                    placeholder="Search for your address..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="line2">Address Line 2 (Optional)</Label>
                  <Input
                    id="line2"
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                    placeholder="Apt, Suite, etc."
                    className="bg-background/50"
                  />
                </div>
                
                {line1 && (
                  <div className="p-3 rounded-lg bg-secondary/20 border text-xs space-y-1 animate-in fade-in duration-300">
                    <p><strong>Selected:</strong> {line1}</p>
                    <p>{city}, {stateOrProvince}, {country}</p>
                    <p>{postalOrZipCode}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSavingAddress}
                >
                  {isSavingAddress ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Address"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Driver Info (Conditional) */}
          {(role === "DRIVER" || role === "Driver") && (
            <Card className="shadow-card border-none bg-card/50 backdrop-blur-sm animate-in fade-in slide-in-from-right-4 duration-500">
              <CardHeader className="flex flex-row items-center gap-2 space-y-0">
                <Briefcase className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Professional Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveDriverInfo} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="drivingLicense">Driving License Number</Label>
                    <Input
                      id="drivingLicense"
                      value={drivingLicense}
                      onChange={(e) => setDrivingLicense(e.target.value)}
                      placeholder="ABC123456"
                      className="bg-background/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input
                        id="experience"
                        type="number"
                        value={drivingExperience}
                        onChange={(e) => setDrivingExperience(e.target.value)}
                        placeholder="5"
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="range">Range (km)</Label>
                      <Input
                        id="range"
                        type="number"
                        value={range}
                        onChange={(e) => setRange(e.target.value)}
                        placeholder="50"
                        className="bg-background/50"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSavingDriver}
                  >
                    {isSavingDriver ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Driver Details"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
