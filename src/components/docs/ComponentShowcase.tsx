'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export function ComponentShowcase() {
  return (
    <div className="container mx-auto py-10 space-y-10">
      <section>
        <h2 className="text-2xl font-bold mb-4">Buttons</h2>
        <div className="flex gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Inputs</h2>
        <div className="flex gap-4">
          <Input placeholder="Default input" />
          <Input type="password" placeholder="Password input" />
          <Input disabled placeholder="Disabled input" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Verification Card</CardTitle>
              <CardDescription>Example of a verification card</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is a sample card content showing verification details.</p>
            </CardContent>
            <CardFooter>
              <Button>View Details</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Dialog</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verification Details</DialogTitle>
              <DialogDescription>
                View and manage verification details here.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p>Dialog content goes here.</p>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Dropdown Menu</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Open Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Badges</h2>
        <div className="flex gap-4">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge className="doneby-badge-success">Verified</Badge>
          <Badge className="doneby-badge-warning">Pending</Badge>
          <Badge className="doneby-badge-error">Failed</Badge>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Avatar</h2>
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Separator</h2>
        <div className="space-y-4">
          <p>Above separator</p>
          <Separator />
          <p>Below separator</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Tabs</h2>
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="verifications">Verifications</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Make changes to your account settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Account settings content.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="verifications">
            <Card>
              <CardHeader>
                <CardTitle>Verifications</CardTitle>
                <CardDescription>
                  Manage your verification requests.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Verifications content.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Manage your application settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Settings content.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Toast</h2>
        <div className="flex gap-4">
          <Button
            onClick={() => {
              toast('Event has been created', {
                description: 'Sunday, December 03, 2023 at 9:00 AM',
              });
            }}
          >
            Show Toast
          </Button>
        </div>
      </section>
    </div>
  );
} 