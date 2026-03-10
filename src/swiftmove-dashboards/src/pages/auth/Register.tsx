import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Package, Eye, EyeOff, Loader2, MapPin, Briefcase, User as UserIcon, ChevronRight, ChevronLeft } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { addressService } from "@/services/addressService";
import { userService } from "@/services/userService";
import { driverService } from "@/services/driverService";
import { AddressAutocomplete, AddressResult } from "@/components/AddressAutocomplete";

const Register = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"Client" | "Driver">("Client");
  
  // Step 1: User Info
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Step 2: Address Info
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateOrProvince, setStateOrProvince] = useState("");
  const [country, setCountry] = useState("");
  const [postalOrZipCode, setPostalOrZipCode] = useState("");
  
  // Coordinates
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  
  // Step 3: Driver Info
  const [drivingLicense, setDrivingLicense] = useState("");
  const [drivingExperience, setDrivingExperience] = useState("");
  const [range, setRange] = useState("50");

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register, userId } = useAuth();
  const { toast } = useToast();

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !firstName || !lastName || !email || !password || !dob) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      await register(
        email,
        password,
        firstName,
        lastName,
        dob,
        role === "Client" ? "CLIENT" : "DRIVER",
        username,
      );
      setStep(2);
    } catch (err: any) {
      const msg = err?.error || err?.message || "Registration failed. Please try again.";
      toast({
        title: "Registration Failed",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!line1 || !city || !stateOrProvince || !country || !postalOrZipCode) {
      toast({
        title: "Validation Error",
        description: "Please search and select an address to continue.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      // Create address
      const address = await addressService.createAddress({
        line1,
        line2,
        city,
        stateOrProvince,
        country,
        postalOrZipCode,
        latitude,
        longitude
      });
      
      // Update user with addressId
      if (userId) {
        await userService.updateUserProfile(userId, {
          addressId: address.id as number
        });
      }

      if (role === "Driver") {
        setStep(3);
      } else {
        toast({
          title: "Registration Complete",
          description: "Your account has been fully set up.",
        });
        navigate("/client");
      }
    } catch (err: any) {
      toast({
        title: "Address Update Failed",
        description: err?.message || "Could not save address. You can update it later in your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drivingLicense || !drivingExperience) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required driver fields.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      if (userId) {
        await driverService.createDriverProfile({
          userId,
          drivingLicense,
          drivingExperience: parseInt(drivingExperience),
          range: parseFloat(range),
          currentLatitude: latitude,
          currentLongitude: longitude
        });
      }
      toast({
        title: "Registration Complete",
        description: "Your driver profile has been created.",
      });
      navigate("/driver");
    } catch (err: any) {
      toast({
        title: "Driver Info Failed",
        description: err?.message || "Could not save driver info. You can update it later in your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md">
            <img src="/logo.jpg" alt="SwiftMove Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold">SwiftMove</h1>
        </div>

        <Card className="shadow-card-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'} mr-2 text-xs font-bold`}>1</div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'} mr-2 text-xs font-bold`}>2</div>
              {role === "Driver" && (
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'} text-xs font-bold`}>3</div>
              )}
            </div>
            <CardTitle className="text-xl">
              {step === 1 && "Create an account"}
              {step === 2 && "Where are you located?"}
              {step === 3 && "Driver Information"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Step 1: Personal Details"}
              {step === 2 && "Step 2: Address Information"}
              {step === 3 && "Step 3: Professional Details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <>
                <div className="flex rounded-lg bg-secondary p-1 mb-6">
                  {(["Client", "Driver"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex-1 text-sm py-2 rounded-md font-medium transition-all ${role === r ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {r === "Client" ? "I need a mover" : "I'm a driver"}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleStep1Submit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input
                      placeholder="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={dob ? dob.toISOString().split("T")[0] : ""}
                      onChange={(e) =>
                        setDob(e.target.value ? new Date(e.target.value) : null)
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full gradient-brand text-primary-foreground border-0"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating
                        account...
                      </>
                    ) : (
                      <>Next Step <ChevronRight className="w-4 h-4 ml-2" /></>
                    )}
                  </Button>
                </form>
              </>
            )}

            {step === 2 && (
              <form onSubmit={handleStep2Submit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Search Address</Label>
                  <AddressAutocomplete 
                    onAddressSelect={onAddressSelect} 
                    placeholder="Search for your address..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address Line 2 (Optional)</Label>
                  <Input
                    placeholder="Apt, Suite, etc."
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                    disabled={isLoading}
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
                  className="w-full gradient-brand text-primary-foreground border-0"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                    </>
                  ) : (
                    role === "Driver" ? 
                    <>{'Next Step '} <ChevronRight className="w-4 h-4 ml-2" /></> : 
                    "Complete Registration"
                  )}
                </Button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleStep3Submit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Driving License Number</Label>
                  <Input
                    placeholder="ABC123456"
                    value={drivingLicense}
                    onChange={(e) => setDrivingLicense(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Years of Experience</Label>
                  <Input
                    type="number"
                    placeholder="5"
                    value={drivingExperience}
                    onChange={(e) => setDrivingExperience(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Operating Range (km)</Label>
                  <Input
                    type="number"
                    placeholder="50"
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-brand text-primary-foreground border-0"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </Button>
              </form>
            )}

            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
