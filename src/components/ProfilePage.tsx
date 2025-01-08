import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const ProfilePage = () => {
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src="/path/to/avatar.jpg" alt="User Avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-semibold">John Doe</h1>
          <p className="text-gray-500">johndoe@example.com</p>
        </div>
      </div>
      <div>
        <label htmlFor="language" className="block text-sm font-medium text-gray-700">
          Language
        </label>
        <Input type="text" id="language" name="language" defaultValue="English" />
      </div>
      <Button variant="default" size="default">
        Edit
      </Button>
    </div>
  );
};

export default ProfilePage;
