import { IconPlus } from '@tabler/icons-react';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';

export function CreateDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <IconPlus />
          Create API Key
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New API Key</DialogTitle>
          <DialogDescription>
            This API key is tied to your account and can make requests against
            the whole account.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label htmlFor="name" className="text-right">
            Name
            <span className="font-light text-muted-foreground">Optional</span>
          </Label>
          <Input id="name" placeholder="Secret Key" className="col-span-3" />
        </div>
        <DialogFooter>
          <Button type="submit" size="sm">
            Create API Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
