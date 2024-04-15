import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRightIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import Balancer from "react-wrap-balancer";
import { z } from "zod";

const profileFormSchema = z.object({
  team_name: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  team_description: z.string().max(160).min(4),
  team_image_url: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function CreateTeamPage() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    console.log(data);

    const formData = {
      team_name: data.team_name,
      team_description: data.team_description,
      team_image_url: data.team_image_url,
    };

    fetch('/api/teams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to create team');
        }
        return response.json();
      })
      .then(data => {
        console.log('Team created:', data);
        toast({
          title: "Your team is created !",
        });
        setTimeout(() => {
          window.location.href = '/dashboard/teams';
        }, 1000);
      })
      .catch(error => {
        console.error('Error creating team:', error);
        toast({
          title: "Failed to create team",
        });
      });
  }

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            Dashboard
          </div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="font-medium text-foreground">Create My Team</div>
        </div>
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Create My Team
          </h1>
          <p className="text-lg text-muted-foreground">
            <Balancer>This is the protected team creation page.</Balancer>
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="team_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Give a name at your team !"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name. It can be your real name
                    or a pseudonym. You can only change this once every 30 days.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="team_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about your team..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can <span>@mention</span> other users and organizations
                    to link to them.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="team_image_url"
              render={({ field }) => (
                <FormItem className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="picture">Picture</Label>
                  <Input id="picture" type="file" {...field} />
                </FormItem>
              )}
            />
            <Button type="submit">Create My Team</Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
