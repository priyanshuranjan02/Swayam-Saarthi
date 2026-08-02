import { useEffect, useState } from "react";
import { Loader2, Mail, Phone, Shield, User } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Pencil, X } from "lucide-react";
import { Eye, EyeOff, Lock, KeyRound } from "lucide-react";
import {CheckCircle2, Calendar} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  role: string;
}

type PasswordInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

const PasswordInput = ({
  label,
  value,
  onChange,
  show,
  setShow,
}: PasswordInputProps) => (
  <div>
    <label className="text-sm font-medium">{label}</label>

    <div className="relative mt-2">
      <Input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pr-12"
      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2"
      >
        {show ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    </div>
  </div>
);


const ProfileSkeleton = () => (
  <div className="space-y-8">

    <Skeleton className="h-10 w-56" />

    <Card className="p-6 space-y-6">

      <Skeleton className="h-32 w-32 rounded-full mx-auto" />

      <Skeleton className="h-10 w-full" />

      <Skeleton className="h-10 w-full" />

      <Skeleton className="h-10 w-full" />

      <Skeleton className="h-10 w-40" />

    </Card>

    <Card className="p-6 space-y-5">

      <Skeleton className="h-8 w-48" />

      <Skeleton className="h-10 w-full" />

      <Skeleton className="h-10 w-full" />

      <Skeleton className="h-10 w-full" />

      <Skeleton className="h-10 w-full" />

    </Card>

  </div>
);


const Profile = () => {
    const { role } = useAuth();

    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    const [formData, setFormData] = useState({
      name: "",
      phone: "",
    });

    const [saving, setSaving] = useState(false);
        const [passwordData, setPasswordData] = useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    const [changingPassword, setChangingPassword] = useState(false);

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const fetchProfile = async () => {        
      try {
        let endpoint = "";

        switch (role) {
          case "driver":
            endpoint = "/driver/profile";
            break;
        
          case "admin":
            endpoint = "/admin/profile";
            break;
        
          default:
            endpoint = "/users/profile";
        }

        const res = await api.get(endpoint);

        const data = res.data.data;

        setProfile(data);

        setFormData({
          name: data.name || "",
          phone: data.phone || "",
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    const updateProfile = async () => {
      try {
        setSaving(true);

        let endpoint = "";

        switch (role) {
          case "driver":
            endpoint = "/driver/profile";
            break;

          case "admin":
            endpoint = "/admin/profile";
            break;

          default:
            endpoint = "/users/profile";
        }

        const res = await api.put(endpoint, formData);

        setProfile(res.data.data);

        toast.success("Profile updated successfully");

        setEditing(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to update profile");
      } finally {
        setSaving(false);
      }
    };

    const changePassword = async () => {
      if (
        !passwordData.currentPassword ||
        !passwordData.newPassword ||
        !passwordData.confirmPassword
      ) {
        toast.error("Please fill all fields");
        return;
      }

      if (passwordData.newPassword.length < 6) {
        toast.error("Password should be at least 6 characters");
        return;
      }

      if (
        passwordData.newPassword !==
        passwordData.confirmPassword
      ) {
        toast.error("Passwords do not match");
        return;
      }

      try {
        setChangingPassword(true);

        let endpoint = "";

        switch (role) {
          case "driver":
            endpoint = "/driver/change-password";
            break;

          case "admin":
            endpoint = "/admin/change-password";
            break;

          default:
            endpoint = "/users/change-password";
        }

        await api.put(endpoint, {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        });

        toast.success("Password changed successfully");

        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

      } catch (error: any) {

        toast.error(
          error?.response?.data?.message ||
          "Failed to change password"
        );

      } finally {
        setChangingPassword(false);
      }
    };

    useEffect(() => {
      if (role) {
        fetchProfile();
      }
    }, [role]);

    if (loading) {
        return (
            <PageLayout>
                <ProfileSkeleton />
            </PageLayout>
        );
    }

    const roleStyles = {
      user: {
        label: "User",
        className:
          "bg-blue-500/20 text-blue-600 dark:text-blue-400",
      },

      driver: {
        label: "Driver",
        className:
          "bg-green-500/20 text-green-600 dark:text-green-400",
      },

      admin: {
        label: "Administrator",
        className:
          "bg-purple-500/20 text-purple-600 dark:text-purple-400",
      },
    };

    const getPasswordStrength = (password: string) => {
      if (!password) {
        return {
          label: "",
          percentage: 0,
          color: "",
          textColor: "",
        };
      }

      let score = 0;

      if (password.length >= 8) score += 20;
      if (/[a-z]/.test(password)) score += 20;
      if (/[A-Z]/.test(password)) score += 20;
      if (/\d/.test(password)) score += 20;
      if (/[^A-Za-z0-9]/.test(password)) score += 20;

      if (score <= 40)
        return {
          label: "Weak",
          percentage: score,
          color: "bg-red-500",
          textColor: "text-red-500",
        };

      if (score <= 80)
        return {
          label: "Medium",
          percentage: score,
          color: "bg-yellow-500",
          textColor: "text-yellow-500",
        };

      return {
        label: "Strong",
        percentage: score,
        color: "bg-green-500",
        textColor: "text-green-500",
      };
    };

    const passwordStrength = getPasswordStrength(
      passwordData.newPassword
    );

    return (
      <PageLayout>
        <div className="page-container">
          <div className="max-w-3xl mx-auto">

            <h1 className="text-3xl font-bold mb-8">
              My <span className="gradient-text">Profile</span>
            </h1>

            <div className="glass-card p-8">

              <div className="flex flex-col items-center mb-10">

                  {/* Avatar */}

                  <div className="h-28 w-28 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center shadow-lg">

                    <span className="text-4xl font-bold tracking-wide">
                      {profile?.name
                        ?.split(" ")
                        .map((word) => word[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()}
                    </span>
                    
                  </div>
                    
                  {/* Name */}
                    
                  <h2 className="text-3xl font-bold mt-5">
                    {profile?.name}
                  </h2>
                    
                  {/* Role */}
                    
                  <p className="text-muted-foreground mt-1 capitalize">
                    {profile?.role}
                  </p>
                    
                  {/* Verified */}
                    
                  {(profile?.role === "admin" ||
                    profile?.role === "driver") && (
                    
                    <div className="mt-3 flex items-center gap-2 rounded-full bg-green-500/15 px-4 py-2">
                    
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        Verified Account
                      </span>
                    
                    </div>

                  )}

                  {/* Joined */}
              
                  <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              
                    <Calendar className="h-4 w-4" />
              
                    <span>
                      Member since{" "}
                      {new Date().getFullYear()}
                    </span>
              
                  </div>
              
                </div>

              {/* Profile Details */}

              <div className="space-y-6">

                <div className="flex items-center gap-4">

                  <Mail className="text-primary h-5 w-5" />

                  <div>

                    <p className="text-sm text-muted-foreground">
                      Email
                    </p>

                    <p className="font-medium">
                      {profile?.email}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-4">

                  <Phone className="text-primary h-5 w-5" />

                  <div>

                    <p className="text-sm text-muted-foreground">
                      Phone
                    </p>

                    {editing ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="font-medium">
                        {profile?.phone || "Not Added"}
                      </p>
                    )}

                  </div>

                </div>

                <div className="flex items-center gap-4">

                  <Shield className="text-primary h-5 w-5" />

                  <div>

                    <p className="text-sm text-muted-foreground">
                      Role
                    </p>

                    <p className="font-medium capitalize">
                      {profile?.role}
                    </p>

                  </div>

                </div>

              </div>

              <div className="mt-8 flex justify-end gap-3">

              {!editing ? (
            
                <Button
                  onClick={() => setEditing(true)}
                  className="gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Profile
                </Button>
            
              ) : (
            
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditing(false);
                    
                      setFormData({
                        name: profile?.name || "",
                        phone: profile?.phone || "",
                      });
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                
                  <Button
                    onClick={updateProfile}
                    disabled={saving}
                  >
                    <Save className="h-4 w-4 mr-2" />
                
                    {saving ? "Saving..." : "Save Changes"}
                
                  </Button>
                </>
            
              )}
            </div>

              <div className="glass-card p-8 mt-8">

              <div className="flex items-center gap-3 mb-6">

                <KeyRound className="h-6 w-6 text-primary" />

                <h2 className="text-xl font-semibold">
                  Change Password
                </h2>

              </div>

              <div className="space-y-5">

                <PasswordInput
                  label="Current Password"
                  value={passwordData.currentPassword}
                  show={showCurrent}
                  setShow={setShowCurrent}
                  onChange={(value) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: value,
                    })
                  }
                />

                <PasswordInput
                  label="New Password"
                  value={passwordData.newPassword}
                  show={showNew}
                  setShow={setShowNew}
                  onChange={(value) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: value,
                    })
                  }
                />

                {passwordData.newPassword && (
                  <div className="space-y-2">
                
                    <div className="flex justify-between text-sm">

                      <span>Password Strength</span>

                      <span className={passwordStrength.textColor}>
                        {passwordStrength.label}
                      </span>

                    </div>

                    <div className="h-2 rounded-full bg-muted overflow-hidden">

                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{
                          width: `${passwordStrength.percentage}%`,
                        }}
                      />

                    </div>
                    
                  </div>
                )}

                <div className="text-xs text-muted-foreground space-y-1">

                  <p>
                    ✓ Minimum 8 characters
                  </p>
                            
                  <p>
                    ✓ Uppercase & lowercase letters
                  </p>
                            
                  <p>
                    ✓ Numbers
                  </p>
                            
                  <p>
                    ✓ Special characters
                  </p>
                            
                </div>

                <PasswordInput
                  label="Confirm Password"
                  value={passwordData.confirmPassword}
                  show={showConfirm}
                  setShow={setShowConfirm}
                  onChange={(value) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: value,
                    })
                  }
                />

                <Button
                  onClick={changePassword}
                  disabled={changingPassword}
                  className="w-full"
                >
                  {changingPassword
                    ? "Updating..."
                    : "Update Password"}
                </Button>
                
              </div>
                
            </div>
            </div>

          </div>
        </div>
      </PageLayout>
    );
};  

export default Profile;