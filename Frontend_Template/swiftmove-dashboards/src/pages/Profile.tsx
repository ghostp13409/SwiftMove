import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Profile = () => (
  <div className="space-y-6 animate-fade-in max-w-2xl">
    <div>
      <h1 className="text-2xl font-bold">Profile</h1>
      <p className="text-sm text-muted-foreground mt-1">Manage your account settings</p>
    </div>
    <Card className="shadow-card">
      <CardHeader><CardTitle className="text-base">Personal Information</CardTitle></CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>First Name</Label><Input defaultValue="John" /></div>
            <div className="space-y-2"><Label>Last Name</Label><Input defaultValue="Doe" /></div>
          </div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" defaultValue="john@example.com" /></div>
          <div className="space-y-2"><Label>Phone</Label><Input defaultValue="416-555-0101" /></div>
          <Button className="gradient-brand text-primary-foreground border-0">Save Changes</Button>
        </form>
      </CardContent>
    </Card>
    <Card className="shadow-card">
      <CardHeader><CardTitle className="text-base">Change Password</CardTitle></CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2"><Label>Current Password</Label><Input type="password" /></div>
          <div className="space-y-2"><Label>New Password</Label><Input type="password" /></div>
          <div className="space-y-2"><Label>Confirm New Password</Label><Input type="password" /></div>
          <Button variant="outline">Update Password</Button>
        </form>
      </CardContent>
    </Card>
  </div>
);

export default Profile;
