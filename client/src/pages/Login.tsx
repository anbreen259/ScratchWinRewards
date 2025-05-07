import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, X } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../lib/auth";

const formSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

const Login = () => {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Login failed");
      }
      
      const data = await response.json();
      
      login(data.token, data.user);
      
      toast({
        title: "Login successful",
        description: "You have been successfully logged in.",
      });
      
      setLocation("/admin");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid username or password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <Button 
          variant="ghost" 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={() => setLocation("/")}
        >
          <X />
        </Button>
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-royal-blue-100 text-royal-blue-600 mb-4">
            <Lock className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-montserrat font-bold text-gray-900">Admin Login</h3>
          <p className="text-gray-500 text-sm">Enter your credentials to access the dashboard</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="admin" 
                      {...field} 
                      className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-royal-blue-500 focus:border-royal-blue-500" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...field} 
                      className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-royal-blue-500 focus:border-royal-blue-500" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm text-gray-600">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />
              <Button variant="link" className="text-sm text-royal-blue-600 hover:text-royal-blue-500">
                Forgot password?
              </Button>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-royal-blue-600 hover:bg-royal-blue-500 text-white py-2 px-4 rounded-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            
            <div className="text-center text-sm text-gray-600 mt-4">
              <p>Default admin: username "admin" password "admin123"</p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
