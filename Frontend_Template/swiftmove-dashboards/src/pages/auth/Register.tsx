import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Package } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Register = () => {
  const [role, setRole] = useState<"client" | "driver">("client");
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
            <Package className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">SwiftMove</h1>
        </div>

        <Card className="shadow-card-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create an account</CardTitle>
            <CardDescription>Get started with SwiftMove today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex rounded-lg bg-secondary p-1 mb-6">
              {(["client", "driver"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex-1 text-sm py-2 rounded-md font-medium transition-all ${role === r ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {r === "client" ? "I need a mover" : "I'm a driver"}
                </button>
              ))}
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>

              {role === "driver" && (
                <>
                  <div className="space-y-2">
                    <Label>License Number</Label>
                    <Input placeholder="DL-XX-XXXXX" />
                  </div>
                  <div className="space-y-2">
                    <Label>Driving Experience (years)</Label>
                    <Input type="number" placeholder="5" />
                  </div>
                </>
              )}

              <Button type="submit" className="w-full gradient-brand text-primary-foreground border-0">
                Create Account
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
