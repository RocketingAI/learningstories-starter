"use client";

import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardContent } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Pencil, X, Check } from "lucide-react";
import { cn } from "../../lib/utils";
import Link from "next/link";

const languages = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Chinese", value: "zh" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
] as const;

export default function ProfilePage() {
  const [isEditing, setIsEditing] = React.useState(false);
  const [value, setValue] = React.useState("en");
  const [avatarFile, setAvatarFile] = React.useState<string | null>(null);
  const [name, setName] = React.useState("John Doe");
  const [email, setEmail] = React.useState("johndoe@example.com");
  const [tempValues, setTempValues] = React.useState({
    name: "John Doe",
    email: "johndoe@example.com",
    language: "en",
    avatar: null as string | null
  });
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && isEditing) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempValues(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel changes
      setTempValues({
        name,
        email,
        language: value,
        avatar: avatarFile
      });
    } else {
      // Start editing with current values
      setTempValues({
        name,
        email,
        language: value,
        avatar: avatarFile
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Save changes
    setName(tempValues.name);
    setEmail(tempValues.email);
    setValue(tempValues.language);
    setAvatarFile(tempValues.avatar);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-black p-8 space-y-6">
      <Card className="max-w-2xl mx-auto border-zinc-800 bg-zinc-950">
        <CardHeader className="flex flex-row items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={handleEditToggle}
            className="h-8 w-8 bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800"
          >
            {isEditing ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Header Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <Avatar className={cn(
                "h-24 w-24 border-4 border-zinc-800 shadow-lg transition-shadow duration-200",
                isEditing && "hover:shadow-xl cursor-pointer"
              )}>
                <AvatarImage 
                  src={isEditing ? tempValues.avatar || "/path/to/avatar.jpg" : avatarFile || "/path/to/avatar.jpg"} 
                  alt="User Avatar" 
                  className="object-cover" 
                />
                <AvatarFallback className="text-lg bg-zinc-800 text-zinc-400">
                  {tempValues.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                accept="image/*"
                className="hidden"
                disabled={!isEditing}
              />
              {isEditing && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </Button>
              )}
            </div>
            <div className="text-center space-y-2">
              {isEditing ? (
                <>
                  <Input
                    value={tempValues.name}
                    onChange={(e) => setTempValues(prev => ({ ...prev, name: e.target.value }))}
                    className="text-center bg-zinc-900 border-zinc-800 text-white"
                  />
                  <Input
                    value={tempValues.email}
                    onChange={(e) => setTempValues(prev => ({ ...prev, email: e.target.value }))}
                    className="text-center bg-zinc-900 border-zinc-800 text-white"
                    type="email"
                  />
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-white">{name}</h2>
                  <p className="text-zinc-400">{email}</p>
                </>
              )}
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="grid gap-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm font-medium text-zinc-400">
                Preferred Language
              </Label>
              <Select
                value={isEditing ? tempValues.language : value}
                onValueChange={(val) => isEditing && setTempValues(prev => ({ ...prev, language: val }))}
                disabled={!isEditing}
              >
                <SelectTrigger className="w-full bg-zinc-900 border-zinc-800 text-white">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  {languages.map((language) => (
                    <SelectItem 
                      key={language.value} 
                      value={language.value}
                      className="text-white hover:bg-zinc-800"
                    >
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isEditing && (
              <Button 
                variant="default" 
                size="lg"
                onClick={handleSave}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
              >
                Save Changes
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Subscription Status Card */}
      <Card className="max-w-2xl mx-auto border-zinc-800 bg-zinc-950">
        <CardHeader>
          <h2 className="text-2xl font-bold text-white">Subscription Status</h2>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            {/* Plan Details */}
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-white">Pro Plan</h3>
                <p className="text-sm text-zinc-400">Billed Monthly</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">$29</p>
                <p className="text-sm text-zinc-400">/month</p>
              </div>
            </div>

            {/* Subscription Info */}
            <div className="pt-4 border-t border-zinc-800">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm text-zinc-400">Next billing date</p>
                  <p className="text-base text-white">February 8, 2025</p>
                </div>
                <div className="flex items-center space-x-1 text-emerald-500">
                  <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                  <span className="text-sm">Active</span>
                </div>
              </div>
            </div>

            {/* Manage Subscription Button */}
            <Button 
              variant="outline" 
              className="mt-4 w-full bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800"
            >
              Manage Subscription
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Organization Settings Card */}
      <Card className="max-w-2xl mx-auto border-zinc-800 bg-zinc-950">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Organization Settings</h2>
            <p className="text-sm text-zinc-400 mt-1">Manage your organization's settings and billing</p>
          </div>
          <Button
            variant="outline"
            asChild
            className="h-8 bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800"
          >
            <Link href="/organization/settings">
              Edit Org Settings
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Organization Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-zinc-400">Organization Name</Label>
            <div className="text-lg font-semibold text-white">Acme Corporation</div>
          </div>

          {/* Billing Overview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Billing Overview</h3>
            <div className="grid gap-4 p-4 rounded-lg bg-zinc-900/50">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-zinc-400">Current Plan</p>
                  <p className="text-base font-medium text-white">Enterprise</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-zinc-400">Price</p>
                  <p className="text-base font-medium text-white">$299/month</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-zinc-400">Renewal Date</p>
                  <p className="text-base font-medium text-white">February 8, 2025</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-zinc-400">Billing Status</p>
                  <div className="flex items-center space-x-1.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                    <p className="text-base font-medium text-white">Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Users */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Active Users</h3>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-white">47</span>
                <span className="text-sm text-zinc-400">/ 50 seats</span>
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full" 
                style={{ width: '94%' }}
              ></div>
            </div>
            <p className="text-sm text-zinc-400 text-right">3 seats remaining</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
